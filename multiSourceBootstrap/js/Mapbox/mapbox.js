mapboxgl.accessToken = 'pk.eyJ1Ijoia3JnZmYiLCJhIjoiY2pneHYyMTZmMWdpbTJ4bjAyOTRka3pmbiJ9.QzZJfoOueJ8wfmo0NCHGQQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-0, 37.830348],
  zoom: 1.5
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

  // Functie die het klikken op de map regelt
  map.on("click", function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["state-fills"]
    });
    var country = "";
    if (features.length) {
      var land = features[0].properties.ADMIN;
       console.log(land);

      for (let i = 0; i < ISO_a2.length; i++) {
        for (let j = 0; j < ISO_a2[i].length; j++) {
          if (ISO_a2[i][0] == land) {
            country = ISO_a2[i][1]
            console.log(country);            
          }
        }
      }
      var url = "https://newsapi.org/v2/top-headlines?" +
        "country=" + country + "&apiKey=c0dd3e7f7a9840528c87934d92d511e0";
        console.log(url);
      var req = new Request(url);
      var articles = [];
      fetch(req)
        .then(response => response.json())
        .then(data => articles.push(data.articles))
        .then(console.log(articles));
    };






      // if (features.length && features[0].properties.ADMIN != "United States of America" ) {
      //   window.location = 'https://en.wikipedia.org/wiki/' + features[0].properties.ADMIN;
      // }
      // else if (features[0].properties.ADMIN = "United States of America") {
      //   var url = 'https://newsapi.org/v2/top-headlines?' +
      //     'country=us&' +
      //     'apiKey=c0dd3e7f7a9840528c87934d92d511e0';
      //   var req = new Request(url);
      //   var articles = [];
      //   fetch(req)
      //     .then(response => response.json())
      //     .then(data => articles.push(data.articles))
      //     .then(console.log(articles));
      // }

  });
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