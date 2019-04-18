var express = require("express");
var app = express();
var path = require('path');
var fetch = require('isomorphic-fetch');
var cors = require('cors');
require('dotenv').config();
var ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
const mongo_url = process.env.MONGO_URL;

var teamID = '';
const featureName = "Export Feature Dropdown";

app.options('*', cors());
//AccessToken = "T8-l3zpJSUWMcaYAf5qZvWfYKeKwYHkCRP7ccouF";
AccessToken = "";
callback = "http://localhost:8080/contents.html";
callback2 = "http://localhost:4200/home";

async function OAuthGetToken(code){
    var result = await fetch('https://www.figma.com/api/oauth/token', {
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
    console.log("ACCESS TOKEN");
    console.log(AccessToken);
    var result = await fetch('https://api.figma.com/v1/me/', {
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
    var result = await fetch('https://api.figma.com/v1/teams/' + teamId + "/projects", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AccessToken
        }
    });

    let ret = await result.json();
    console.log("FAILURE???");
    console.log(ret);
    if(ret["status"] == 400){
        ret = {"projects": []};
      
    }

    return ret;
}

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


//API Token
//=====================================================================================

async function getUser(){
    //var result = await fetch('https://api.figma.com/v1/me/' + fileId , {
    var result = await fetch('https://api.figma.com/v1/me/', {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getTeamProjects(teamId){
    var result = await fetch('https://api.figma.com/v1/teams/' + teamId + "/projects", {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getProjectFiles(projectId){
    var result = await fetch('https://api.figma.com/v1/projects/' + projectId + "/files", {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getFile(fileId){
    var result = await fetch('https://api.figma.com/v1/files/' + fileId, {
        method: 'GET',
        headers: {
            'X-Figma-Token': APIKey
        }
    })

    let ret = await result.json()

    return ret
}

async function getFileImages(fileId, ids){
    var result = await fetch('https://api.figma.com/v1/images/' + fileId + "?ids=" + ids, {
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

        dbo.collection("versions").find({fid: featureId}).sort({actual_time_obj: -1}).toArray(function(err, result) {
            console.log(result);
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

function postComment(userHandle, versionId, userEmail, comment) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        var date = new Date();
        var doc = {
            userHandle: userHandle,
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
        comments.push(doc);
        dbo.collection("versions").updateOne({_id: ObjectID(versionId)}, {$push: {comments: comments}}, function(err, result) {
            // console.log(result);
            if (err) throw err;
            db.close();
        });
        dbo.collection("versions").updateOne({_id: ObjectID(versionId), comments: {$exists: false}},  {$set: {comments: [comments]}},
            function(err, result){
                console.log(result);
        });
        
    });
}

function postAddUserTeams(uEmail, team) {
    /*
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("users").updateOne({userEmail: uEmail}, {$push: {teams: team}}, function(err, result) {
            if (err) throw err;
            db.close();
        });
    });



    */

    console.log("UEMAIL");
    console.log(team);

    try {
        console.log("BEGIn..");
        let db =  mongo.connect(mongo_url, { useNewUrlParser: true });
        console.log("INTERMEDIATE..");
        var dbo = db.db("figmaDB");
        console.log("HERE..");
        try {
            console.log("BEFORE");
            const res = dbo.collection("users").update({userEmail: uEmail}, {$push: {teamIDs: team}});
            console.log(res);
            console.log("AFTER");
            dbo.collection("users").updateOne(
              {userEmail: uEmail},
                {$setOnInsert: { teamIDs: [team]}}, {upsert: true});
              

            // dbo.collection("users").updateOne(
            //     {_id: ObjectID(versionId), comments: {$exists: false}},  {$set: {comments: [comments]}},
            // function(err, result){
            //     console.log(result);
            // });
            //console.log(`res => ${JSON.stringify(res)}`);
            //console.log(res);
            return res;
        }
        catch (err) {
            return err + "Error Query Failed";
        }
        finally {
            db.close();
        }
    }
    catch (err) {
        return err + "Error DB connection failed";
    }
    
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

function postVersionInfo(info, fid, imagePath, frameChanged, whatisnew, readytoExport, callback) {
     var ops_tmp = {};
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        // var date = new Date();
        // var moment_c = require('moment');
        // var now = moment_c().format('MMMM Do YYYY, h:mm:ss a');
        // console.log(now);


        var moment = require('moment-timezone');
        var tz_s = moment.tz.guess();
        // var curr = now + tz_s;
        // console.log("TOTAL");
        // console.log(curr);


        var actual_time_final = moment().tz(tz_s);

        var actual_time_format = actual_time_final.format('MMMM Do YYYY, h:mm:ss a z');
        console.log("ACTUAL TIME FINAL..");
        console.log(actual_time_final);

        // var tmp_c = moment_c().clone().tz(tz_s);

        // var current_time_in_zone = tmp_c.format("DD-MM-YYYY h:mm:ss A");
        // console.log("CURRENT TIME IN ZONE.");
        // console.log(current_time_in_zone);
        // console.log("TIMEZONE: ");
        // console.log(tz_s);
        var doc = {
            poster: info.poster,
            status: info.status,
            reviewer: info.reviewer,
            imagePath: imagePath,
            fid: fid,
            frameChanged: frameChanged,
            timestamp: actual_time_format,
            actual_time_obj: actual_time_final.toDate(),
            whatisnewinfo: whatisnew,
            export: readytoExport
        };

        dbo.collection("versions").insertOne(doc, function(err, result) {
            if (err) throw err;
            console.log(result);
            console.log(result["ops"][0]);
            ops_tmp = result["ops"][0];
            console.log("OPS TEMP:");
            console.log(ops_tmp);
            callback(null, ops_tmp);
            db.close();

            
           
        });

    });


    console.log("BEFORE RETURN");
    console.log(ops_tmp);
   
    return ops_tmp;
}

function getUserTeams(uEmail, callback) {
    console.log("getUserTeams..");
    console.log(uEmail);
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("users").findOne({userEmail: uEmail}, function(err, result) {
            if (err) callback(err, null);

            else {
                console.log("RESULT");
                console.log(result);
                callback(null, result);
            }
            db.close();
        });
    });
}

function postAddUserTeams(uEmail, team, callback) {
    console.log("HERE???");
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        dbo.collection("users").updateOne({userEmail: uEmail}, {$addToSet: {teamIDs: team}}, function(err, result) {
            if (err) throw err;
            db.close();
        });

         dbo.collection("users").updateOne(
              {userEmail: uEmail},
                {$setOnInsert: { teamIDs: [team]}}, {upsert: true});
    });
}

function postRemoveUserTeams(uEmail, team, callback) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        let uTeams = []
        console.log("TEAM");
        console.log(team);
        getUserTeams(uEmail, function(err, resultteamu){
             console.log("UTEAMS");
            console.log(resultteamu);
            var teams = resultteamu["teamIDs"];
            teams.splice(teams.indexOf(team), 1);
            console.log("FINAL Teams");
            console.log(teams);
            dbo.collection("users").removeOne({userEmail: uEmail});

              dbo.collection("users").insertOne(
              {userEmail: uEmail, teamIDs: teams});

            // dbo.collection("users").updateOne({userEmail: uEmail}, {$push: {teams: uTeam}}, function(err, result) {
            //     if (err) throw err;
            //     db.close();
            // });
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
    var result = await getUserAuth().catch(error => console.log(error));
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


app.post("/getUserTeams", async function (req, res) {
    req.on('data', async (chunk) => {
        
    console.log("ACCESS TOKEN TEST.");
        var resulttmp = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));
        console.log(resulttmp);
        AccessToken = resulttmp["access_token"];
        console.log(AccessToken);
        
         console.log("GET USER TEAMS..");
        var result = await getUserAuth().catch(error => console.log(error));
        console.log("BEFORE RESULT..");
        console.log(JSON.stringify(result));
        var result_second = await getUserTeams(result["email"], function(err, result){
            console.log(result);
            res.send(result);
        });
    });
    
});

app.post("/removeTeam", async function (req, res){
     req.on('data', async (chunk) => {
          var result = await getUserAuth().catch(error => console.log(error));
            console.log(JSON.stringify(result));
            var result_second = await postRemoveUserTeams(result["email"], JSON.parse(chunk)["team"], function(err, result){
                console.log(result);
                res.end(result);
            });
     });
});


app.post("/postTeam", async function (req, res) {
    req.on('data', async (chunk) => {
        console.log(JSON.parse(chunk));
        console.log("It t'was called");
        // console.log(req);
        let userInfo = await getUserAuth().catch(error => console.log(error));
        let email = userInfo["email"];
        console.log("BEFORE FUNCTION CALL...");
        console.log(email);
        console.log(JSON.parse(chunk)["team"]);
        var result = await postAddUserTeams(email, JSON.parse(chunk)["team"], function(err, result){
            console.log(result);
            res.send(result);
        });
        console.log("AFTER FUNC");
        // res.send(result);
    });
});
app.post("/projectsbyid", async function (req, res){
    req.on('data', async (chunk) => {
        console.log("BY ID PROJECTS");
        // var result = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));
        // console.log(result);
        // AccessToken = result["access_token"];
        var result2 = await getProjectFilesAuth(JSON.parse(chunk)["id"]).catch(error => console.log(error));


        for(var i = 0; i < result2["files"].length; ++i){
            console.log("Hello");
            var result3 = await getFileAuth(result2["files"][i]["key"]).catch(error => console.log(error));
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

         var user_handle = user["handle"];
         var user_email = user["email"];
         var comment = JSON.parse(chunk)["comment"];
         console.log("COMMENT");
         console.log(comment);
         console.log(chunk);
          console.log(JSON.parse(chunk));
         var version_id = JSON.parse(chunk)["_id"];
         postComment(user_handle, version_id, user_email, comment);
         res.send(JSON.stringify({"userHandle": user_handle, "commentBody": comment}));

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


          var posted_version = await postVersionInfo(info_dict, fid, imagePath, frameChanged, whatisnew, readytoExport,
              function(err, result){
                  console.log("FINAL POST..%j", result);
                  res.send(JSON.stringify(result));
              });
          console.log("POSTED VERSION..");
          console.log(posted_version);

    });
});


//team projects
app.post("/teamProjectsall", async function (req, res) {
    req.on('data', async (chunk) => {
        console.log(req["query"]);
        console.log(JSON.parse(chunk));
        teamID = JSON.parse(chunk)["teamid"];
      
        // var result = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));
        // console.log(result);
        // AccessToken = result["access_token"];
        // console.log(AccessToken);
       
        var result2 = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
        console.log(JSON.stringify(result2));
        var result3 = "";
        var all_project_files = [];

        let ret = "<ng-container>";
        for(var i = 0; i < result2["projects"].length; ++i){



             result3 = await getProjectFilesAuth(result2["projects"][i]["id"]).catch(error => console.log(error));
             var resultimagefinal = await getFileAuth(result3["files"][0]["key"]).catch(error => console.log(error));

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
    var result = await getTeamProjectsAuth(teamID).catch(error => console.log(error));

    res.send(JSON.stringify(result));
});

//project files
app.get("/projectFiles", async function (req, res) {
    let projects = await getTeamProjectsAuth(teamID).catch(error => console.log(error));
    var result = await getProjectFilesAuth(projects["projects"][0]["id"]).catch(error => console.log(error));

    res.send(JSON.stringify(result));
});

//File
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

        else{
        console.log(result); 
            res.send(result);
        }
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
    
        var result = await OAuthGetToken(JSON.parse(chunk)["code"]).catch(error => console.log(error));
        console.log(result);
        AccessToken = result["access_token"];
        console.log(AccessToken);
        
        let file = await getFileAuth(JSON.parse(chunk)["id"]).catch(error => console.log(error));
        console.log(file);
        console.log("intermediate");

        let picID = findID(file["document"], featureName);
        console.log(picID);
        var result = await getFileImagesAuth(JSON.parse(chunk)["id"], picID).catch(error => console.log(error));
        result["lastModified"] = file["lastModified"];
        console.log(result);
        res.send(JSON.stringify(result));


    });

});

//FileImages
app.get("/fileImage", async function (req, res) {

    //let projects = await getTeamProjects(teamID).catch(error => console.log(error));
    //let files = await getProjectFiles(projects["projects"][0]["id"]).catch(error => console.log(error));
    //var result = await getFileImages(files["files"][0]["key"], featureID).catch(error => console.log(error));

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

    //var result = await getFileImagesAuth(files["files"][0]["key"], featureID).catch(error => console.log(error));
    var result = await getFileImagesAuth(files["files"][0]["key"], picID).catch(error => console.log(error));
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
