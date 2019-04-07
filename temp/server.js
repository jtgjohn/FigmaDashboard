var express = require("express");
var app = express();
var path = require('path');
var fetch = require('isomorphic-fetch');

const APIKey = "10028-2e5765d3-df29-400d-b607-722bbac2b14c";
const teamID = "681911804688300104";
const featureID = "205%3A1595";

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

//user
app.get("/user", async function (req, res) {
    let result = await getUser().catch(error => console.log(error));
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
    let result = await getTeamProjects(teamID).catch(error => console.log(error));
    
    res.send(JSON.stringify(result));
});

//project files
app.get("/projectFiles", async function (req, res) {
    let projects = await getTeamProjects(teamID).catch(error => console.log(error));
    let result = await getProjectFiles(projects["projects"][0]["id"]).catch(error => console.log(error));
    
    res.send(JSON.stringify(result));
});

//File
app.get("/file", async function (req, res) {
    let projects = await getTeamProjects(teamID).catch(error => console.log(error));
    let files = await getProjectFiles(projects["projects"][0]["id"]).catch(error => console.log(error));
    let result = await getFile(files["files"][0]["key"]).catch(error => console.log(error));
    
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

//FileImages
app.get("/fileImage", async function (req, res) {
    let projects = await getTeamProjects(teamID).catch(error => console.log(error));
    let files = await getProjectFiles(projects["projects"][0]["id"]).catch(error => console.log(error));
    let result = await getFileImages(files["files"][0]["key"], featureID).catch(error => console.log(error));
    
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