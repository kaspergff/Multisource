mapboxgl.accessToken = 'pk.eyJ1Ijoia3JnZmYiLCJhIjoiY2pneHYyMTZmMWdpbTJ4bjAyOTRka3pmbiJ9.QzZJfoOueJ8wfmo0NCHGQQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-0, 37.830348],
    zoom: 1.5
});
var bounds = new mapboxgl.LngLatBounds();

map.on('load', function () {
    map.addSource("states", {
        "type": "geojson",
        "data": "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    });

    map.addSource("bbox", {
        "type": "geojson",
        "data": "https://raw.githubusercontent.com/azurro/country-bounding-boxes/master/boxes.geojson"
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
        'id': 'line-animation',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': lineGeojson
        },
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#ed6498',
            'line-width': 5,
            'line-opacity': .8
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
                        "icon": "marker"
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

    map.addLayer({
        "id": "bbox-fills",
        "type": "fill",
        "source": "bbox",
        "layout": {},
        "paint": {
            "fill-color": "#627BC1",
            "fill-opacity": 0
        }
    });

    drawPoint(1);

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

        var randomFeatures = map.queryRenderedFeatures(e.point, {
            layers: ['points0']
        });

        if(ShowInfo){
            showCountryScherm(features);
        }

        //If statement die de regelen welke popups / markers getoont moeten worden
        if (iconFeatures.length > 0) {
            console.log("in de if statement");
            removePoints();
            createPopup(e, "Het Joint Investigation Team (JIT): 'Een Russische raket heeft MH-17 neergeschoten'", map);
            icon(map, e);
            //drawline(map);
        } else if (randomFeatures.length > 0) {
            console.log("raak");
            newsByCountry(features)
                .then(function (articles) {
                    createPopup(e, articles[0].title, map),
                        console.log(features),
                        localStorage.setItem("features", features);
                });
        } else {
            newsByCountry(features)
                .then(function (articles) {
                    //createPopup(e, articles[0].title, map);
                });
        }
    });

    map.on("dblclick", function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ["state-fills"]
        });

        var featuresBBOX = map.queryRenderedFeatures(e.point, {
            layers: ["bbox-fills"]
        });

        var sw = new mapboxgl.LngLat(featuresBBOX[0].geometry.coordinates[0][3][0], featuresBBOX[0].geometry.coordinates[0][3][1]);
        var ne = new mapboxgl.LngLat(featuresBBOX[0].geometry.coordinates[0][1][0], featuresBBOX[0].geometry.coordinates[0][1][1]);
        var llb = new mapboxgl.LngLatBounds(sw, ne);
        map.fitBounds(llb);
        showCountryScherm(features);
        setInfo(isoA2(features));
    });


});

var markerGeoJSON = {
    "type": "FeatureCollection",
    "features": [{
            "type": "Feature",
            "properties": {
                "message": "МО России: В Гааге подтвердили, что MH17 сбили из «Бука» ПВО Украины",
                "iconSize": [32, 32]
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
                "iconSize": [32, 32]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    150.945667, -33.809140
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Baz",
                "iconSize": [32, 32]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-63.29223632812499, -18.28151823530889]
            }
        }
    ]
};

var lineGeojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [5, 52.931567]
            ]
        }
    }]
};

var popupOptions = {
    closeButton: true,
    closeOnClick: false
};
var popup = new mapboxgl.Popup(popupOptions);

var markerFeatures = [];
var speedFactor = 30; // number of frames per longitude degree
var animation; // to store and cancel the animation
var startTime = 0;
var progress = 0; // progress = timestamp - startTime
var resetTime = false; // indicator of whether time reset is needed for the animation

function createPopup(e, text, map) {
    if (map) {
        popup.addTo(map)
            .setLngLat(e.lngLat)
            .setHTML("<a href=\"./pages/article.html\">" + text + "</a>");
    } else {
        var markerPopup = new mapboxgl.Popup(popupOptions);
        markerPopup.setHTML("<a href=\"https://www.w3schools.com/html/\">" + text + "</a>");
        return markerPopup;
    }
}
// functie haalt de random punten van de map.
function removePoints() {
    map.removeLayer("points0")
}

// functie om punten te tekenen op de kaart 
function drawPoint(index) {
    for (let i = 0; i < index; i++) {
        map.addLayer({
            "id": "points" + i,
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": locations.features[Math.floor(Math.random() * 600)].geometry.coordinates
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        }
                    ]
                }
            },
            "layout": {
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });
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
        el.style.width = marker.properties.iconSize[0] + 'px';
        el.style.height = marker.properties.iconSize[1] + 'px';
        //verplaatst de markers enigszins om de markers goed op de kaart te laten zien
        var markerOffsetX = marker.properties.iconSize[0] * -1;
        var markerOffsetY = marker.properties.iconSize[1] * -1;

        //creëert een popup voor iedere marker
        var markerPopup = createPopup(marker.geometry.coordinates, marker.properties.message);
        // add marker to map
        new mapboxgl.Marker(el, {
                offset: [markerOffsetX / 2, markerOffsetY / 2]
            })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map)
            .setPopup(markerPopup);
        markerFeatures.push(marker.geometry.coordinates);

    });
    drawLine([
        [5, 52.931567],
        [37.621407, 55.754700],
        [150.945667, -33.809140]
    ]);
}


function showCountryScherm(features) {
    // ISOa2 afkorting van het land
    var ISOa2;
    newISOa2 = isoA2(features);

    if (ISOa2 !== newISOa2 && newISOa2) {
        ISOa2 = newISOa2;
        updateCountryName(ISOa2);
    }
    setCountryInfo(ISOa2);
    // if (ShowInfo === false) {
    //     setCountryInfo(map, info, ISOa2);
    //     ShowInfo = true;
    // }


}

function drawLine(coordinates) {
    for (let i = 0; i < coordinates.length; i++) {
        map.addLayer({
            "id": "route",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": coordinates
                    }
                }
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#888",
                "line-width": 8
            }
        });
    }
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