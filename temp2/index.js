//alert("tally ho");

function getTeams() {
    //alert("Clicked");
    var url = "http://localhost:8080/getTeams";
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null);
    console.log(xmlHttp.responseText);

}