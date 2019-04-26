var express = require("express");
var app = express();
var path = require('path');
var fetch = require('isomorphic-fetch');
var cors = require('cors');
require('dotenv').config();
const mongo_endpoints = require('./mongoDatabase.js');

var teamID = '';
const featureName = "Export Feature Dropdown";

app.options('*', cors());
AccessToken = "";
callback = "http://localhost:4200/home";

/*
Function to get the authorization token 
requires a code to request the token 
returns the json results
*/
async function OAuthGetToken(code){
    var result = await fetch('https://www.figma.com/api/oauth/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "client_id": process.env.clientID,
            "client_secret": process.env.clientSec,
            "redirect_uri": callback,
            "code": code,
            "grant_type": "authorization_code"
        })
    });

    let ret = await result.json();
    return ret;
}

//OAuth
//=====================================================================================
/*
Function to get the user authorization
used the AccessToken variable
and returns the json result
*/
async function getUserAuth(){
    var result = await fetch('https://api.figma.com/v1/me/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json();
    return ret;
}

/*
Function to get authorization per project team
Requests the information based on a team id and requires parameter of teamid
returns all of the information results
*/
async function getTeamProjectsAuth(teamId){
    var result = await fetch('https://api.figma.com/v1/teams/' + teamId + "/projects", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    });

    let ret = await result.json();
    if(ret["status"] == 400){
        ret = {"projects": []};
      
    }

    return ret;
}

