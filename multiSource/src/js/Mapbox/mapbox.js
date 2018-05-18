mapboxgl.accessToken = 'pk.eyJ1Ijoia3JnZmYiLCJhIjoiY2pneHYyMTZmMWdpbTJ4bjAyOTRka3pmbiJ9.QzZJfoOueJ8wfmo0NCHGQQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-100.486052, 37.830348],
    zoom: 2
});

map.on('load', function () {
    map.addSource("states", {
        "type": "geojson",
        "data": "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    });

    map.addLayer({
        "id": "state-fills",
        "type": "fill",
        "source": "states",
        "layout": {},
        "paint": {
            // "fill-color": "#627BC1",
            "fill-opacity": 0
        }
    });

    // map.addLayer({
    //     "id": "state-borders",
    //     "type": "line",
    //     "source": "states",
    //     "layout": {},
    //     "paint": {
    //         "line-color": "#627BC1",
    //         "line-width": 2
    //     }
    // });

    // // map.addLayer({
    // //     "id": "state-fills-hover",
    // //     "type": "fill",
    // //     "source": "states",
    // //     "layout": {},
    // //     "paint": {
    // //         "fill-color": "#FFFFFF",
    // //         "fill-opacity": 1
    // //     },
    // //     "filter": ["==", "name", ""]
    // // });

    // When the user moves their mouse over the page, we look for features
    // at the mouse position (e.point) and within the states layer (states-fill).
    // If a feature is found, then we'll update the filter in the state-fills-hover
    // layer to only show that state, thus making a hover effect.
    // map.on("mousemove", function(e) {
    //     var features = map.queryRenderedFeatures(e.point, { layers: ["state-fills"] });
    //     if (features.length) {
    //         map.getCanvas().style.cursor = 'pointer';
    //         map.setFilter("state-fills-hover", ["==", "name", features[0].properties.name]);
    //     } else {
    //         map.setFilter("state-fills-hover", ["==", "name", ""]);
    //         map.getCanvas().style.cursor = '';
    //     }
    // });

    // // Reset the state-fills-hover layer's filter when the mouse leaves the map
    // map.on("mouseout", function() {
    //     map.getCanvas().style.cursor = 'auto';
    //     map.setFilter("state-fills-hover", ["==", "name", ""]);
    // });
  
    map.on("click", function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["state-fills"] });
        if (features.length) {
            window.location = 'https://en.wikipedia.org/wiki/' + features[0].properties.ADMIN
        }
    });
});