"use strict";

var database_accessor = require('database-accessor');

//check if a string contains other characters
var letters = /^[A-Za-z]+$/;

exports.init = function(app) {
    /*
     * return list of degrees with given department (not considering colleges yet)
     */
    app.get('/api/undergrad/:college/degree/:department', function(request, response) {
        var departmentName = request.params.department.toUpperCase();
        console.log("Finding degrees for " + departmentName);

        database_accessor.getDegreesInDepartment(departmentName, function(result) {
            //handle error
            if (result.hasOwnProperty('Code')) {
                response.status(result.Code).send(result.Message);
            } else {
                response.send(result);
            }
        });
    });

    /*
     * get specific degree object with given degree code
     */
    app.get('/api/undergrad/:college/degree/:department/:code', function(request, response) {
        var departmentName = request.params.department.toUpperCase();
        var codeName = request.params.code.toUpperCase();
        //checking deapartment params, report error if it contains not only letters
        if (!(request.params.department.match(letters)) || request.params.department.length <= 0) {
            var errorNode = {
                Code: 405,
                name: String(request.params.department + ' ' + request.params.coursenumber),
                Message: "incorrect request format: department\n"
            };
            response.status(errorNode.Code).send(errorNode.Message);
        }
        console.log("Finding degree for " + departmentName + ' ' + codeName);
        database_accessor.getDegreeFromCode(departmentName, codeName, function(result) {
            //handle error
            if (result.hasOwnProperty('Code')) {
                response.status(result.Code).send(result.Message);
            } else {
                response.send(result);
            }
        });
    });

    /*
     * Get all departments that has degree info in db
     */
    app.get('/api/undergrad/department', function(request, response) {
        console.log('Finding all departments names with degree programs in db');
        database_accessor.getDepartmentsFromDegrees(function(result) {
            //handle error
            if (result.hasOwnProperty('Code')) {
                response.status(result.Code).send(result.Message);
            } else {
                response.send(result);
            }
        });
    });
}