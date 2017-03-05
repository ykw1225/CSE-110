"use strict";

var emptyReq = {
    type: "",
    courses: [],
    courses_needed: 0,
    credits_needed: null
};

exports.getMajors = function(callback, request, cheerio) {
    // variable meanings
    var paragraphs = 3;
    var courseCountFirstReq = 9

    var majors = [];
    var url = "http://ucsd.edu/catalog/curric/CSE-ug.html";

    //TODO: FIND OUT CS CODE
    var major = ["CSE", "", "Computer Engineering", "", {}];

    request(url, function(error, response, html) {
        var $ = cheerio.load(html);

        var requirements = [];

        var csheader = $(".program-overview-subhead-2").eq(1);
        //console.log(csheader.text());

        //Grabs Program Header
        var p = csheader.next();

        // Grabs Program description
        var text = p.text();

        // grabs next three paragraphs
        for(var i=0; i < paragraphs; i++) {
            p = p.next();
            text += "\n\n" + p.text();
        }
        //    console.log(text);

        major[3] = text;    //set descritpion

        // skips lower div title & defn & goes to the list of requirements
        var ol = p.next().next().next();

        //lower div requirements
        var olchildren = ol.children();

        //REQ 1
        var req1 = olchildren.first();

        // takes the whole requirements text
        var req1text = req1.text();
        //console.log(req1text);

        // parses the requirements
        var req1s = req1text;
        var currCourse = [];

        // changes emptyReq to a json string object & parses it
        var currReq = JSON.parse(JSON.stringify(emptyReq));
        //9 courses in this req
        for(var i=0;i< courseCountFirstReq;i++){
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


        //lower div req2
        var req2 = req1.next();
        currReq.courses = req2.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        currReq.courses_needed = 1;
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));


        //lower div req 3
        var req3 = req2.next();
        currReq.courses = req3.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        currReq.courses_needed = currReq.courses.length;
        requirements.push(currReq);

        //lower div req 4
        currReq = JSON.parse(JSON.stringify(emptyReq));
        var req4 = req3.next();
        currReq.courses = req4.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        // grabs only first 3 requirements since those are the only ones that matter
        currReq.courses = currReq.courses.slice(0,3)
        currReq.courses_needed = currReq.courses.length;
        requirements.push(currReq);

        // lower div req 5
        currReq = JSON.parse(JSON.stringify(emptyReq));
        var req5 = req4.next();
        currReq.courses = req5.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        console.log(currReq.courses);
        currReq.courses_needed = currReq.courses.length;
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));


        //UPPER DIV

        ol = ol.next().next().next();
        olchildren = ol.children();

        req1 = olchildren.first();
        var req1text = req1.text();
        console.log(req1text)

        var req1s = req1text;
        // since only first 6 w/ course names in front of it
        for(var i = 0; i < 6; i++) {
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
        for(var i = 0; i < 4; i++) {
            var course = req1s.match(/[0-9][0-9A-Z]*/)[0];
            currReq.courses.push("CSE " + course);
            currReq.courses_needed += 1;
            req1s = req1text.substring(req1text.indexOf(course) + course.length);
        }
        requirements.push(currReq);
        currReq = JSON.parse(JSON.stringify(emptyReq));

        var req2 = req1.next();
        currReq.courses = req2.text().match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/g);
        currReq.courses_needed = currReq.courses.length;
        requirements.push(currReq);

        //ELECTIVES

        /*
        console.log("requirements: ");
        for(var req of requirements) {
        console.log(req);
    }
    console.log("done requirements.");*/

    //upper div req2

        major[4] = requirements;
        majors.push(major);
        callback(majors);
    });

};
