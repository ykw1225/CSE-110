"use strict";

var regMatchDash  = /\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatch = /[A-Za-z]{3,4}\s\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatchClassNum = /\d{1,3}/;
var regMatchClassLetters = /[A-Z]/g;
var regMatchClassName = /[A-Za-z]{3,4}/;
var regParseOr = /[A-Za-z]{3,4}(\s\d{2}A|\s\d{2})/g;
var regParseAll = /([A-Z]{3}|[0-9]{2,3}[A-Z]|[0-9]{2,3})/g;

function NewReq (courses, courses_needed) {
    this.type = ""
    this.courses = courses;
    if (courses_needed == -1){
        this.courses_needed = courses.length;
    } else {
        this.courses_needed = courses_needed;
    }
    this.credits_needed = null;
}

var getTE = function($, cheerio) {
    var TEs = [];

    return TEs;
}

var getPE = function($, cheerio) {
    var PEs = [];

    return PEs;
}

exports.getMajors = function(callback, request, cheerio) {

    var majors = [];
    var url = "http://www.ucsd.edu/catalog/curric/ECE-ug.html";

    var major = ["ECE", "27", "Electrical Engineering", "", {}];

    request(url, function(error, response, html) {
        var $ = cheerio.load(html);

        var requirements = [];
        var desc = $('h2:contains("The Undergraduate Programs")').next().next().text();

        major[3] = desc;

        console.log(desc);

        var lowDivTbl = $('h4:contains("Lower-Division Requirements")').first().nextAll("p");
        for (var index = 0; index < 5; index++) {
            var classes = []
            if (index == 1) {
                var physLD = lowDivTbl.eq(index).text().match(regMatch);
                physLD = physLD.slice(0,1);
                classes = parseClasses(physLD[0]);
            } else if (index == 0) {
                // replace 18 with 20F
                classes = parseClasses(lowDivTbl.eq(index).text());
            } else if (index == 4){
                var eceLD = lowDivTbl.eq(index).text();
                classes = parseCommas(eceLD);
            } else {
                classes = parseClasses(lowDivTbl.eq(index).text());
            }
            requirements.push(new NewReq(classes, -1));
        }

        var udivTbl = $('h4:contains("Upper-Division Requirements")').first()
        var udivTbl_1 = udivTbl.nextAll("h5").first();
        requirements.push(new NewReq(parseCommas(udivTbl_1.next().next().text()).splice(0,6), -1));

        var udivTbl_2 = udivTbl.nextAll("ol").first().text();
        var udivTbl_2 = parseCommas(udivTbl_2);
        udivTbl_2.pop();
        console.log(udivTbl_2);
        requirements.push(new NewReq(udivTbl_2.slice(0,2), -1));
        requirements.push(new NewReq(udivTbl_2.splice(2), 1));

        /* depth requirement - Communication Systems */
        udivTbl = $('p:contains("Communication Systems")').first().next();
        requirements.push(new NewReq(parseCommas(udivTbl.text()), -1));

        /* get electives */
        /*
        requirements.concat(getTE());
        requirements.concat(getPE());
        */

        major[4] = requirements;
        majors.push(major);

        callback(majors);
    });
}

var parseCommas = function(classStr) {
    var str = classStr.match(regParseAll);
    var name = str[0];
    var classes = []
    for (var ind = 1; ind < str.length; ind++) {
        if (str[ind].match(/[0-9]/) != null) {
            classes.push(name + " " + str[ind]);
        } else {
            name = str[ind];
        }
    }
    return classes;
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
