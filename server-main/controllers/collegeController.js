"use strict";

exports.init = function (app) {
    app.get('/api/college', function (request, response) {
        response.send([
            'ERC',
            'Marshall',
            'Muir',
            'Revelle',
            'Sixth',
            'Warren'
        ]);
    });
};