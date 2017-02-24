"use strict";

var database_accessor = require('database-accessor');

//check if a string contains number
var letters = /^[A-Za-z]+$/;
var letterNumCheck = /^[0-9A-Za-z]+$/; //coursenumber can contain letters and numbers

// This function should contain all of the course related RESTful APIs
exports.init = function (app) {

    app.get('/api/course/info/:department/:coursenumber', function (request, response) {
        // Handle incorrect request format.

        //checking deapartment params, report error if it contains not only letters
        if (!(request.params.department.match(letters) )|| request.params.department.length <=0 ) {
            var errorNode = {
                Code: 400,
                Message: "incorrect request format: department\n"
            };
            response.status(errorNode.Code).send(errorNode.Message);
        }

        //checking coursenumber params, report error if it contains something other than numbers or letters
        else if (!(request.params.coursenumber.match(letterNumCheck)) || request.params.coursenumber.length <=0 ) {
            var errorNode = {
                Code: 400,
                Message: "incorrect request format: coursenumber\n"
            };
            response.status(errorNode.Code).send(errorNode.Message);
        }

        else {
            console.log("Finding Course Info For " + request.params.department + " " + request.params.coursenumber);

            //calling database
            database_accessor.getCourseInfo(request.params.department.toUpperCase() + ' ' + request.params.coursenumber.toUpperCase(), function (result) {
                // Handle results
                if (result.Code != 200){
                    //error occurred
                    response.status(result.Code).send(result.Message);
                }
                else {
                    //return response
                    response.send(result.body);
                }
            });
        }
    });

    app.get('/api/course/map/:department/:coursenumber', function (request, response) {
        // Handle incorrect request format.

        //checking department params, report error if it contains not only letters
        if (!request.params.department.match(letters) || !request.params.department) {
            var errorNode = {
                Code: 400,
                Message: "incorrect request format: department\n"
            };
            response.status(errorNode.Code).send(errorNode.Message);
        }

        //checking coursenumber params, report error if it contains something other than numbers or letters
        else if (!request.params.coursenumber.match(letterNumCheck)) {
            var errorNode = {
                Code: 400,
                Message: "incorrect request format: coursenumber\n"
            };
            response.status(errorNode.Code).send(errorNode.Message);
        }

        else {
            console.log("Finding Course Map For " + request.params.department + " " + request.params.coursenumber);

            database_accessor.getCourseMap(request.params.department.toUpperCase() + ' ' + request.params.coursenumber.toUpperCase(), function (result) {
                // Handle results
                if (result[0].hasOwnProperty('Code')){
                    //error occurred
                    response.status(result[0].Code).send(result[0].Message);
                }
                else {
                    response.send(result);
                }
            });
        }
    });

    app.get('/api/:department/course', function (request, response) {
        console.log("Finding all courses in " + request.params.department);
        database_accessor.getAllClassesInDepartment(request.params.department.toUpperCase(), function(result) {
            response.send(result);
        });
    });
};
