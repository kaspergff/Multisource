// ShowInfo geeft aan of het landeninfo scherm te zien is
var ShowInfo = false;

// volgende functie maakt het landeninfo scherm zichtbaar of juist niet
function setCountryInfo(ISOa2) {
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
            document.getElementById('map').setAttribute("style", "width:60%");
            document.getElementById('info').setAttribute("style", "display:block");
            var country = getCountryName(ISOa2);
            document.getElementById("countryName").innerHTML = country;
            setInfo(ISOa2);
            ShowInfo = true;
        }
        if (ISOa2 == null) {
            document.getElementById('map').setAttribute("style", "width:60%");
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

function getTitle(a, i) {
    return a[i].title;
}

function setInfo(input) {
    document.getElementById("countryName").innerHTML = landeinfo[input].Country;
    document.getElementById("Flag").src = landeinfo[input].Flag;
    document.getElementById("Capital").innerHTML = "Capital: " + landeinfo[input].Capital;
    document.getElementById("Official_Language").innerHTML = "Official language: " + landeinfo[input].Official_Language;
    document.getElementById("Main_Religion").innerHTML = "Main religion: " + landeinfo[input].Main_Religion;
    document.getElementById("Population").innerHTML = "Population: " + landeinfo[input].Population;
    document.getElementById("Government").innerHTML = "Government: " + landeinfo[input].Government;
    document.getElementById("Head_Of_State").innerHTML = "Head of state: " + landeinfo[input].Head_Of_State;
    document.getElementById("GDP_Per_Capita").innerHTML = "GDP per capita: " + landeinfo[input].GDP_Per_Capita;
    document.getElementById("HDI").innerHTML = "HDI: " + landeinfo[input].HDI;
}

var slider = document.getElementById("myRange");
slider.oninput = function () {
    if (this.value === '15' || this.value === '1') {
        removePoints();
        drawRandomPoints(1);
    }
};