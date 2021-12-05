var http = require('http');
var url = require('url');
var strdec = require('string_decoder').StringDecoder;
var mysql = require('mysql');
var mongo = require('mongodb')
var mongoclient = mongo.MongoClient
let URI = "mongodb://ayush:ayush2301@localhost:27017/wmanage"

// To do attendence put, fetch, defaulters fetch (1,0) waale and client side ingredient processing

var con = mysql.createConnection({
    user: 'root',
    password: 'ayush2301',
    database: 'wmanage'
})

mongoclient.connect(URI, function (err, database) {
    if (err) throw err;
    console.log("connected to database");
})

con.connect(function (err) {
    if (err) throw err;
    console.log("MySQL Database Connection Established");
})

function put_menu(req, res) {
    decoder = new strdec('utf-8');
    buffer = "";
    req.on("data", function (chunk) {
        buffer += decoder.write(chunk);
    })
    req.on("end", function () {
        buffer += decoder.end();
        menulst = JSON.parse(buffer);
        console.log(menulst);
        for (i = 0; i < menulst.length; i++) {
            menu_query = "insert into menu (item) values('" + menulst[i] + "');"
            if (menulst[i] == "0") {
                console.log("entered");
                res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*" });
                res.write("menu set successfully");
                res.end();
                break;
            }
            con.query(menu_query, function (err, result) {
                if (err) {
                    console.log(err.code);
                    con.query("delete from menu", function (err, res) {
                        if (err) throw err;
                    });
                };
                console.log("new addition in menu");

            });
        }
    })

};

function dish_list(req, res) {
    let decoder = new strdec('utf-8');
    let buffer = "";
    req.on("data", function (chunk) {
        // console.log(chunk);
        buffer += decoder.write(chunk)
    })
    req.on("end", function (chunk) {
        buffer += decoder.end()
        mongoclient.connect(URI, function (err, database) {
            if (err) throw err;
            // console.log("Connected to MongoDB");
            let dishobj = JSON.parse(buffer);
            let dbobj = database.db("wmanage");
            dbobj.collection("Dishes").insertOne(dishobj, function (err, resp) {
                if (err) throw err;
                console.log("Inserted Dish Successfully");
                res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*" });
                res.write(buffer);
                res.end();
            });
        })

    })
}

function fetch_amt(req, res) {
    let decoder = new strdec('utf-8');
    let buffer = "";
    req.on("data", function (chunk) {
        buffer += decoder.write(chunk);
    })
    req.on("end", function () {
        buffer += decoder.end();
        let fquery = "select item from menu";
        var promises = []
        con.query(fquery, function (err, result) {
            if (err) throw err;
            for (i = 0; i < result.length; i++) {
                let iquery = { "Dish": result[i].item };
                let ingredients = [];
                promises.push(new Promise(function (resolve) {
                    mongoclient.connect(URI, function (err, database) {
                        let dbobj = database.db("wmanage");
                        dbobj.collection("Dishes").findOne(iquery, function (err, resp) {
                            if (err) throw err;
                            if (resp) {
                                console.log("Found " + iquery.Dish);
                                resolve(resp);
                            }
                            else {
                                console.log(iquery.Dish + " not found in the database");
                                reso = { "Dish": iquery.Dish, "Ingredients": "Not Found" };
                                resolve(reso);
                            }
                        })
                    })
                }));
            }
            Promise.all(promises).then(function (value) {
                res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
                res.write(JSON.stringify(value));
                res.end();
            })
        })
    })
}

