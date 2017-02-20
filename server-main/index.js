"use strict";

var express = require('express');
var app = express();

var body_parser = require('body-parser');
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));

var database_accessor = require('database-accessor');

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

var collegeController = require('./controllers/collegeController');
collegeController.init(app);

var courseController = require('./controllers/courseController');
courseController.init(app);

var undergradDegreeController = require('./controllers/undergradDegreeController');
undergradDegreeController.init(app);
