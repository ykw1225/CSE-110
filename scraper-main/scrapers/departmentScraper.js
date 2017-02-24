"use strict";

exports.getDepartments = function(callback, request) {
    var departments = [];
    var url = "http://plans.ucsd.edu/controller.php?action=LoadSearchControls";

    request(url, function(error, response) {
        var body = JSON.parse(response.body);
        for(var dep of body["departments"]) {
            if(!(dep.code == "LIT" || dep.code == "THEA")) {
                departments.push([dep.code, dep.name]);
            }
        }
        console.log(body["departments"]);
        callback(departments);
    });
};
