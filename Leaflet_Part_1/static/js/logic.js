//Create the map object
let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4.5,
    // layers: [street, earthquakes]
});

//Adding the tile layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreemap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Load the GeoJSON data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//Use D3 to get data
d3.json(geoData).then(function (data) {
    //send data.features object to quakeFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    //This function runs for each feature in array. This features gives a marker and popup.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${feature.properties.mag}</p>`);
    }


//Creat geoJSON layer that contains features array on the quakeFeatures object
//Run the onEachFeature function once for each piece of data in the array
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
});

//Send the earthquakes layer to the createMap function
createMap(earthquakes);
}

// function createMap(earthquakes) {

//     // Create the base layers.
//     let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     })
  
//     let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     });
  
//     // Create a baseMaps object.
//     let baseMaps = {
//       "Street Map": street,
//       "Topographic Map": topo
//     };
  
//     // Create an overlay object to hold our overlay.
//     let overlayMaps = {
//       Earthquakes: earthquakes
//     };

//     // Create a layer control.
//     // Pass it our baseMaps and overlayMaps.
//     // Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(myMap);
  
//   }
  
