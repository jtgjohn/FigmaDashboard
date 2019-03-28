var express = require("express");
var app = express();
var path = require('path');
var fetch = require('isomorphic-fetch');

//const APIKey = "10028-2e5765d3-df29-400d-b607-722bbac2b14c";
const teamID = "681911804688300104";
//const featureID = "205%3A1595";
const featureName = "Export Feature Dropdown";


//OAuth
//Client Secret: xGVm6lOTv0do8ca7n0uQIisw6VLuwX
//Client ID: Me3HgbzpUV5CYdvFfDwipX
clientID = "Me3HgbzpUV5CYdvFfDwipX";
clientSec = "xGVm6lOTv0do8ca7n0uQIisw6VLuwX";
AccessToken = "";
callback = "http://localhost:8080/contents.html"


async function OAuthGetToken(code){
    let result = await fetch('https://www.figma.com/api/oauth/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "client_id": clientID,
            "client_secret": clientSec,
            "redirect_uri": callback,
            "code": code,
            "grant_type": "authorization_code"
        })
    })

    let ret = await result.json();
    return ret;
}

//OAuth
//=====================================================================================
async function getUserAuth(){
    //let result = await fetch('https://api.figma.com/v1/me/' + fileId , {
    let result = await fetch('https://api.figma.com/v1/me/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}

async function getTeamProjectsAuth(teamId){
    let result = await fetch('https://api.figma.com/v1/teams/' + teamId + "/projects", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}

async function getProjectFilesAuth(projectId){
    let result = await fetch('https://api.figma.com/v1/projects/' + projectId + "/files", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}

async function getFileAuth(fileId){
    let result = await fetch('https://api.figma.com/v1/files/' + fileId, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}

async function getFileImagesAuth(fileId, ids){
    let result = await fetch('https://api.figma.com/v1/images/' + fileId + "?ids=" + ids, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}


//API Token
//=====================================================================================
async function getUser(){
    //let result = await fetch('https://api.figma.com/v1/me/' + fileId , {
    let result = await fetch('https://api.figma.com/v1/me/', {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getTeamProjects(teamId){
    let result = await fetch('https://api.figma.com/v1/teams/' + teamId + "/projects", {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getProjectFiles(projectId){
    let result = await fetch('https://api.figma.com/v1/projects/' + projectId + "/files", {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getFile(fileId){
    let result = await fetch('https://api.figma.com/v1/files/' + fileId, {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getFileImages(fileId, ids){
    let result = await fetch('https://api.figma.com/v1/images/' + fileId + "?ids=" + ids, {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

//return the index file when requested
app.get("/", async function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/contents.html", async function (req, res) {
    //console.log(req);
    //console.log(req["query"]["code"]);
    result = await OAuthGetToken(req["query"]["code"]).catch(error => console.log(error));
    //console.log(result);
    AccessToken = result["access_token"];
    res.sendFile(path.join(__dirname, "/contents.html"));
});

//user
app.get("/user", async function (req, res) {
    let result = await getUserAuth().catch(error => console.log(error));
    //console.log(JSON.stringify(result));
    let ret = "<html>";
    ret += "<body>";
    ret += "<p>email: " + result["email"] + "</p>";
    ret  += "<p>handle: " + result["handle"] + "</p>";
    ret  += "<p>pic: <img src='" + result["img_url"] + "'></p>";
    ret += "</body>";
    ret += "</html>";

    res.send(ret);
});

//team projects
app.get("/teamProjects", async function (req, res) {
    let result = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
    
    res.send(JSON.stringify(result));
});

//project files
app.get("/projectFiles", async function (req, res) {
    let projects = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
    let result = await getProjectFilesAuth(projects["projects"][0]["id"]).catch(error => console.log(error));
    
    res.send(JSON.stringify(result));
});

//File
app.get("/file", async function (req, res) {
    let projects = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
    let files = await getProjectFilesAuth(projects["projects"][0]["id"]).catch(error => console.log(error));
    let result = await getFileAuth(files["files"][0]["key"]).catch(error => console.log(error));
    
    let ret = "<html>";
    ret += "<body>";
    ret += "<p>Name: " + result["name"] + "</p>";
    ret  += "<p>Last Modified: " + result["lastModified"] + "</p>";
    ret  += "<p>pic: <img src='" + result["thumbnailUrl"] + "'></p>";
    ret += "<p>everything: " + JSON.stringify(result) + "></p>";
    ret += "</body>";
    ret += "</html>";

    res.send(ret);
    
});

function findID(mapItem, id) {
    //console.log(mapItem);
    let ret = "";
    //if (mapItem["children"].length == 0) {
    if (!("children" in mapItem)) {
        return ret;
    } 
    if (mapItem["children"] == undefined) {
        return ret;
    }
    for (let i = 0; i < mapItem["children"].length; i++) {
        //console.log(mapItem["children"][i]["name"]);
        if (mapItem["children"][i]["name"] == featureName) {
            ret = mapItem["children"][i]["id"];
            //console.log("Found it");
            break;
        }
        
        let temp = findID(mapItem["children"][i], id)
        if (temp != "") {
            //console.log("Ret was found, it's " + temp);
            ret = temp;
            break;
        }
        
    }
    return ret;
}

//FileImages
app.get("/fileImage", async function (req, res) {
    let projects = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
    //console.log(projects);
    let files = await getProjectFilesAuth(projects["projects"][0]["id"]).catch(error => console.log(error));
    //console.log(files)
    let file = await getFileAuth(files["files"][0]["key"]).catch(error => console.log(error));

    //console.log(file);

    //let picID = ""

    let picID = findID(file["document"], featureName);

    //console.log("started");

    /*
    //console.log(file);
    //console.log(file["components"]);
    console.log(file["document"]["children"]);
    console.log(file["document"]["children"].length);
    for (let i = 0; i < file["document"]["children"].length; i++) {
        if (file["document"]["children"][i]["name"] == featureName) {
            console.log(file["document"]["children"][i]);
            picID = file["document"]["children"][i]["id"];
        }
    }

    console.log(picID);
    */

    //let result = await getFileImagesAuth(files["files"][0]["key"], featureID).catch(error => console.log(error));
    let result = await getFileImagesAuth(files["files"][0]["key"], picID).catch(error => console.log(error));
    //console.log(result);
    
    let ret = "<html>";
    ret += "<body>";
    for (var img in result["images"]) {
        ret += "<p>pic: <img src='" + result["images"][img] + "'></p>";
    }
    ret += "</body>";
    ret += "</html>";
    
    res.send(ret);
    
    
});

//return all other files when requested using the given path
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, req["params"]["0"]));
});

//start the server
var server = app.listen(8080, function() {
    console.log("Running on port 8080");
});