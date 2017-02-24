"use strict";

var database_accessor = require('database-accessor');

exports.init = function (app) {
    app.get('/api/department', function (request, response) {
        console.log("Finding all course departments");
        database_accessor.getAllDepartments(function(result) {
            response.send(result);
        });
    });
};