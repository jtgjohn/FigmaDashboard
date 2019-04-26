const mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const mongo_url = process.env.MONGO_URL;


/*
Function to get the versions of a design
Requires the id of the feature for the versions
returns an array of all the versions for the design
sorted by date descending
*/
exports.getVersions = async function(featureId) {
    try {
        let db = await mongo.connect(mongo_url, {useNewUrlParser: true});

        var dbo = db.db("figmaDB");
        var date = new Date();

        try {
            let res = await dbo.collection("versions").find({fid: featureId}).sort({actual_time_obj: -1}).toArray();

            return res;
        }
        catch (err) {return err + "Query failed";}
        finally { db.close(); }
    }
    catch (err) {return err + "Failled to connect to db"; }
}

/*
Function to get the versions filtered by a certain status
requires the feature id and the status of the versions desired
returns an array of all the versions for the feature that correspond
to the status
sorted by date in descending order
*/
exports.getVersionsByStatus = async function(featureId, fstatus) {
    try {
        let db = await mongo.connect(mongo_url, {useNewUrlParser: true});

        var dbo = db.db("figmaDB");
        var date = new Date();

        try {
            let res = await dbo.collection("versions").find({fid: featureId, status: fstatus}).sort({actual_time_obj: -1}).toArray();

            return res;
        }
        catch (err) {return err + "Query failed";}
        finally { db.close(); }
    }
    catch (err) {return err + "Failled to connect to db"; }
}


/*
Function to post a comment
requires the user handle, the id of the version to add a comment to,
the user email, and the comment to be added
there is no return value but the comment is added to the database
and an error is thrown if caught
*/
exports.postComment = function(userHandle, versionId, userEmail, comment) {
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

        var comments = [];
        comments.push(doc);
        dbo.collection("versions").updateOne({_id: ObjectID(versionId)}, {$push: {comments: comments}}, function(err, result) {

            if (err) throw err;
            db.close();
        });
        dbo.collection("versions").updateOne({_id: ObjectID(versionId), comments: {$exists: false}},  {$set: {comments: [comments]}},
            function(err, result){
        });
        
    });
}

/*
Function to add a team to a user
requires the email for the user logged in and the team id to add
no return call but adds to the database the team id
*/
exports.postAddUserTeams = async function(uEmail, team) {
    try {
        let db =  mongo.connect(mongo_url, { useNewUrlParser: true });
        var dbo = db.db("figmaDB");
        try {
            let res = await dbo.collection("users").update({userEmail: uEmail}, {$push: {teamIDs: team}});

            dbo.collection("users").updateOne(
              {userEmail: uEmail},
                {$setOnInsert: { teamIDs: [team]}}, {upsert: true});

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

/*
Function to post the information on a version
requires the json information, feature id, image path
frame that was changed, title of what is new, ready to export boolean
returns the result from the insert query into mongo
*/
exports.postVersionInfo = async function(info, fid, imagePath, frameChanged, whatisnew, readytoExport) {
    var ops_tmp = {};
    try {
        let db = await mongo.connect(mongo_url, {useNewUrlParser: true});

        var dbo = db.db("figmaDB");
        var moment = require('moment-timezone');
        var tz_s = moment.tz.guess();

        var actual_time_final = moment().tz(tz_s);

        var actual_time_format = actual_time_final.format('MMMM Do YYYY, h:mm:ss a z');

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

        try {
            let res = await dbo.collection("versions").insertOne(doc);
            return res["ops"][0];

            return res;
        }
        catch (err) {return err + "Query failed";}
        finally { db.close(); }
    }
    catch (err) {return err + "Failled to connect to db"; }
}



/*
Function to get the teams that a user is on
requires the email of the user 
returns the team the user is on
*/
exports.getUserTeams = async function(uEmail) {
    try {
        let db = await mongo.connect(mongo_url, {useNewUrlParser: true});

        var dbo = db.db("figmaDB");

        try {
            let res = await dbo.collection("users").findOne({userEmail: uEmail});

            return res;
        }
        catch (err) {return err + "Query failed";}
        finally { db.close(); }
    }
    catch (err) {return err + "Failled to connect to db"; }
}

/*
Function to remove a user's team
requires the email of the user and the team they wish to delete
deletes it from the database
*/
exports.postRemoveUserTeams = function(uEmail, team) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");

        let uTeams = []
        getUserTeams(uEmail, function(err, resultteamu){
            var teams = resultteamu["teamIDs"];
            teams.splice(teams.indexOf(team), 1);
            dbo.collection("users").removeOne({userEmail: uEmail});

              dbo.collection("users").insertOne(
              {userEmail: uEmail, teamIDs: teams});
              db.close();
        });
       
    });
}

