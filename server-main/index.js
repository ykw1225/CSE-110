var express = require('express');
var app = express();

var body_parser = require('body-parser');
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));

var database_accessor = require('database-accessor');

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

app.post("/getCourseInfo", function(req, res) {
    console.log("Finding Course Info For " + req.body['course']);

    var courseInfoCallback = function(result) {
        res.send(result);
    };
    database_accessor.getCourseInfo(req.body['course'], courseInfoCallback);
});

app.post("/getCourseMap", function(req, res) {
    console.log("Finding Course Map For " + req.body['course']);

    var courseMapCallback = function(result) {
        res.send(result);
    };
    database_accessor.getCourseMap(req.body['course'], courseMapCallback);
});

var callback = function(result) {
    console.log(result['prereqs']);
};



//console.log(res);
