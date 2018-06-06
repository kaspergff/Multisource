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

    map.addLayer({
        "id": "mh-17",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {
                        "description": "BLABLABLABLA",
                        "icon": "theatre"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [5, 52.931567]
                    }
                }]
            }
        },
        "layout": {
            "icon-image": "{icon}-15",
            "icon-allow-overlap": true
        }



    });
    var newsFetch = newsOnLoad()
        .then(function (newsFetch) {
            console.log(newsFetch);
        });

    //disable double click zoom
    map.doubleClickZoom.disable();
    // Functie die het klikken op de map regelt
    map.on("click", function (e) {
        // Op welk land wordt geklikt --> .geojson
        var features = map.queryRenderedFeatures(e.point, {
            layers: ["state-fills"]
        });
        var iconFeatures = map.queryRenderedFeatures(e.point, {
            layers: ['mh-17']
        });
        

        // If statement die de regelen welke popups / markers getoont moeten worden
        if (iconFeatures.length > 0) {
            console.log("in de if statement");
            createPopup(e, "Het Joint Investigation Team (JIT): 'Een Russische raket heeft MH-17 neergeschoten'", map);
            icon(map, e);
        } else {

            newsByCountry(features)
                .then(function (articles) {
                    createPopup(e, articles[0].title, map);
                });
        }

    });

    map.on('dblclick', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ["state-fills"]
        });
        var ISOa2;
        // ISOa2 afkorting van het land
        newISOa2 = isoA2(features);

        if (ISOa2 !== newISOa2) {
            ISOa2 = newISOa2;
            updateCountryName(ISOa2);
        }

        if (ShowInfo === false) {
            setCountryInfo(map, info, ISOa2);
            ShowInfo = true;
        }
        newsByCountry(features)
            .then(function (articles) {
                console.log(articles);
            });
    });
});

var markerGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "message": "МО России: В Гааге подтвердили, что MH17 сбили из «Бука» ПВО Украины",
                "iconSize": [60, 60]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    37.621407,
                    55.754700
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "JIT confirms: The missle that took down MH-17 was of russian origin",
                "iconSize": [50, 50]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    150.945667,
                    -33.809140
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Baz",
                "iconSize": [40, 40]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.29223632812499,
                    -18.28151823530889
                ]
            }
        }
    ]
};


var popupOptions = {
    closeButton: true,
    closeOnClick: false
};
var popup = new mapboxgl.Popup(popupOptions);

var markerFeatures = [];

function createPopup(e, text, map) {
    if (map) {
        popup.addTo(map)
                .setLngLat(e.lngLat)
                .setHTML("<p>" + text + "</p>");
    } else {
        var markerPopup = new mapboxgl.Popup(popupOptions);
        markerPopup.setHTML("<p>" + text + "</p>");
        return markerPopup;
    }
}

function icon(map, e) {
    createPopup(e, "Het Joint Investigation Team (JIT): 'Een Russische raket heeft MH-17 neergeschoten'", map);
    //loopje om alle markers te maken
    markerGeoJSON.features.forEach(function (marker) {
        console.log("doet weer shit met markers");
        //creëert een divje om de markers in te definiëren
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
        el.style.width = marker.properties.iconSize[0] + 'px';
        el.style.height = marker.properties.iconSize[1] + 'px';
        //verplaatst de markers enigszins om de markers goed op de kaart te laten zien
        var markerOffsetX = marker.properties.iconSize[0] * -1;
        var markerOffsetY = marker.properties.iconSize[1] * -1;
        
        //creëert een popup voor iedere marker
        var markerPopup = createPopup(marker.geometry.coordinates, marker.properties.message);
        // add marker to map
        new mapboxgl.Marker(el, {offset: [markerOffsetX / 2, markerOffsetY / 2]})
                .setLngLat(marker.geometry.coordinates)
                .addTo(map)
                .setPopup(markerPopup);
        
        markerFeatures.push(marker.geometry.coordinates);
                
    });
    }


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