function atten_put(req, res) {
    let decoder = new strdec('utf-8');
    let buffer = "";
    req.on("data", function (chunk) {
        buffer += decoder.write(chunk);
    })
    req.on("end", function () {
        buffer += decoder.end();
        attenobj = JSON.parse(buffer);
        switch (attenobj.attentype) {
            case "tenAtten": //Updates tentative attendance
                tquery = "update Attendance set tenAtten = " + attenobj.value + " where (studID = '" + attenobj.studID + "');"
                con.query(tquery, function (err, result) {
                    if (err) throw err;
                    console.log("insertion into Attendance");
                    res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
                    res.write("Tentative Attendence of " + attenobj.studID + " Updated");
                    res.end();
                })
                break;
            case "actAtten": //Updates actual attendance
                tquery = "update Attendance set actAtten = " + attenobj.value + " where (tenAtten = 1 and studID = '" + attenobj.studID + "');"
                con.query(tquery, function (err, result) {
                    if (err) throw err;
                    console.log("insertion into Attendance");
                    res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
                    res.write("Actual Attendence of " + attenobj.studID + " Updated");
                    res.end();
                })
                break;
            case "general": //Add students (usually to be done through Sign_up)
                tquery = "insert into Attendance(studID) values ('"+attenobj.studID+"');";
                con.query(tquery, function (err, result) {
                    if (err) throw err;
                    console.log("insertion into Attendance");
                    res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
                    res.write("Student " + attenobj.studID + " Added");
                    res.end();
                })
        }
    })
}
//comment

function penal_action(req,res){
    let decoder = new strdec('utf-8');
    let buffer = "";
    req.on("data",function(chunk){
        buffer += decoder.write(chunk);
    })
    req.on("end",function(){
        buffer += decoder.end();
        let penalobj = JSON.parse(buffer);
        switch(penalobj.type){
            case "put":
                mongoclient.connect(URI, function (err, database) {
                    let dbobj = database.db("wmanage");
                    const d = new Date();
                    let penal = {"studID":penalobj.studID,"Amount":50,"Timestamp":d.toString()};
                    dbobj.collection("Penalties").insertOne(penal,function(err,resp){
                        console.log(resp);
                        res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
                        res.write(JSON.stringify(penalobj));
                        res.end();
                    })
                })
                break;
            case "fetch":
                mongoclient.connect(URI, function (err, database) {
                    let dbobj = database.db("wmanage");
                    let qpenal = {"studID":penalobj.studID};
                    dbobj.collection("Penalties").find(qpenal).toArray(function(err,resp){
                        // console.log(resp);
                        res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
                        res.write(JSON.stringify(resp));
                        res.end();
                    })
                })

        }
    })
}

function fetch_atten(req, res) {
    let decoder = new strdec('utf-8');
    let buffer = "";
    req.on("data", function (chunk) {
        buffer += decoder.write(chunk);
    })
    req.on("end", function () {
        buffer += decoder.end();
        fquery = "select * from Attendance;";
        con.query(fquery, function (err, result) {
            if (err) throw err;
            res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
            res.write(JSON.stringify(result));
            res.end();
        })
    })
}

function fetch_menu(req, res) {
    let decoder = new strdec('utf-8');
    let buffer = "";
    req.on("data", function (chunk) {
        buffer += decoder.write(chunk);
    })
    req.on("end", function () {
        buffer += decoder.end();
        fquery = "select * from menu;";
        con.query(fquery, function (err, result) {
            if (err) throw err;
            res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" });
            res.write(JSON.stringify(result));
            res.end();
        })
    })
}




http.createServer(function (req, res) {
    if (req.method == "OPTIONS") {
        res.writeHead(200, "OK", { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" });
        res.end();
    }
    else {
        pathobj = url.parse(req.url, true);
        switch (pathobj.pathname) {
            case "/menu_enter":
                put_menu(req, res); //Put menu into table
                break;
            case "/new_dish":
                dish_list(req, res); //put new dish into Mongo
                break;
            case "/fetch_amt": // Only Ingredient Fetch in L.Obj Ingredients - not found if not found
                fetch_amt(req, res);
                break;
            case "/fetch_atten": // Full Attendance table fetch in L.Obj
                fetch_atten(req, res);
                break;
            case "/atten_put": // Updating the Attendance Table
                atten_put(req, res);
                break;
            case "/menu_get": // gets the menu table in L.Obj
                fetch_menu(req, res);
                break;
            case "/penal_action": //penalties put or fetch
                penal_action(req,res);
                break;
        }
    }
}).listen(8081, "localhost");