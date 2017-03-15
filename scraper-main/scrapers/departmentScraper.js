"use strict";

exports.getDepartments = function(callback, request) {
    var departments = [];
    var url = "http://plans.ucsd.edu/controller.php?action=LoadSearchControls";

    request(url, function(error, response) {
        var body = JSON.parse(response.body);
        for (var dep of body["departments"]) {
            if (dep.code == "LIT") {
                departments.push([dep.code, dep.name, [dep.code, "LTCH", "LTCO", "LTCS", "LTEN", "LFTR", "LTGM", "LTGK", "LTIT", "LTKO", "LTLA", "LTRU", "LTSP", "LTTH", "LTEA", "LTWL", "LTWR"]]);
            } else if (dep.code == "THEA") {
                departments.push([dep.code, dep.name, [dep.code, "TDAC", "TDCH", "TDDE", "TDDR", "TDGE", "TDGR", "TDHD", "TDHT", "TDMV", "TDPF", "TDPR", "TDPW", "TDTR"]]);
            } else if (dep.code == "NENG") {
                departments.push([dep.code, dep.name, [dep.code, "NANO"]]);
            } else if (dep.code == "LING") {
                departments.push([dep.code, dep.name, [dep.code, "LIGN"]]);
            } else if (dep.code == "SOC") {
                departments.push([dep.code, dep.name, [dep.code, "SOCI"]]);
            } else if (dep.code == "BIOL") {
                departments.push([dep.code, dep.name, [dep.code, "BILD", "BIBC", "BICD", "BIEB", "BIMM", "BIPN", "BISP", "BGGN"]]);
            } else if (dep.code == "HIST") {
                departments.push([dep.code, dep.name, [dep.code, "HILD", "HIAF", "HIEA", "HIEU", "HINE", "HISC", "HITO", "HIUS", "HIGR"]]);
            } else if (dep.code != "JUDA" && dep.code != "LTIT" && dep.code != "GMST" && dep.code != "ITAL" && dep.code != "RELI" && dep.code != "RUSS" && dep.code != "UNAF") {
                departments.push([dep.code, dep.name, [dep.code]]);
            }
        }
        //console.log(body["departments"]);
        callback(departments);
    });
};