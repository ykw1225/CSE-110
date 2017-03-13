"use strict";

var regMatchDash  = /\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatch = /[A-Za-z]{3,4}\s\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatchClassNum = /\d{1,3}/;
var regMatchClassLetters = /[A-Z]/g;
var regMatchClassName = /[A-Za-z]{3,4}/;
var regParseOr = /[A-Za-z]{3,4}(\s\d{2}A|\s\d{2})/g;
var regParseAll =/(Economics|Econ|Math|Chem|(\d{1,3}[A-Z]\-[A-Z]|[A-Z]{2,4}|[0-9]{1,3}[A-Z]+|[0-9]{1,3}))/g;

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

var getTE = function($, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList) {
    var TEs = [];
    TEs = TEs.concat(eceCoursesList);
    TEs = TEs.concat(physCoursesList);
    // gets math not included
    var teHeader = $('p:contains("Mathematics")').first();
    var mathNotIncluded = parseCommas(teHeader.next().text());
    mathNotIncluded.splice(1,1);
    TEs = TEs.concat(removeClassesNotInc(mathCoursesList, mathNotIncluded));

    // gets all the cs not included
    var teHeader_1 = teHeader.nextAll().eq(6);
    tmpStr = teHeader_1.text();
    var cseNotIncluded = parseCommas(teHeader_1.text());
    var tmpArr_1 = parseClasses(cseNotIncluded[5]);
    cseNotIncluded.splice(5,1,tmpArr_1[0], tmpArr_1[1]);
    cseNotIncluded.splice(9,1);
    cseNotIncluded.splice(10,1);
    cseNotIncluded.splice(11,1);
    TEs = TEs.concat(removeClassesNotInc(cseCoursesList, cseNotIncluded));

    // gets MAE not included
    var teHeader_2 = teHeader.nextAll().eq(10);
    var maeNotIncluded = parseCommas(teHeader_2.text());
    TEs = TEs.concat(removeClassesNotInc(maeCoursesList, maeNotIncluded));

    // gets BILD
    var teHeader_3 = teHeader.nextAll().eq(3);
    var bildIncluded = parseCommas(teHeader_3.text());
    TEs = TEs.concat(bildIncluded);

    return TEs;
}

var getPE = function($, cheerio) {
    var PEs = [];

    return PEs;
}

var databaseCallback = function(callback, request, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList) {

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
        var techElectives = getTE($, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList);
        requirements.concat(new NewReq(techElectives, 4));
        /*
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

function removeClassesNotInc(sourceArr, deleteArr) {
    for(var del = 0; del < deleteArr.length; del++) {
        var delInd = sourceArr.indexOf(deleteArr[del]);
        if (delInd != -1) {
            sourceArr.splice(delInd,1);
        }
    }
    return sourceArr;

}

exports.getMajors = function(callback, request, cheerio, database_accessor) {
    var i = 0;
    var numCourses = 5;
    var cseCoursesList = [];
    var physCoursesList = [];
    var eceCoursesList = [];
    var mathCoursesList = [];
    var maeCoursesList = [];
    database_accessor.getAllClassesInDepartment("CSE", function(courses) {
        for (var course of courses) {
            var courseNumber = course.number.match(/[0-9]*/);
            var courseNumberInt = parseInt(courseNumber[0]);
            if (courseNumberInt >= 100 && courseNumberInt < 200)
                cseCoursesList.push(course.department + " " + course.number);
        }
        i++;
        if (i == numCourses) {
            databaseCallback(callback, request, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList);
        }
    })
    database_accessor.getAllClassesInDepartment("PHYS", function(courses) {
        for (var course of courses) {
            var courseNumber = course.number.match(/[0-9]*/);
            var courseNumberInt = parseInt(courseNumber[0]);
            if (courseNumberInt >= 100 && courseNumberInt < 200)
                physCoursesList.push(course.department + " " + course.number);
        }
        i++;
        if (i == numCourses) {
            databaseCallback(callback, request, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList);
        }
    })
    database_accessor.getAllClassesInDepartment("ECE", function(courses) {
        for (var course of courses) {
            var courseNumber = course.number.match(/[0-9]*/);
            var courseNumberInt = parseInt(courseNumber[0]);
            if (courseNumberInt >= 100 && courseNumberInt < 200)
                eceCoursesList.push(course.department + " " + course.number);
        }
        i++;
        if (i == numCourses) {
            databaseCallback(callback, request, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList);
        }
    })
    database_accessor.getAllClassesInDepartment("MAE", function(courses) {
        for (var course of courses) {
            var courseNumber = course.number.match(/[0-9]*/);
            var courseNumberInt = parseInt(courseNumber[0]);
            if (courseNumberInt >= 100 && courseNumberInt < 200)
                eceCoursesList.push(course.department + " " + course.number);
        }
        i++;
        if (i == numCourses) {
            databaseCallback(callback, request, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList);
        }
    })
    database_accessor.getAllClassesInDepartment("MATH", function(courses) {
        for (var course of courses) {
            var courseNumber = course.number.match(/[0-9]*/);
            var courseNumberInt = parseInt(courseNumber[0]);
            if (courseNumberInt >= 100 && courseNumberInt < 200)
                mathCoursesList.push(course.department + " " + course.number);
        }
        i++;
        if (i == numCourses) {
            databaseCallback(callback, request, cheerio, mathCoursesList, eceCoursesList, physCoursesList, cseCoursesList, maeCoursesList);
        }
    })
};
