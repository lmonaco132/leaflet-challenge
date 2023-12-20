// get dataset

// define url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// api call using url
d3.json(url).then(function(data) {
    // here is where i call a function using the returned data
    createFeatures(data.features);

    // testing
    //console.log(data);
});


// now i define create features
function createFeatures(eqdata) {
    // this is the function called from within the json call with json data

    // define on each feature function to add info for popup
    function onEachFeature(feature, layer) {
        // add the popup with the earthquake id has header, and paragraph containing magnitude, depth, and location
        layer.bindPopup(`<h3> Earthquake: ${feature.id}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Location: ${feature.properties.place}</p>`);
    }

    function pointToLayer(feature, latlng) {
        // this creates the circle marker with the right size and color
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 5,
            fillColor: setMarkColor(feature.geometry.coordinates[2]),
            color: setMarkColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.9
        })
    }

    // use geojson function to use oneachfeature function & pointtolayer function
    let earthquakes = L.geoJSON(eqdata, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });
    
    
    // function to define marker color based on magnitude
    function setMarkColor(depth) {
        if (depth < 10) {
            return "#bae815";
        }
        else if (depth < 20) {
            return "#e1e815";
        }
        else if (depth < 30) {
            return "#e0e031";
        }
        else if (depth < 50) {
            return "#d4b819";
        }
        else {
            return "#e05712";
        }
    }

    // define street layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // define topography layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // create basemaps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
      };

    // overlays
    let overlayMaps = {
        Earthquakes: earthquakes
      };
    
    
    // define mymap using center coords and zoom to get map of US
    let myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [street, topo]
      });
    
    // add layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    

      // only problem i have is that the earthquakes toggle on the map defaults to off, not sure why
}