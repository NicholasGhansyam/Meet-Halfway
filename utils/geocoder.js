const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
  
    
    apiKey: '6iWF9qui3e4YKroiomuNSZ37iF8VmQ1b', 
    formatter: null 
} 
const geocoder = NodeGeocoder(options);

module.exports = geocoder
  
