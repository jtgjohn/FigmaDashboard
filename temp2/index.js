//alert("tally ho");

function getTeams() {
    //alert("Clicked");
    var url = "http://localhost:8080/getTeams";
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null);
    console.log(xmlHttp.responseText);

}


function postTeam() {
    //alert("Clicked");
    var url = "http://localhost:8080/postTeam?team=999";
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("POST", url, false)
    xmlHttp.send(null);
    console.log(xmlHttp.responseText);

}

function postRemoveTeam() {
    //alert("Clicked");
    var url = "http://localhost:8080/postRemoveTeam?team=999";
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("POST", url, false)
    xmlHttp.send(null);
    console.log(xmlHttp.responseText);

}