var express = require('express');
var app = express();

var body_parser = require('body-parser');
app.use(express.static('static-content'));

app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));

var database_accessor = require('database-accessor');

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

var courseController = require('./controllers/courseController');
courseController.init(app);

var callback = function(result) {
    console.log(result['prereqs']);
};



//console.log(res);
