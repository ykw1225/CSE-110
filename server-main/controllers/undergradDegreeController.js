"use strict";

exports.init = function (app) {
    app.get('/api/undergrad/:college/degree', function (request, response) {
        response.send([
            'degree1',
            'degree2'
        ]);
    });

    app.get('/api/undergrad/:college/minor', function (request, response) {
        response.send([
            'minor1',
            'minor2'
        ]);
    });
}