var database_accessor = require('database-accessor');

// This function should contain all of the course related RESTful APIs
exports.init = function (app) {
    app.get('/api/course/info/:department/:coursenumber', function (request, response) {
        // TODO: Handle incorrect request format.

        console.log("Finding Course Info For " + request.params.department + " " +
            request.params.coursenumber);

        database_accessor.getCourseInfo(request.params.department.toUpperCase() + ' '
            + request.params.coursenumber, function (result) {
                // Handle results

                response.send(result);
            });
    });

    app.get('/api/course/map/:department/:coursenumber', function (request, response) {
        // TODO: Handle incorrect request format.

        console.log("Finding Course Map For " + request.params.department + " " +
            request.params.coursenumber);

        database_accessor.getCourseMap(request.params.department.toUpperCase() + ' '
            + request.params.coursenumber, function (result) {
                // Handle results

                response.send(result);
            });
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
