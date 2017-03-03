"use strict";

var database_accessor = require('database-accessor');

exports.init = function(app) {
    app.get('/api/undergrad/:college/degree', function(request, response) {
        response.send([
            'degree1',
            'degree2'
        ]);
    });

    app.get('/api/undergrad/:college/minor', function(request, response) {
        response.send([
            'minor1',
            'minor2'
        ]);
    });

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
}