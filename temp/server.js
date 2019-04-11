var express = require("express");
var app = express();
var path = require('path');
var fetch = require('isomorphic-fetch');
var cors = require('cors');
require('dotenv').config();
var ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
const mongo_url = process.env.MONGO_URL;

const teamID = "681911804688300104";
const featureName = "Export Feature Dropdown";

app.options('*', cors()); 

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
            "client_id": process.env.clientID,
            "client_secret": process.env.clientSec,
            "redirect_uri": callback2,
            "code": code,
            "grant_type": "authorization_code"
        })
    });

    let ret = await result.json();
    return ret;
}

//OAuth
//=====================================================================================
async function getUserAuth(){

    let result = await fetch('https://api.figma.com/v1/me/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    })

    let ret = await result.json();
    console.log("USER AUTH RET: %j",ret);
    return ret;
}

// async function checkForToken() {
//     mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("figmadb");

//         dbo.collection("users").findOne()
//     });
// }

async function getTeamProjectsAuth(teamId){
    let result = await fetch('https://api.figma.com/v1/teams/' + teamId + "/projects", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    });

    let ret = await result.json();

    return ret;
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

function getVersions(featureId, callback) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("versions").find({fid: featureId}).sort({date: -1}).toArray(function(err, result) {
            if (err) callback(err, null);
            else callback(null, result);
            db.close();
        });
    });
}

function getMostRecentVersionImage(featureId, callback) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("versions").find({fid: featureId}).sort({date: -1}).limit(1).toArray(function(err, result) {
            if (err) callback(err, null);
            else callback(null, result);
            db.close();
        });
    });
}

function getVersionInfo(versionId, callback) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("versions").findOne({_id: versionId}, function(err, result) {
            if (err) callback(err, null);
            else callback(null, result);
            db.close();
        });
    });
}

function postComment(versionId, userEmail, comment) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        var date = new Date();
        var doc = {
            userEmail: userEmail,
            commentBody: comment,
            timestamp: date
        };
        console.log("Updating versionID");
        console.log(versionId);
        dbo.collection("versions").find({_id: ObjectID(versionId)}).toArray(function(err, result) {
            console.log("RESULTAT");
            console.log(result);
       
        });
        var comments = [];
        comments.push(comment);
        dbo.collection("versions").updateOne({_id: ObjectID(versionId)}, {$push: {comments: comment}}, function(err, result) {
            // console.log(result);
            if (err) throw err;
            db.close();
        });
        dbo.collection("versions").updateOne({_id: ObjectID(versionId), comments: {$exists: false}},  {$set: {comments: comments}},
            function(err, result){
                console.log(result);
        });
        
    });
}


function getComments(versionId, callback){
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        var date = new Date();
       
        console.log("RECEIVING Version id");
        console.log(versionId);
        dbo.collection("versions").find({_id: versionId}).toArray(function(err, result) {
            console.log("RESULTAT");
            console.log(result);
            if (err) callback(err, null);
            else callback(null, result);
            db.close();
        });
    });
}

function postVersionInfo(info, fid, imagePath, frameChanged, whatisnew, readytoExport) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        var date = new Date();
        var doc = {
            poster: info.poster,
            status: info.status,
            reviewer: info.reviewer,
            imagePath: imagePath,
            fid: fid,
            frameChanged: frameChanged,
            timestamp: date,
            whatisnewinfo: whatisnew,
            export: readytoExport
        };

        dbo.collection("versions").insertOne(doc, function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
}

function getUserTeams(uEmail, callback) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("users").findOne({userEmail: uEmail}, function(err, result) {
            if (err) callback(err, null);
            else callback(null, result);
            db.close();
        });
    });
}

function postAddUserTeams(uEmail, team, callback) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("users").updateOne({userEmail: uEmail}, {$push: {teams: team}}, function(err, result) {
            if (err) throw err;
            db.close();
        });
    });
}

