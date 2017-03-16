"use strict";

var regMatchDash = /\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatch = /[A-Za-z]{3,5}\s\d{1,3}([[A-Z]{1,2}[-–])*[A-Z]{1,2}/g;
var regMatchClassNum = /\d{1,3}/;
var regMatchClassLetters = /[A-Z]/g;
var regMatchClassName = /[A-Za-z]{2,3}/;
var regParseOr = /[A-Za-z]{2,4}(\s\d{2}A|\s\d{2})/g;
var regParseAll = /(Music|Econ|Math|Chem|(\d{1,3}[A-Z]\-[A-Z]|[A-Z]{2,4}|[0-9]{1,3}[A-Z]+|[0-9]{1,3}))/g;
var tmpStr = "";
var normalMusClass = /[A-Za-z]{5}\s\d{3}[A-Z]?/g;

//create requirement object
function NewReq(courses, courses_needed) {
    this.type = ""
    this.courses = courses;
    if (courses_needed == -1) {
        this.courses_needed = courses.length;
    } else {
        this.courses_needed = courses_needed;
    }
    this.credits_needed = null;
}

//real good stuff
var databaseCallback = function (callback, request, cheerio) {

    var majors = [];
    var url = "http://musicweb.ucsd.edu/ugrad/ugrad-pages.php?i=101";

    var major = ['MUS', '25', 'Music Major', '', {}];

    request(url, function (error, response, html) {
        //console.log('into the request url thing');
        var $ = cheerio.load(html);
        var requirements = [];
        var desc = $('h3:contains("Index")').next().next();
        major[3] = desc.text();

        var allMUS = $('p:contains("Lower Division Requirements")').nextAll('ul');

        //lower division rq
        //basic musicmanship
        var basicMArray = allMUS.eq(0).text().match(regMatch);
        var basicM = parseClasses(basicMArray[0]);
        requirements.push(new NewReq(basicM, -1));

        var perform = allMUS.eq(1).text();
        var performArray = parseCommas(perform);
        performArray[0] = performArray[0].slice(0, 6);
        requirements.push(new NewReq(performArray, 3));

        var depSemi = parseClasses(allMUS.eq(2).text());
        requirements.push(new NewReq(depSemi, -1));

        var mtp = parseClasses(allMUS.eq(3).text().match(regMatch)[0]);
        requirements.push(new NewReq(mtp, -1));

        //electives
        var mthlElectives = allMUS.eq(4).children();
        var mthlList = parseLi(mthlElectives);
        // for (var i = 0; i < mthlElectives.size(); i++) {
        //     mthlElect = parseClasses(mthlElectives[i].textContent.match(normalMusClass)[0]);
        //     mthlList.push(mthlElect[0]);
        // }
        requirements.push(new NewReq(mthlList, 3));

        //history
        var mHis = parseClasses(allMUS.eq(5).text().match(regMatch)[0]);
        requirements.push(new NewReq(mHis, -1));

        //composition
        var mCompo = parseClasses(allMUS.eq(6).text().match(regMatch)[0]);
        requirements.push(new NewReq(mCompo, -1));

        //lit
        var mLitArray = parseCommas(allMUS.eq(7).text());
        var litStart = mLitArray[0].slice(4);
        var depName = mLitArray[0].slice(0,3);
        var litEnd = mLitArray[1].slice(4);
        for (var j = 1; j < parseInt(litEnd)-parseInt(litStart); j++){
            var middleC = depName.concat(' '+(parseInt(litStart)+j));
            mLitArray.push(middleC);
        }
        requirements.push(new NewReq(mLitArray, 3));

        //perform
        var mPerf = allMUS.eq(8).children();
        var mPerfList = parseLi(mPerf);
        requirements.push(new NewReq(mPerfList, -1));

        //tech since it has A-B-C, has to manually parse
        var mTech = allMUS.eq(9).children();
        var mTechList = [];
        for (var i = 0; i < mTech.length; i++) {
            var mthlElect = parseClasses(mTech.eq(i).text());
            mTechList = mTechList.concat(mthlElect);
        }
        requirements.push(new NewReq(mTechList, 3));

        //jazz
        var mJazz = allMUS.eq(10).children();
        var mJazzList = parseLi(mJazz);
        requirements.push(new NewReq(mJazzList, 3));

        /*finally parsed this motherfucker*/
        major[4] = requirements;
        majors.push(major);
        callback(majors);

    });

}

exports.getMajors = function(callback, request, cheerio, database_accessor){
    databaseCallback(callback, request, cheerio);
};

var parseLi = function (electives) {
    var arr = [];
    for (var i = 0; i < electives.length; i++) {
            var mthlElect = parseClasses(electives.eq(i).text().match(normalMusClass)[0]);
            arr.push(mthlElect[0]);
        }
    return arr;
}

var parseCommas = function (classStr) {
    var str = classStr.match(regParseAll);
    var name = str[0].slice(0, 3).toUpperCase();
    var classes = []
    for (var ind = 1; ind < str.length; ind++) {
        if (str[ind].match(/[0-9]/) != null) {
            classes.push(name + " " + str[ind]);
        } else {
            if (classStr != tmpStr) {
                name = str[ind].toUpperCase();
            }
        }
    }
    return classes;
}

var parseClasses = function (classStr) {
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