/*
Function to get poroject files
given a project id, calls the api and reutnrs all of the 
features information for that project
*/
async function getProjectFilesAuth(projectId){
    var result = await fetch('https://api.figma.com/v1/projects/' + projectId + "/files", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}

/*
Function to get the files 
given a file id, calls the figma api and returns the json result
*/
async function getFileAuth(fileId){
    var result = await fetch('https://api.figma.com/v1/files/' + fileId, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}

/*
Function to get the file image from the figma api
requires the specific file id 
and returns the response from the api
*/
async function getFileImagesAuth(fileId, ids){
    var result = await fetch('https://api.figma.com/v1/images/' + fileId + "?ids=" + ids, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json()

    return ret
}

//Set up app 
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

//return the contents.html page
app.get("/contents.html", async function (req, res) {

    result = await OAuthGetToken(req["query"]["code"]).catch(error => console.log(error));

    AccessToken = result["access_token"];
    res.sendFile(path.join(__dirname, "/contents.html"));
});

//return the user authorization in html form
app.get("/user", async function (req, res) {
    var result = await getUserAuth().catch(error => console.log(error));

    let ret = "<html>";
    ret += "<body>";
    ret += "<p>email: " + result["email"] + "</p>";
    ret  += "<p>handle: " + result["handle"] + "</p>";
    ret  += "<p>pic: <img src='" + result["img_url"] + "'></p>";
    ret += "</body>";
    ret += "</html>";

    res.send(ret);
});


//return versions by status
app.get("/getVersionsbyStatus", async function(req, res) {

    let result = await mongo_endpoints.getVersionsByStatus(req.query.fid, req.query.status);

    res.send(result);

})

//return the teams a user is on
app.post("/getUserTeams", async function (req, res) {
    req.on('data', async (chunk) => {
        
    if(AccessToken == ""){
        var resulttmp = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));

        AccessToken = resulttmp["access_token"];
    }

        var result = await getUserAuth().catch(error => console.log(error));

        var result_second = await mongo_endpoints.getUserTeams(result["email"]);
        res.send(result_second);
    });
    
});

//remove a team from the database
app.post("/removeTeam", async function (req, res){
     req.on('data', async (chunk) => {
          var result = await getUserAuth().catch(error => console.log(error));
            var result_second = await mongo_endpoints.postRemoveUserTeams(result["email"], JSON.parse(chunk)["team"], function(err, result){
                res.end(result);
            });
     });
});

//add a team for a user
app.post("/postTeam", async function (req, res) {
    req.on('data', async (chunk) => {
        let userInfo = await getUserAuth().catch(error => console.log(error));
        let email = userInfo["email"];
        var result = await mongo_endpoints.postAddUserTeams(email, JSON.parse(chunk)["team"])

        res.send(result);

    });
});

//return the projects for a given id
//this will make an api call 
//if there are cached projects in the database, it will return these
//while calling the api in the background and updating the database
//otherwise it will wait for the api and return those results
app.post("/projectsbyid", async function (req, res){
    req.on('data', async (chunk) => {

        const pid = JSON.parse(chunk)["id"];

        let cachedFeatures = await mongo_endpoints.getFeaturesByProjectId(pid);

        var foundFeatures = (cachedFeatures.length >  0);

        if (foundFeatures) {
            var featuresFiles = {
                files: []
            }
            for (var i = 0; i < cachedFeatures.length; i++) {
                featuresFiles["files"].push(cachedFeatures[i]);
            }

            res.send(JSON.stringify(featuresFiles));
        }


        var result2 = await getProjectFilesAuth(JSON.parse(chunk)["id"]).catch(error => console.log(error));



        for(var i = 0; i < result2["files"].length; ++i){

            var result3 = await getFileAuth(result2["files"][i]["key"]).catch(error => console.log(error));

            result2["files"][i]["thumbnailUrl"] = result3["thumbnailUrl"];
            result2["files"][i]["projectId"] = pid;
            var moment = require('moment-timezone');
            var tz_s = moment.tz.guess();

            var actual_time_final = moment(result2["files"][i]["last_modified"]).tz(tz_s);

            var actual_time_format = actual_time_final.format('MMMM Do YYYY, h:mm:ss a z');
            result2["files"][i]["last_modified"] = actual_time_format;

            mongo_endpoints.postCacheFeatures(result2["files"][i]);
        }

        if (!foundFeatures) {
            res.send(JSON.stringify(result2));
        }

    });
});


//update the status for a given version
app.post("/updatestatus", async function (req, res){
    req.on('data', async (chunk) => {
        var user = await getUserAuth();
        var user_handle = user["handle"];
        var user_email = user["email"];
        var moment = require('moment-timezone');
        var tz_s = moment.tz.guess();
        var actual_time_final = moment().tz(tz_s);
        var actual_time_format = actual_time_final.format('MMMM Do YYYY, h:mm:ss a z');

        let result = await mongo_endpoints.postStatusUpdate(user, user_handle, user_email, chunk);

        res.send({"lastChanger": user_handle, "lastChangetime": actual_time_format});
    });
});

//add a comment for a specific version
app.post("/addcomment", async function (req, res){
    req.on('data', async (chunk) => {

        var user = await getUserAuth();
         var user_handle = user["handle"];
         var user_email = user["email"];
         var comment = JSON.parse(chunk)["comment"];
         var version_id = JSON.parse(chunk)["_id"];
         mongo_endpoints.postComment(user_handle, version_id, user_email, comment);
         res.send(JSON.stringify({"userHandle": user_handle, "commentBody": comment}));

    });
});

//add a version for a feature and store it in the database
app.post("/addversion", async function (req, res){
    req.on('data', async (chunk) => {

        var user = await getUserAuth();
        var user_handle = user["handle"];
        var reviewer = JSON.parse(chunk)["reviewer"];
        var status = JSON.parse(chunk)["status"];
        var fid = JSON.parse(chunk)["fid"];
        var imagePath = JSON.parse(chunk)["imagePath"];
        var whatisnew = JSON.parse(chunk)["whatisnew"];
        var readytoExport = JSON.parse(chunk)["readytoexport"];
        var frameChanged = "";
        var info_dict = {
          "poster":user,
          "status": status,
          "reviewer": reviewer
        };


        var result = await mongo_endpoints.postVersionInfo(info_dict, fid, imagePath, frameChanged, whatisnew, readytoExport)

        res.send(JSON.stringify(result));

    });
});


//team projects 
//get all of the projects for a given team 
//this is an api call, but if there is cached information in the database
//that will return instead. Then, the api call will happen in the background
//and update the database accordingly
//If the database has no results, the api call is made
app.post("/teamProjectsall", async function (req, res) {
    req.on('data', async (chunk) => {
        teamID = JSON.parse(chunk)["teamid"];


        let cachedProjects = await mongo_endpoints.getProjectsByTeamId(teamID);

        var foundProjects = (cachedProjects.length > 0);
        if (foundProjects) {
            res.send(JSON.stringify(cachedProjects));
        }

        var result2 = await getTeamProjectsAuth(teamID).catch(error => console.log(error));

        var result3 = "";

        var all_project_files = [];

        for(var i = 0; i < result2["projects"].length; ++i){
             result3 = await getProjectFilesAuth(result2["projects"][i]["id"]).catch(error => console.log(error));
             var resultimagefinal = await getFileAuth(result3["files"][0]["key"]).catch(error => console.log(error));

             result3["id"] = result2["projects"][i]["id"];
             result3["name"] = result2["projects"][i]["name"];
             result3["thumbnailUrl"] = resultimagefinal["thumbnailUrl"];
             result3["teamid"] = teamID;

             var moment = require('moment-timezone');
            var tz_s = moment.tz.guess();

            var actual_time_final = moment(result3["files"][0]["last_modified"]).tz(tz_s);

            var actual_time_format = actual_time_final.format('MMMM Do YYYY, h:mm:ss a z');
            result3["files"][0]["last_modified"] = actual_time_format;


             all_project_files.push(result3);
             mongo_endpoints.postCacheProjects(result3);
        }

        if (!foundProjects) {
            res.send(JSON.stringify(all_project_files));
        }
    });

});



//return team projects
app.get("/teamProjects", async function (req, res) {
    var result = await getTeamProjectsAuth(teamID).catch(error => console.log(error));

    res.send(JSON.stringify(result));
});

//return the project files for a team using the figma api
app.get("/projectFiles", async function (req, res) {
    let projects = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
    var result = await getProjectFilesAuth(projects["projects"][0]["id"]).catch(error => console.log(error));

    res.send(JSON.stringify(result));
});

//get the file information from figma and return it in html format
app.get("/file", async function (req, res) {
    let projects = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
    let files = await getProjectFilesAuth(projects["projects"][0]["id"]).catch(error => console.log(error));
    var result = await getFileAuth(files["files"][0]["key"]).catch(error => console.log(error));

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

//get the versions of a design from mongo database
app.get("/getVersions", async function(req, res) {

    let result = await mongo_endpoints.getVersions(req.query.fid);

    res.send(result);
});


/*
function to find the id of an image given a feature name
*/
function findID(mapItem, id) {
    let ret = "";
    if (!("children" in mapItem)) {
        return ret;
    }
    if (mapItem["children"] == undefined) {
        return ret;
    }
    for (let i = 0; i < mapItem["children"].length; i++) {
        if (mapItem["children"][i]["name"] == featureName) {
            ret = mapItem["children"][i]["id"];
            break;
        }

        let temp = findID(mapItem["children"][i], id)
        if (temp != "") {
            ret = temp;
            break;
        }

    }
    return ret;
}


//return the file image for a given feature using the figma api
app.post("/fileImagebyFeature", async function (req, res) {
    req.on('data', async (chunk) => {


        if(AccessToken == ""){
            var result = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));

            AccessToken = result["access_token"];
        }
        
        let file = await getFileAuth(JSON.parse(chunk)["id"]).catch(error => console.log(error));

        let picID = findID(file["document"], featureName);

        var result = await getFileImagesAuth(JSON.parse(chunk)["id"], picID).catch(error => console.log(error));
        result["lastModified"] = file["lastModified"];

        res.send(JSON.stringify(result));


    });

});

//return the FileImages from the api
app.get("/fileImage", async function (req, res) {


    let projects = await getTeamProjectsAuth(teamID).catch(error => console.log(error));

    let files = await getProjectFilesAuth(projects["projects"][0]["id"]).catch(error => console.log(error));

    let file = await getFileAuth(files["files"][0]["key"]).catch(error => console.log(error));


    let picID = findID(file["document"], featureName);


    var result = await getFileImagesAuth(files["files"][0]["key"], picID).catch(error => console.log(error));


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