function postRemoveUserTeams(uEmail, team, callback) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        let uTeams = []
        uTeams = getUserTeams(uEmail);
        uTeams.splice(uTeams.indexOf(team), 1);

        dbo.collection("users").updateOne({userEmail: uEmail}, {$push: {teams: uTeam}}, function(err, result) {
            if (err) throw err;
            db.close();
        });
    });
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
        // let result = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));
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

app.post("/getcomments", async function (req, res){
    req.on('data', async (chunk) => {

         var version_id = JSON.parse(chunk)["_id"];
         getComments(version_id, function(err, result) {
                 console.log("CURR COMMENTS...");
                 console.log(result);
                if (err) throw err;
                else res.send(result);
         });

    });
});


app.post("/updatestatus", async function (req, res){
    req.on('data', async (chunk) => {
          mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");
        console.log(JSON.parse(chunk));
       
        dbo.collection("versions").updateOne({_id: ObjectID(JSON.parse(chunk)["versionId"])}, {$set: {status: JSON.parse(chunk)["status"]}}, function(err, result) {
            console.log("VERS");
            console.log(result);
            if (err) throw err;
            db.close();
        });
       
        
    });
        
         

    });
});
app.post("/addcomment", async function (req, res){
    req.on('data', async (chunk) => {

        var user = await getUserAuth();
         console.log("USER");
          console.log(user);
         var user_email = user["email"];
         var comment = JSON.parse(chunk)["comment"];
         var version_id = JSON.parse(chunk)["_id"];
         postComment(version_id, user_email, comment);

    });
});

app.post("/addversion", async function (req, res){
    req.on('data', async (chunk) => {
          // postVersionInfo(info, fid, imagePath, frameChanged)

          var user = await getUserAuth();
          console.log("USER");
          console.log(user);
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

          console.log(info_dict);
          console.log(imagePath);
          console.log(whatisnew);
          console.log(readytoExport);
          console.log(user_handle);
          console.log(reviewer);
          console.log(status);
          console.log(fid);


          postVersionInfo(info_dict, fid, imagePath, frameChanged, whatisnew, readytoExport);

    });
});


//team projects
app.post("/teamProjectsall", async function (req, res) {
    req.on('data', async (chunk) => {
        console.log(req["query"]);
        console.log(JSON.parse(chunk));
        if(AccessToken == ""){
            let result = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));
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


app.get("/versionInfo", function (req, res) {
    getVersionInfo(req.vid, function(err, result) {
        if (err) throw err;
        else res.send(result);
    });
});

app.get("/getVersions", function(req, res) {

    console.log("REQ");
    console.log(req.query.fid);
    
    getVersions(req.query.fid, function(err, result) {
        if (err) throw err;
        else res.send(result);
    });
})


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


app.post("/fileImagebyFeature", async function (req, res) {
    req.on('data', async (chunk) => {
        console.log(req["query"]);
        console.log(JSON.parse(chunk));
        if(AccessToken == ""){
            let result = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));
            console.log(result);
            AccessToken = result["access_token"];
            console.log(AccessToken);
        }
        let file = await getFileAuth(JSON.parse(chunk)["id"]).catch(error => console.log(error));
        console.log(file);
        console.log("intermediate");

        let picID = findID(file["document"], featureName);
        console.log(picID);
        let result = await getFileImagesAuth(JSON.parse(chunk)["id"], picID).catch(error => console.log(error));
        result["lastModified"] = file["lastModified"];
        console.log(result);
        res.send(JSON.stringify(result));


    });
    
});

//FileImages
app.get("/fileImage", async function (req, res) {

    //let projects = await getTeamProjects(teamID).catch(error => console.log(error));
    //let files = await getProjectFiles(projects["projects"][0]["id"]).catch(error => console.log(error));
    //let result = await getFileImages(files["files"][0]["key"], featureID).catch(error => console.log(error));

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