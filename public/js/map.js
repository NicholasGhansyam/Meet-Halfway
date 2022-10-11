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
    const mapQuestRes = await fetch(`http://www.mapquestapi.com/search/v2/search?key=6iWF9qui3e4YKroiomuNSZ37iF8VmQ1b&maxMatches=15&shapePoints=${lonToSearch},${latToSearch}`)
    const mapQuestData = await mapQuestRes.json() 
    //console.log(mapQuestData)

    const halfways = mapQuestData.searchResults.map(halfway => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [halfway.fields.mqap_geography.latLng.lng, halfway.fields.mqap_geography.latLng.lat]
            },
            
            properties:{
                halfwayID: halfway.fields.id,
                halfwayName: halfway.fields.name,
                halfwayAddress: halfway.fields.address,
                halfwayCity: halfway.fields.city,
                halfwayLink: `https://www.google.com/maps/search/?api=1&query=${halfway.fields.mqap_geography.latLng.lat}%2C${halfway.fields.mqap_geography.latLng.lng}`
            }
        }
    })
    
    setupMap([latToSearch,lonToSearch],halfways)
    
}


function setupMap(center,halfways){
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        zoom: 12,
        center: center
    })

        // disable map rotation using right click + drag
    map.dragRotate.disable();
    
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();



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
                    'id': 'location',
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
                
                buildLocationList(halfways);

            }
        );
    })

    map.on('click', (event) => {
        
        /* Determine if a feature in the "locations" layer exists at that point. */
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['location']
        });
        console.log(event.point)
        /* If it does not exist, return */
        if (!features.length){
            console.log("no features")
            return;
        } 
      
        const clickedPoint = features[0];
      
        /* Fly to the point */
        //flyToHalfway(clickedPoint);
        map.flyTo({
            center: clickedPoint.geometry.coordinates,
            zoom: 15
        })
      
        /* Close all other popups and display popup for clicked store */
        //createPopUp(clickedPoint);
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        /** Check if there is already a popup on the map and if so, remove it */
        if (popUps[0]) popUps[0].remove();
        
        const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(clickedPoint.geometry.coordinates)
        .setHTML(`<h3><a href="${clickedPoint.properties.halfwayLink}" target="_blank" title="Opens in a new window">${clickedPoint.properties.halfwayName}</a></h3><h4>${clickedPoint.properties.halfwayAddress}</h4><sup>Click address to route to destination</sup>`)
        .addTo(map);
    
      
        /* Highlight listing in sidebar (and remove highlight for all other listings) */
      });

          
    const nav = new mapboxgl.NavigationControl()
    map.addControl(nav)

}


function buildLocationList(halfways){
    for (const halfway of halfways) {

        /* Add a new listing section to the sidebar. */
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */

        //const id = Math.floor(Math.random() * Date.now())
        listing.id = `listing-${halfway.properties.halfwayID}`;
        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';
    
        /* Add the link to the individual listing created above. */
        const link = listing.appendChild(document.createElement('a'));
        link.href = `${halfway.properties.halfwayLink}`;
        link.target = '_blank'
        link.className = 'title';
        link.id = `link-${halfway.properties.halfwayID}`;
        link.innerHTML = `${halfway.properties.halfwayName}`;
    
        /* Add details to the individual listing. */
        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${halfway.properties.halfwayAddress} ${halfway.properties.halfwayCity}`;

        link.addEventListener('click', function () {
            
            for (const feature of halfways) {
              if (this.id === `link-${feature.properties.HalfwayId}`) {
                flyToStore(feature);
                createPopUp(feature);
              }
            }
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
          });

      }
}

function flyToHalfway(currentHalfway){
    map.flyTo({
        center: currentHalfway.geometry.coordinates,
        zoom: 15
    })
}

function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popUps[0]) popUps[0].remove();
  
    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(`<h3>${currentFeature.properties.halfwayName}</h3><h4>${currentFeature.properties.halfwayAddress}</h4><h4>${currentFeature.properties.halfwayLink}</h4>`)
      .addTo(map);
}


//setupMap()
getHalfways()

