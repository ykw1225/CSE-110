var database_accessor = require('database-accessor');

//check if a string contains number
var letters = /^[A-Za-z]+$/;
var numCheck = /^[0-9]+$/;

// This function should contain all of the course related RESTful APIs
exports.init = function (app) {
    app.get('/api/course/info/:department/:coursenumber', function (request, response) {
        // Handle incorrect request format.

        //checking deapartment params, report error if it contains not only letters
        if (!(request.params.department.match(letters) )|| request.params.department.length <=0 ) {
            var errorNode = {
                errorCode: 401,
                errorMessage: "incorrect request formatsssss: department"
            };
            response.send(errorNode);
        }

        //checking coursenumber params, report error if it contains not only numbers
        else if (!(request.params.coursenumber.match(numCheck)) || request.params.coursenumber.length <=0 ) {
            var errorNode = {
                errorCode: 402,
                errorMessage: "incorrect_request_format: coursenumber"
            };
            response.send(errorNode);
        }
        
        else {
        console.log("Finding Course Info For " + request.params.department + " " +
            request.params.coursenumber);

        database_accessor.getCourseInfo(request.params.department.toUpperCase() + ' '
            + request.params.coursenumber, function (result) {
                // Handle results

                response.send(result);
            });
        }
    });

    app.get('/api/course/map/:department/:coursenumber', function (request, response) {
        // Handle incorrect request format.

        //checking deapartment params, report error if it contains not only letters
        if (!request.params.department.match(letters) || !request.params.department) {
            var errorNode = {
                errorCode: 401,
                errorMessage: "incorrect request format: department"
            };
            response.send(errorNode);
        }

        //checking coursenumber params, report error if it contains not only numbers
        else if (!request.params.coursenumber.match(numCheck)) {
            var errorNode = {
                errorCode: 402,
                errorMessage: "incorrect request format: coursenumber"
            };
            response.send(errorNode);
        }

        else {
        console.log("Finding Course Map For " + request.params.department + " " +
            request.params.coursenumber);

        database_accessor.getCourseMap(request.params.department.toUpperCase() + ' '
            + request.params.coursenumber, function (result) {
                // Handle results

                response.send(result);
            });
        }
    });

    app.get('/api/departments', function (request, response) {
        console.log("Finding all course departments");
        database_accessor.getAllDepartments(function(result) {
            response.send(result);
        });
    });

    app.get('/api/:department/courses', function (request, response) {
        console.log("Finding All courses in " + request.params.department);
        database_accessor.getAllClassesInDepartment(request.params.department.toUpperCase(), function(result) {
            response.send(result);
        });
    });

    // Deprecated.  Refactored API to make it more angular friendly.
    app.post("/getCourseInfo", function(req, res) {
        console.log("Finding Course Info For " + req.body['course']);

        //TODO incorrect request format

        var courseInfoCallback = function(result) {
            //TODO handle different results
            res.send(result);
        };
        database_accessor.getCourseInfo(req.body['course'], courseInfoCallback);
    });

    // Deprecated.  Refactored API to make it more angular friendly.
    app.post("/getCourseMap", function(req, res) {
        console.log("Finding Course Map For " + req.body['course']);

        var courseMapCallback = function(result) {
            res.send(result);
        };
        database_accessor.getCourseMap(req.body['course'], courseMapCallback);
    });
};
