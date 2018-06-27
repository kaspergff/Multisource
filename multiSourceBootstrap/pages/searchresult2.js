

async function loadPage () {
    var keyword = localStorage.getItem('searchText');
    var articles = await newsByKeyword(keyword);
    console.log(articles);
    setArticles(articles);
};

function setArticles(articles) {
    document.getElementById('first-title').innerHTML = articles[0].title;
    document.getElementById('first-description').innerHTML = articles[0].description;
    document.getElementById('first-source').innerHTML = articles[0].source.name;
    document.getElementById('first-author').innerHTML = articles[0].author;
    document.getElementById('first-date').innerHTML = articles[0].date;
    
    document.getElementById('second-title').innerHTML = articles[1].title;
    document.getElementById('second-description').innerHTML = articles[1].description;
    document.getElementById('second-source').innerHTML = articles[1].source.name;
    document.getElementById('second-author').innerHTML = articles[1].author;
    document.getElementById('second-date').innerHTML = articles[1].date;
    
    document.getElementById('third-title').innerHTML = articles[2].title;
    document.getElementById('third-description').innerHTML = articles[2].description;
    document.getElementById('third-source').innerHTML = articles[2].source.name;
    document.getElementById('third-author').innerHTML = articles[2].author;
    document.getElementById('third-date').innerHTML = articles[2].date;
    
    document.getElementById('fourth-title').innerHTML = articles[3].title;
    document.getElementById('fourth-description').innerHTML = articles[3].description;
    document.getElementById('fourth-source').innerHTML = articles[3].source.name;
    document.getElementById('fourth-author').innerHTML = articles[3].author;
    document.getElementById('fourth-date').innerHTML = articles[3].date;
    
    document.getElementById('fifth-title').innerHTML = articles[4].title;
    document.getElementById('fifth-description').innerHTML = articles[4].description;
    document.getElementById('fifth-source').innerHTML = articles[4].source.name;
    document.getElementById('fifth-author').innerHTML = articles[4].author;
    document.getElementById('fifth-date').innerHTML = articles[4].date;
}