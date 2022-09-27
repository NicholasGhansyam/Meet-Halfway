mapboxgl.accessToken = 'pk.eyJ1IjoibmljaG9sYXNnaGFuc3lhbSIsImEiOiJjbDhkaHozb2QwY3c1M3VteXphb2c0dzBxIn0.GbFibJJRaO_9PnF-r_hmOg';
const id = document.currentScript.getAttribute('varID')
// Fetch Routes from API
async function getHalfways(){
    const res = await fetch(`/api/v1/halfway/${id}`)
    const data = await res.json()

    // Find the midpoint between the two entered coordinates
    const latToSearch = (data.data[0].locationA.coordinates[0] + data.data[0].locationB.coordinates[0]) / 2
    const lonToSearch = (data.data[0].locationA.coordinates[1] + data.data[0].locationB.coordinates[1]) / 2
    
    //console.log(latToSearch,lonToSearch)

    //Fetch from the mapquest API 
    const mapQuestRes = await fetch(`http://www.mapquestapi.com/search/v2/search?key=6iWF9qui3e4YKroiomuNSZ37iF8VmQ1b&maxMatches=10&shapePoints=${lonToSearch},${latToSearch}`)
    const mapQuestData = await mapQuestRes.json() 
    //onsole.log(mapQuestData)

    const halfways = mapQuestData.searchResults.map(halfway => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [halfway.fields.mqap_geography.latLng.lng, halfway.fields.mqap_geography.latLng.lat]
            },
            
            properties:{
                halfwayID: halfway.fields.name,
                halfwayLink: `<p><a href="https://www.google.com/maps/search/?api=1&query=${halfway.fields.mqap_geography.latLng.lat}%2C${halfway.fields.mqap_geography.latLng.lng}" target="_blank" title="Opens in a new window"> ${halfway.fields.name}</a> <br> ${halfway.fields.address} ${halfway.fields.city} ${halfway.fields.state} ${halfway.fields.postal_code} <br> <br> <sup> Click the link to route to destination </sup></p>`
            }
        }
    })
    
    setupMap([latToSearch,lonToSearch,],halfways)
    
}


function setupMap(center,halfways){
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 12,
        center: center
    })



    map.on('load', function() {
        map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
            (error, image) => {
                if (error) throw error;
                map.addImage('custom-marker', image);
                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                    'type': 'FeatureCollection',
                    'features': halfways
                    }
                });
            
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'custom-marker',
                        'icon-allow-overlap': true,
                        // get the title name from the source's "title" property
                        'text-field': '',
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                            ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    }
                });

                map.on('click', 'points', (e) => {
                    console.log(`A click event has occurred at ${e.lngLat}`);

                    console.log(e.features[0].properties.description);
                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const description = e.features[0].properties.halfwayLink;
                     
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                     
                    new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
                    });
                     
                    // Change the cursor to a pointer when the mouse is over the places layer.
                    map.on('mouseenter', 'points', () => {
                    map.getCanvas().style.cursor = 'pointer';
                    });
                     
                    // Change it back to a pointer when it leaves.
                    map.on('mouseleave', 'points', () => {
                    map.getCanvas().style.cursor = '';
                    });
                    
            }
        );
    })

}
//setupMap()
getHalfways()

