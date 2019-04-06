var express = require("express");
var app = express();
var path = require('path');
var fetch = require('isomorphic-fetch');
var cors = require('cors');

// var bodyParser = require('body-parser');
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 


app.options('*', cors()); 

//const APIKey = "10028-2e5765d3-df29-400d-b607-722bbac2b14c";
const teamID = "681911804688300104";
//const featureID = "205%3A1595";
const featureName = "Export Feature Dropdown";


//OAuth
//Client Secret: xGVm6lOTv0do8ca7n0uQIisw6VLuwX
//Client ID: Me3HgbzpUV5CYdvFfDwipX

clientIDoriginal = "Me3HgbzpUV5CYdvFfDwipX";
clientSecretoriginal = "xGVm6lOTv0do8ca7n0uQIisw6VLuwX";

clientID = "x1j28cPngqZlHPQRV86vax";
clientSec = "P8DCUo6PMAzT9bRk9QiFv7xHEZ6rG4";
AccessToken = "";
callback = "http://localhost:8080/contents.html";
callback2 = "http://localhost:4200/home";


async function OAuthGetToken(code){
    let result = await fetch('https://www.figma.com/api/oauth/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "client_id": clientIDoriginal,
            "client_secret": clientSecretoriginal,
            "redirect_uri": callback,
            "code": code,
            "grant_type": "authorization_code"
        })
    })

    let ret = await result.json();
    console.log("OAUTH RET: %j", ret);
    return ret;
}

async function OAuthGetToken2(code){
    let result = await fetch('https://www.figma.com/api/oauth/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "client_id": clientID,
            "client_secret": clientSec,
            "redirect_uri": callback2,
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
    console.log("USER AUTH RET: %j",ret);
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


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
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



app.post("/projectsbyid", async function (req, res){
    req.on('data', async (chunk) => {
        console.log("BY ID PROJECTS");
        // let result = await OAuthGetToken2(JSON.parse(chunk)["code"]).catch(error => console.log(error));
        // console.log(result);
        // AccessToken = result["access_token"];
        let result2 = await getProjectFilesAuth(JSON.parse(chunk)["id"]).catch(error => console.log(error));

        
        for(var i = 0; i < result2["files"].length; ++i){
            console.log("Hello");
            let result3 = await getFileAuth(result2["files"][i]["key"]).catch(error => console.log(error));
            // console.log("RESULT3 %j", result3);
            result2["files"][i]["thumbnailUrl"] = result3["thumbnailUrl"];
        }

        console.log("RESULT2");

        console.log(result2);

        res.send(JSON.stringify(result2));

    });
});


//team projects
app.post("/teamProjectsall", async function (req, res) {
    req.on('data', async (chunk) => {
        console.log(req["query"]);
        console.log(JSON.parse(chunk));
        if(AccessToken == ""){
            let result = await OAuthGetToken2(JSON.parse(chunk)["code"]).catch(error => console.log(error));
            console.log(result);
            AccessToken = result["access_token"];
            console.log(AccessToken);
        }
        let result2 = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
        console.log(JSON.stringify(result2));
        let result3 = "";
        var all_project_files = [];

        let ret = "<ng-container>";
        for(var i = 0; i < result2["projects"].length; ++i){



             result3 = await getProjectFilesAuth(result2["projects"][i]["id"]).catch(error => console.log(error));
             let resultimagefinal = await getFileAuth(result3["files"][0]["key"]).catch(error => console.log(error));

             result3["id"] = result2["projects"][i]["id"];
             result3["name"] = result2["projects"][i]["name"];
             result3["thumbnailUrl"] = resultimagefinal["thumbnailUrl"];
              ret += "<div class = 'feature_panel' >";
              ret += "<label for = 'featurelabel' class = 'feature_label'>";
              ret += result3["name"];
              ret += "</label>";
              ret += "<p class = 'feature_paragraph'>";
              ret += "Last Modified: " + result3["files"][0]["last_modified"];
              ret += "</p>";
              ret += "<div class = 'project_image'>";
              ret += "<img src = '";
              ret += resultimagefinal["thumbnailUrl"] + "'/>";
              ret += "</div>";
              ret += "<button class = 'feature_button'> View Features </button>";

             console.log(result3);
             all_project_files.push(result3);
        }

        ret+= "</ng-container>";

        console.log(ret);
        // res.send(ret);
        res.send(JSON.stringify(all_project_files));


    });
    
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


    console.log(result["thumbnailUrl"]);
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