/*
Function to cache the information for a given project
takes the information given from the api and adds it to the database
*/
exports.postCacheProjects =  function(data) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");
        const collection = dbo.collection("projects");
        collection.updateOne({id: data["id"], teamid: data["teamid"]}, {$set: data}, {upsert:true}, function(err, result) {
            if (err) throw err;
            db.close();
        });

       
    });
}

/*
Function to get the projects a user is on based on a team id
returns all projectst associated with that team id
*/
exports.getProjectsByTeamId =  async function(nteamid){
    try {
        let db = await mongo.connect(mongo_url, {useNewUrlParser: true});

        var dbo = db.db("figmaDB");

        try {
            let res = await dbo.collection("projects").find({teamid: nteamid}).toArray();

            return res;
        }
        catch (err) {return err + "Query failed";}
        finally { db.close(); }
    }
    catch (err) {return err + "Failled to connect to db"; }
}

/*
Function to store the features for a given project in the database
takes the data returned from the api and stores it 
*/
exports.postCacheFeatures =  function(data) {
    mongo.connect(mongo_url, {useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("figmaDB");
        const collection = dbo.collection("features");
        collection.updateOne({key: data["key"], projectId: data["projectId"]}, {$set: data}, {upsert:true}, function(err, result) {
            if (err) throw err;
            db.close();
        });
    });
}


/*
Function to get the features based on a project id 
requries the project id and returns the features as an array
*/
exports.getFeaturesByProjectId =  async function(pid){
    try {
        let db = await mongo.connect(mongo_url, {useNewUrlParser: true});

        var dbo = db.db("figmaDB");

        try {
            let res = await dbo.collection("features").find({projectId: pid}).toArray();

            return res;
        }
        catch (err) {return err + "Query failed";}
        finally { db.close(); }
    }
    catch (err) {return err + "Failled to connect to db"; }
}

/*
Function to post the update of a status
take the new status and who changed it and
updates the status of a version to the new status
*/
exports.postStatusUpdate = async function(user, user_handle, user_email, chunk) {
    try {
        let db = await mongo.connect(mongo_url, {useNewUrlParser: true});

        var dbo = db.db("figmaDB");
        var moment = require('moment-timezone');
        var tz_s = moment.tz.guess();
        var actual_time_final = moment().tz(tz_s);
        var actual_time_format = actual_time_final.format('MMMM Do YYYY, h:mm:ss a z');

        try {
            let res1 = await dbo.collection("versions").updateOne({_id: ObjectID(JSON.parse(chunk)["versionId"])}, {$set: {lastChanger: user_handle, lastChangetime: actual_time_format }});
            let res2 = await dbo.collection("versions").updateOne({_id: ObjectID(JSON.parse(chunk)["versionId"]), lastChanger: {$exists: false}},  {$set: {lastChanger: user_handle}});
           	let res3 = await dbo.collection("versions").updateOne({_id: ObjectID(JSON.parse(chunk)["versionId"]), lastChangetime: {$exists: false}},  {$set: {lastChangetime: actual_time_format}});
            let res = await dbo.collection("versions").updateOne({_id: ObjectID(JSON.parse(chunk)["versionId"])}, {$set: {status: JSON.parse(chunk)["status"]}});
 
           return res;
        }
        catch (err) {return err + "Query failed";}
        finally { db.close(); }
    }
    catch (err) {return err + "Failled to connect to db"; }
}
