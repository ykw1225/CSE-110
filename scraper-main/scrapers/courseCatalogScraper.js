function Course(department, number, description, prereqs) {
  this.department = department;
  this.number = number;
  this.description = description;
  this.prereqs = prereqs;
}

exports.getCourses = function(callback, request, cheerio, url) {
    var courses = [];
    request(url, function(error, response, html) {
        if(!error) {
            var $ = cheerio.load(html);
            $('.course-name').each(function (index, element) {
                var $element = $(element);
                // The "next" element contains text talking about prereqs.
                var course = parse($element.html(), $element.next().html());
                // A course could be null.
                if (course) courses.push(course);
            });
        }

        if(!courses.length) console.log("no courses in " + url);
        callback(courses);
    });
}

function parse(name, description) {
    var nameRegexResult = name.match(/[A-Za-z]{3,4}\s[1-9][0-9A-Z]*(?=\.)/);
    if(description){
        var descriptionSplit = description.split(/<strong.*strong>/);
        var description = descriptionSplit[0];

        // Transform the prerequisites text into something useful.
        if(descriptionSplit.length<2) var prereqs = null;
        else var prereqs = parsePrereqs(descriptionSplit[1]);
    } else {
        var description = null;
        var prereqs = null;
    }

    // Exit if our data was invalid.
    if (nameRegexResult === null) return false;

    //split into department and numer
    var nameSplit = nameRegexResult[0].split(' ');

    //object return
    //return new Course(nameSplit[0], nameSplit[1], descriptionSplit[0], prereqs);

    //array for database insertion ease
    return [nameSplit[0], nameSplit[1], description, prereqs];
}

function parsePrereqs(preReqString) {
    var prereqsList = preReqString.match(/[A-Za-z]{3,4}\s[1-9][0-9A-Z]*/g);
    var prereqs = [];
    for(var i in prereqsList) {
        prereqs.push([prereqsList[i]]);
    }
    return prereqs;
}
