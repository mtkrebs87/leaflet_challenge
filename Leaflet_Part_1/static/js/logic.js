//Create the map object
let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4.5,
   
});

//Adding the tile layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreemap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Load the GeoJSON data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Use D3 to get data from GeoJSON data
d3.json(geoData).then(function (data) {
    //send data.features object to createFeatures function
    createFeatures(data.features);

    console.log(data);
});

function createFeatures(earthquakeData) {

    //This function runs for each feature in array. This features gives a marker and popup.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }


//Creat geoJSON layer that contains features array on the earthquakeFeatures object
//Run the onEachFeature function once for each piece of data in the array
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    //Alter markers with Point to Layer
    pointToLayer: function(feature, latlng) {

        //Design markers based on properties
        let markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.8,
            color: "black",
            weight: 0.5
        }
        return L.circle(latlng, markers);
    }

});



//function to determine marker size by magnitude
function markerSize(magnitude) {
    return magnitude * 25000;
};

//function to change color of marker by depth
function markerColor(depth) {
    if (depth < 10) return "#02F76C";
    else if (depth < 30) return "#01BC52";
    else if (depth < 50) return "#01843A";
    else if (depth < 70) return "#00632B";
    else if (depth < 90) return "#003818";
    else return "#000703";

}

//Send the earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };

    //Create Map Legend
    let legend = L.control({position: "bottomright"});
    
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];
    
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
    
        for (var i=0; i < depth.length; i++) {
             div.innerHTML +=
            '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i+1] + '<br>' : '+');
        }
    
        return div;
    };
    
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


  
  }
  
