// ShowInfo geeft aan of het landeninfo scherm te zien is
var ShowInfo = false;

// volgende functie maakt het landeninfo scherm zichtbaar of juist niet
function setCountryInfo(map, info, ISOa2) {
    // Als ShowInfo waar is maak de map 100% breed en haal het info scherm weer weg. 
    // Zet ShowInfo op false
    // Else
    // Als er op een land geklikt is waar de ISOa2 van bekend is laat het landen scherm zien en laat de naam van het land zien
    // Als de ISOa2 niet bekend is laat het infoscherm in met text "Country".
    if (ShowInfo) {
        document.getElementById('map').setAttribute("style", "width:100%");
        document.getElementById('info').setAttribute("style", "display:none");
        ShowInfo = false;
    } else {
        if (ISOa2 != null) {
            document.getElementById('map').setAttribute("style", "width:70%");
            document.getElementById('info').setAttribute("style", "display:block");
            var country = getCountryName(ISOa2);
            document.getElementById("countryName").innerHTML = country;
            ShowInfo = true;
        }
        if (ISOa2 == null) {
            document.getElementById('map').setAttribute("style", "width:70%");
            document.getElementById('info').setAttribute("style", "display:block");
            document.getElementById("countryName").innerHTML = "country";
            ShowInfo = true;
        }
    }
}

function getCountryName(ISOa2) {
    var countryName;
    for (let i = 0; i < ISO_a2.length; i++) {
        for (let j = 0; j < ISO_a2[i].length; j++) {
            if (ISO_a2[i][1] == ISOa2) {
                countryName = ISO_a2[i][0];
            }
        }
    }
    return countryName;
}

function updateCountryName(ISOa2) {
    var country = getCountryName(ISOa2);
    document.getElementById("countryName").innerHTML = country;
}