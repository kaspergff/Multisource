const APIkey = "apiKey=c0dd3e7f7a9840528c87934d92d511e0";
// Functie maakt een newsAPI url voor een bepaald land
// country = ISOa2 afkorting
function makeCountryURL(country) {
    const part1 = "https://newsapi.org/v2/top-headlines?country=";
    // const part2 = "&apiKey=c0dd3e7f7a9840528c87934d92d511e0";
    var url = part1 + country + "&" + APIkey;
    return url;
}

async function newsOnLoad() {
    //const url = "https://newsapi.org/v2/everything?q=" + q + "&apiKey=c0dd3e7f7a9840528c87934d92d511e0";
    const url = "https://newsapi.org/v2/sources?language=en&category=general&apiKey=c0dd3e7f7a9840528c87934d92d511e0";
    var req = new Request(url);
    let news = await fetch(req);
    let json = await news.json();
    return json.sources;
}

// functie geeft nieuws van een bepaald land op basis van de ISOa2 afkorting
async function newsByCountry(features) {
    var country = isoA2(features);
    if (!country)
        country = "us";
    var url = makeCountryURL(country);
    var req = new Request(url);
    let news = await fetch(req);
    let json = await news.json();
    return json.articles
}

// Functie geeft ISO a2 van het land waarop gelikt is
function isoA2(features) {
    var ISOa2;
    // Voor uitleg over deze loop moet je bij Kasper zijn
    if (features.length) {
        var land = features[0].properties.ADMIN;
        for (let i = 0; i < ISO_a2.length; i++) {
            for (let j = 0; j < ISO_a2[i].length; j++) {
                if (ISO_a2[i][0] == land) {
                    ISOa2 = ISO_a2[i][1];
                }
            }
        }
    }
    return ISOa2;
}

// function getArticles(req) {
//     var articles = [];
//     fetch(req)
//         .then(response => response.json())
//         .then(data => articles = data.articles)
//         .then(function (articles) {
//             return articles
//         });
// }


function getTitle(a, i) {
    return a[i].title;
}

function displayText(text, id) {
    document.getElementById(id).innerHTML = text;
}