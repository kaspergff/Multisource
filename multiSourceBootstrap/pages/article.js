let newsFetch;
let china, rus, india, brasil;
// Deze functie wordt uitgevoerd zodra de pagina geladen is
async function foo() {
    newsFetch = await News("us");
    console.log(newsFetch[0].title);
    china = await newsUrl("https://newsapi.org/v2/top-headlines?category=business&country=cn&pageSize=1&apiKey=c0dd3e7f7a9840528c87934d92d511e0");
    rus = await newsUrl("https://newsapi.org/v2/top-headlines?category=business&country=ru&pageSize=1&apiKey=c0dd3e7f7a9840528c87934d92d511e0");
    india = await newsUrl("https://newsapi.org/v2/top-headlines?category=business&country=id&pageSize=1&apiKey=c0dd3e7f7a9840528c87934d92d511e0");
    brasil = await newsUrl("https://newsapi.org/v2/top-headlines?category=business&country=br&pageSize=1&apiKey=c0dd3e7f7a9840528c87934d92d511e0");
    setArticlesOnPage(newsFetch, china, rus, india, brasil);
}

function setArticlesOnPage(news, cn, ru, id, br) {
    //document.getElementById("article-title").innerHTML = "<b>" + news[0].title + "</b>";
    //document.getElementById("article-img").src = news[0].urlToImage;
    // document.getElementById("article-description").innerHTML = news[0].description;
    // document.getElementById("link-to-article").href = news[0].url;
    document.getElementById("article-source").innerHTML = "<b> Source: </b>" + news[0].source.name;
    document.getElementById("article-published-on").innerHTML = "<b> Published at: </b>" + news[0].publishedAt.slice(0, -10);
    document.getElementById("article-author").innerHTML = "<b> Author: </b>" + news[0].author;

    //document.getElementById("other-source1").href = news[1].url;
    document.getElementById("other-source1").innerHTML = cn[0].source.name;
    document.getElementById("other-source1-text").innerHTML = cn[0].description;
    //document.getElementById("other-source2").href = news[2].url;
    document.getElementById("other-source2").innerHTML = ru[0].source.name;
    document.getElementById("other-source2-text").innerHTML = ru[0].description;
    //document.getElementById("other-source3").href = news[3].url;
    document.getElementById("other-source3").innerHTML = id[0].source.name;
    document.getElementById("other-source3-text").innerHTML = id[0].description;
    //document.getElementById("other-source4").href = news[4].url;
    document.getElementById("other-source4").innerHTML = br[0].source.name;
    document.getElementById("other-source4-text").innerHTML = br[0].description;
    //document.getElementById("other-source5").href = news[5].url;
    document.getElementById("other-source5").innerHTML = news[0].source.name;
    document.getElementById("other-source5-text").innerHTML = news[0].description;
    document.getElementById("other-news1").innerHTML = news[6].title;
    //document.getElementById("other-news2").href = news[7].url;
    document.getElementById("other-news2").innerHTML = news[7].title;
    //document.getElementById("other-news3").href = news[8].url;
    document.getElementById("other-news3").innerHTML = news[8].title;
    //document.getElementById("other-news4").href = news[9].url;
    document.getElementById("other-news4").innerHTML = news[9].title;
    //document.getElementById("other-news5").href = news[10].url;
    document.getElementById("other-news5").innerHTML = news[10].title;

}

var input = document.getElementById("searchField");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("searchButton").click();
    }
});