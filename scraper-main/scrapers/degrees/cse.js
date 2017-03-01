"use strict";

var emptyReq = {
    type: "",
    courses: [],
    courses_needed: 0,
    credits_needed: null
};

exports.getMajors = function(callback, request, cheerio) {
    var majors = [];
    var url = "http://ucsd.edu/catalog/curric/CSE-ug.html";

    //TODO: FIND OUT CS CODE
    var major = ["CSE", "", "Computer Science", "", {}];

    request(url, function(error, response, html) {
        var $ = cheerio.load(html);

        var requirements = [];

        var csheader = $(".program-overview-subhead-2").first();

        //description
        var p = csheader.next();
        var text = p.text();
        for(var i=0;i<2;i++) {
            p = p.next();
            text += "\n\n" + p.text();
        }
        major[3] = text;    //set descritpion

        var ol = p.next().next().next();

        //lower div requirements
        var olchildren = ol.children();

        //REQ 1
        var req1 = olchildren.first();
        var req1text = req1.text();

        var req1s = req1text;
        var currCourse = [];
        var currReq = JSON.parse(JSON.stringify(emptyReq));
        //9 courses in this req
        for(var i=0;i<9;i++){
            var or = false;
            var course = req1s.match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/)[0];
            if(req1s.indexOf("or")==1) {
                or = true;
                currReq.courses.push(course);
                requirements.push(currReq);
                currReq = JSON.parse(JSON.stringify(emptyReq));
            }
            req1s = req1text.split(course)[1];
            if(!or) {
                if(req1s.indexOf("or")==1) {
                    if(currReq.courses_needed > 0) requirements.push(currReq);
                    currReq = JSON.parse(JSON.stringify(emptyReq));
                    currReq.courses.push(course);
                    currReq.courses_needed = 1;
                } else {
                    currReq.courses.push(course);
                    currReq.courses_needed += 1;
                }
            }
        }
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));


        //REQ 2
        var req2 = req1.next();
        currReq.courses = req2.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        currReq.courses_needed = 1;
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));


        //REQ 3
        var req3 = req2.next();
        currReq.courses = req3.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        currReq.courses_needed = currReq.courses.length;
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));

        //REQ 4
        var req4 = req3.next();
        currReq.courses = req4.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        currReq.courses_needed = 2;
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));

        //REQ 5
        var req5 = req4.next();
        currReq.courses = req5.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        currReq.courses_needed = 1;
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));


        //UPPER DIV

        ol = ol.next().next().next();
        olchildren = ol.children();

        req1 = olchildren.first();
        var req1text = req1.text();

        var req1s = req1text;
        for(var i = 0; i < 8; i++) {
            var or = false;
            var course = req1s.match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/)[0];
            if(req1s.indexOf("or")==1 && i > 0) {   //the word core also has or at index 1
                or = true;
                currReq.courses.push(course);
                requirements.push(currReq);
                currReq = JSON.parse(JSON.stringify(emptyReq));
            }
            req1s = req1text.split(course)[1];
            if(!or) {
                if(req1s.indexOf("or")==1) {
                    if(currReq.courses_needed > 0) requirements.push(currReq);
                    currReq = JSON.parse(JSON.stringify(emptyReq));
                    currReq.courses.push(course);
                    currReq.courses_needed = 1;
                } else {
                    currReq.courses.push(course);
                    currReq.courses_needed += 1;
                }
            }
        }

        //two for loops because the cse department hates me
        //(they don't put department name in front of course number)
        for(var i = 0; i < 6; i++) {
            var course = req1s.match(/[0-9][0-9A-Z]*/)[0];
            currReq.courses.push("CSE " + course);
            currReq.courses_needed += 1;
            req1s = req1text.substring(req1text.indexOf(course) + course.length);
        }
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));

        //ELECTIVES

        /*
        console.log("requirements: ");
        for(var req of requirements) {
            console.log(req);
        }
        console.log("done requirements.");*/
        major[4] = requirements;
        majors.push(major);
        callback(majors);
    });


};
