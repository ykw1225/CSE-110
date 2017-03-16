var regMatchDash  = /\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatch = /[A-Za-z]{3,4}\s\d{1,3}([[A-Z]{1,2}-)*[A-Z]{1,2}/g;
var regMatchClassNum = /\d{1,3}/;
var regMatchClassLetters = /[A-Z]/g;
var regMatchClassName = /[A-Za-z]{2,4}/;
var regParseOr = /[A-Za-z]{3,4}(\s\d{2}A|\s\d{2})/g;
var regParseAll = /(Physics|Math|Chem|(\d{1,3}[A-Z]\-[A-Z]|[A-Z]{2,4}|[0-9]{1,3}[A-Z]+|\b[0-9]{1,3}\b))/g;

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

var databaseCallback = function(callback, request, cheerio, bioUDCourses) {
    var majors = [];
    var url = "https://biology.ucsd.edu/education/undergrad/maj-min/majors/bioinformatics.html";

    var major = ["BIO", "28", "Bioinformatics", "", {}];

    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        var requirements = [];
        var desc = $('h1:contains("Bioinformatics")').next();
        major[3] = desc.text();

        var reqs = $('h2:contains("Lower-Division Requirements")').next();
        //console.log(reqs.text());
        var lowerDivs = parseCommas(reqs.text());
        var cseReqs = lowerDivs.splice(lowerDivs.indexOf('CSE 11'), 1);
        //console.log(lowerDivs);
        requirements.push(new NewReq(lowerDivs, -1));

        reqs = $('h2:contains("Upper-Division Requirements")').next();
        var upperDivs = parseCommas(reqs.text());
        var orUDReq = upperDivs.splice(upperDivs.indexOf('BIBC 100'), 2);
        requirements.push(new NewReq(orUDReq, 1));

        orUDReq = upperDivs.splice(upperDivs.indexOf('BIMM 100'), 2);
        requirements.push(new NewReq(orUDReq, 1));

        var indexBISP195 = upperDivs.indexOf('BISP 195');
        var electiveOpt = upperDivs.splice(indexBISP195, upperDivs.length - indexBISP195);
        electiveOpt.splice(0, 5);

        var electives = bioUDCourses;
        electives = electives.concat(electiveOpt);
        requirements.push(new NewReq(electives, 1));

        requirements.push(new NewReq(upperDivs, -1));

        major[4] = requirements;
        majors.push(major);

        callback(majors);
    });
}

function parseCommas (classStr) {
    var str = classStr.match(regParseAll);
    var name = str[0].toUpperCase();
    var classes = []
    for (var ind = 1; ind < str.length; ind++) {
        if (str[ind].match(/[0-9]/) != null) {
            var strClass = name + " " + str[ind];

            if (strClass == "MATH 20F")
                strClass = "MATH 18";

            if (classes.indexOf(strClass) < 0)
                classes.push(strClass);

        } else {
            name = str[ind].toUpperCase();
            if (name == "PHYSICS")
            name = "PHYS";
        }
    }

    return classes;
}

exports.getMajors = function(callback, request, cheerio, database_accessor) {
    var i = 0;
    var bioCoursesList = [];
    database_accessor.getAllClassesInDepartment("BIOL", function(courses) {
        for (var course of courses) {
            var courseNumber = course.number.match(/[0-9]*/);
            var courseNumberInt = parseInt(courseNumber[0]);
            if (courseNumberInt >= 100 && courseNumberInt < 200)
            bioCoursesList.push(course.department + " " + course.number);
        }

        databaseCallback(callback, request, cheerio, bioCoursesList);
    })
}
