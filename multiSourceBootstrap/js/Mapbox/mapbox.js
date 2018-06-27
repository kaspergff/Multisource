mapboxgl.accessToken = 'pk.eyJ1Ijoia3JnZmYiLCJhIjoiY2pneHYyMTZmMWdpbTJ4bjAyOTRka3pmbiJ9.QzZJfoOueJ8wfmo0NCHGQQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/basic-v9',
    center: [-0, 37.830348],
    zoom: 1.5,
    maxZoom: 4.5
});
var bounds = new mapboxgl.LngLatBounds();
map.addControl(new mapboxgl.NavigationControl());

var gekliktPunt, punten, puntenArr;
var randomON = true;
var drieFeatures;

map.on('load', function () {
    // landen
    map.addSource("states", {
        "type": "geojson",
        "data": "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    });
    // bounding box 
    map.addSource("bbox", {
        "type": "geojson",
        "data": "https://raw.githubusercontent.com/azurro/country-bounding-boxes/master/boxes.geojson"
    });
    // landen fill
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

    // line mh17
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
    // MH15 icon
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

    // bounding box fill
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

    // hiermee worden de random points getekend
    drawRandomPoints(1);

    //disable double click zoom
    map.doubleClickZoom.disable();

    // Functie die 1x klikken op de map regelt
    map.on("click", function (e) {
        // Op welk land wordt geklikt --> .geojson
        var features = map.queryRenderedFeatures(e.point, {
            layers: ["state-fills"]
        });

        // als er op mh17 geklikt wordt
        var iconFeatures = map.queryRenderedFeatures(e.point, {
            layers: ['mh-17']
        });

        // als er op de random points gekilkt wordt
        var randomFeatures = map.queryRenderedFeatures(e.point, {
            layers: ['points0']
        });

        // zorgt dat t country scherm weggehaald wordt als het er staat en er op de kaart wordt geklikt
        if (ShowInfo) {
            showCountryScherm(features);
        }

        drieFeatures = map.queryRenderedFeatures(e.point, {
            layers: ['3points0']
        });



        //If statement die de regelen welke popups / markers getoont moeten worden
        if (iconFeatures.length > 0) {
            console.log("in de if statement");
            removePoints();
            createPopup(e, "Het Joint Investigation Team (JIT): 'Een Russische raket heeft MH-17 neergeschoten'", map);
            icon(map, e);
        } else if (randomON && randomFeatures.length > 0) {
            newsByCountry(features)
                .then(function (articles) {
                    createPopup(e, articles[0].title, map),
                        gekliktPunt = randomFeatures[0].geometry.coordinates;
                });
        } else if (drieFeatures.length > 0) {
            newsByCountry(features)
                .then(function (articles) {
                    createPopup(e, articles[0].title, map)
                });
        } else {
            newsByCountry(features)
                .then(function (articles) {
                    //createPopup(e, articles[0].title, map);
                });
        }
    });

    // dubbel klik op de kaart
    map.on("dblclick", function (e) {
        // op welk land wordt er dubbel geklikt
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
            .setHTML("<a href=\"./pages/article.html\">" + text + "</a><br /> <div id='lijntjes'> Test text</div> ");
            document.getElementById("lijntjes").addEventListener("click", function(){
                lijntjesTekenen(e,map)
            });
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


// functie om 10 punten te tekenen op de kaart 
function drawRandomPoints(index) {
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

// functie om 3 punten te tekenen op de kaart 
function draw3RandomPoints(punt, index) {
    for (let i = 0; i < index; i++) {
        map.addLayer({
            "id": "3points" + i,
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": punt
                            },
                            "properties": {
                                "icon": "marker"
                            }
                        }, {
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

function lijntjesTekenen(e, map) {
    removePoints();
    draw3RandomPoints(gekliktPunt, 1);
    punten = getFeatures("3points0");
    puntenArr = makeArr(punten);
    drawLineVanArr(puntenArr, gekliktPunt);
    randomON = false;
}


function getFeatures(id) {
    punten = map.getSource(id);
    punten = punten._data.features;
    return punten;
}

function makeArr(punten) {
    var arr = [
        [punten[1].geometry.coordinates[0], punten[1].geometry.coordinates[1]],
        [punten[2].geometry.coordinates[0], punten[2].geometry.coordinates[1]],
        [punten[3].geometry.coordinates[0], punten[3].geometry.coordinates[1]]
    ];
    return arr;
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

// countryscherm laten zien
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

function drawLineVanArr(arr, begin) {
    console.log("arr" + arr[0])
    console.log("begin" + begin)
    map.addLayer({
        "id": "routeXX",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [begin[0], begin[1]],
                        [arr[0][0], arr[0][1]],
                        [begin[0], begin[1]],
                        [arr[1][0], arr[1][1]],
                        [begin[0], begin[1]],
                        [arr[2][0], arr[2][1]]
                    ]
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#888",
            "line-width": 2
        }
    });
}
// lijn tekenen tussen coordinaten
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
                "line-width": 2
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