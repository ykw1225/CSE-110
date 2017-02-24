"use strict";

exports.init = function (app) {
    app.get('/api/college', function (request, response) {
        response.send([
            'college1',
            'college2'
        ]);
    });
};