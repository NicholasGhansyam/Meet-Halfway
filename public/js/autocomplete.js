const script = document.getElementById('search-js');
script.onload = function() {
    mapboxsearch.autofill({
        accessToken: 'pk.eyJ1IjoibmljaG9sYXNnaGFuc3lhbSIsImEiOiJjbDhkaHozb2QwY3c1M3VteXphb2c0dzBxIn0.GbFibJJRaO_9PnF-r_hmOg'
    });
};

mapboxgl.accessToken = 'pk.eyJ1IjoibmljaG9sYXNnaGFuc3lhbSIsImEiOiJjbDhkaHozb2QwY3c1M3VteXphb2c0dzBxIn0.GbFibJJRaO_9PnF-r_hmOg';
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
})
  
function successLocation(position) {
setupMap([position.coords.longitude, position.coords.latitude])
}

function errorLocation() {
setupMap([-2.24, 53.48])
}

function setupMap(center) {
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: center,
    zoom: 15
})

const nav = new mapboxgl.NavigationControl()
map.addControl(nav)
}



/*
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-77.034084, 38.909671],
  zoom: 12,
  scrollZoom: false
});
*/