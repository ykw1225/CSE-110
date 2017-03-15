"use strict";

var regMatchDash  = /\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatchClassNum = /\d{1,3}/;
var regMatchClassLetters = /[A-Z]/g;
var regMatchClassName = /[A-Za-z]{3,4}/;
var regParseOr = /[A-Za-z]{3,4}(\s\d{2,3}[A-Z]|\s\d{2,3})/g;
var regParseAll = /([A-Z]{3}|[0-9]{2,3}[A-Z]|[0-9]{2,3})/g;

var NewReq = function(courses, courses_needed) {
    this.type = ""
    this.courses = courses;
    if (courses_needed == -1){
        this.courses_needed = courses.length;
    } else {
        this.courses_needed = courses_needed;
    }
    this.credits_needed = null;
}

exports.getMajors = function(callback, request, cheerio) {
    var paragraphs = 3;
    var courseCountFirstReq = 9

    var majors = [];
    var url = "https://www.math.ucsd.edu/programs/undergraduate/bs_math_comp_science.php";

    var major = ["MATH", "30", "Mathematics-Computer Science", "", {}];

    request(url, function(error, response, html) {
        var $ = cheerio.load(html);

        var requirements = [];

        var mathcs_header = $(".l2main");

        major[3] = mathcs_header.children().eq(4).text();
        /* grabs math 20A-F */
        var currDiv = mathcs_header.children().eq(9).children();
        var lowDiv_1a = currDiv.first().children().eq(1).text();
        var lowDiv_1s_arr = parseClasses(lowDiv_1a);

        requirements.push(new NewReq(lowDiv_1s_arr, -1));

        currDiv = mathcs_header.children().eq(12).children();
        var lowDiv_2a = currDiv.first().children().eq(1).text().replace("/AL","");
        var lowDiv_2arr = parseClasses(lowDiv_2a)

        requirements.push(new NewReq(lowDiv_2arr, -1));

        var lowDiv_3 = currDiv.eq(3);
        requirements.push(new NewReq([grabText(lowDiv_3)], -1));

        var lowDiv_4 = lowDiv_3.next();
        requirements.push(new NewReq([grabText(lowDiv_4)], -1));

        currDiv = mathcs_header.children().eq(14).children().first();
        var lowDiv_5 = currDiv;
        lowDiv_5 = grabText(lowDiv_5).match(regParseOr);
        requirements.push(new NewReq(lowDiv_5, 1));

        var lowDiv_6 = currDiv.next();
        lowDiv_6 = grabText(lowDiv_6).match(regParseOr);
        requirements.push(new NewReq(lowDiv_6, 1));

        var udCourses = $('p:contains("Upper Division Requirements")').next()

        for (var ind = 0; ind < 3; ind ++) {
            var currUDTable = udCourses.children().eq(ind).children().eq(1).text();
            requirements.push(new NewReq(parseClasses(currUDTable), -1));
        }

        udCourses = udCourses.next();
        for (var ind = 1; ind < 5; ind ++) {
            var currUDTable = udCourses.children().eq(ind).children().eq(1).text();
            if (ind > 1) {
                requirements.push(new NewReq(parseClasses(currUDTable), -1));
            } else {
                requirements.push(new NewReq(currUDTable.match(regParseOr), 1));

            }
        }
        var udReqs1 = []
        udCourses = udCourses.next().next();
        for (var ind = 0; ind < 6; ind ++) {
            var currUDTable = udCourses.children().eq(ind).children().eq(1).text();
            udReqs1 = udReqs1.concat(parseClasses(currUDTable));
        }
        requirements.push(new NewReq(udReqs1, 2));

        var udReqs2 = []
        udCourses = udCourses.next().next();
        for (var ind = 0; ind < 12; ind ++) {
            var currUDTable = udCourses.children().eq(ind).children().eq(1).text();
            var udNames = currUDTable.match(regParseAll);
            if (ind == 9 || ind == 10) {
                udReqs2.push(udNames[0] + " " + udNames[1]);
                udReqs2.push(udNames[0] + " " + udNames[2]);
            } else if (ind == 6) {
                udReqs2.push(udNames[0] + " " + udNames[1]);
                udReqs2.push(udNames[0] + " 1" + udNames[2]);
            } else {
                udReqs2 = udReqs2.concat(parseClasses(currUDTable));
            }
        }
        requirements.push(new NewReq(udReqs2, 2));

        var udReqs3 = []
        udReqs3 = udReqs3.concat(udReqs1);
        udReqs3 = udReqs3.concat(udReqs2);
        udCourses = udCourses.next().next();
        for (var ind = 0; ind < 10; ind ++) {
            var currUDTable = udCourses.children().eq(ind).children().eq(1).text();
            udReqs3 = udReqs3.concat(parseClasses(currUDTable));
        }
        requirements.push(new NewReq(udReqs3, 2));

        major[4] = requirements;
        majors.push(major);
        callback(majors)
    });
}

var grabText = function(elem) {
    return elem.children().eq(1).text();
}

var parseClasses = function(classStr){
    var className = classStr.match(regMatchClassName)[0].toUpperCase();
    var thisClassStr = classStr.match(regMatchDash);
    var classNum;
    var letters;
    if (thisClassStr != null) {
        thisClassStr = thisClassStr[0];
        classNum = thisClassStr.match(regMatchClassNum)[0];
        letters = thisClassStr.match(regMatchClassLetters);
    } else {
        classNum = classStr.match(regMatchClassNum)[0];
    }

    if (letters != null) {
        for (var i = 0; i < letters.length; i++) {
            letters[i] = className + " " + classNum + letters[i];
        }
    } else {
        letters = [className + " " + classNum];
    }

    return letters;
}
