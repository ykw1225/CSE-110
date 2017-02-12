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

function parse(header, description) {
    //splitting header into name, title and credits

    //console.log("header " + header);
    var headerSplit = header.split('.');
    //console.log("header split " + headerSplit);

    var courseNameSplit = headerSplit[0].match(/[A-Za-z]{2,4}\s[0-9][0-9A-Z]*/);
    //in case null
    if(!courseNameSplit) {
      console.log("course name didn't work " + header);
      return false;
    }
    var courseName = courseNameSplit[0];

    if(!headerSplit[1]){
      console.log("No header . split " + header);
      return false;
    }
    //console.log("header 2" + header);
    headerSplit = headerSplit[1].split(' (');
    //console.log("header split 2" + headerSplit);

    var courseTitle = headerSplit[0];

    if (!headerSplit[1]) var credits = null;
    else var credits = headerSplit[1].match(/\d+/g);

    //IF 2013 IS IN THE CREDITS ARRAY, THEN IT MEANS IT CAN BE BE ANY VALUE BETWEEN THE INDICES

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
    if (!courseName) return false;

    //split into department and numer
    var nameSplit = courseName.split(' ');

    //array for database insertion ease
    return [nameSplit[0], nameSplit[1], courseTitle, description, credits, prereqs];
}

function parsePrereqs(preReqString) {
    var prereqsList = preReqString.match(/[A-Za-z]{3,4}\s[1-9][0-9A-Z]*/g);
    var prereqs = [];
    for(var i in prereqsList) {
        prereqs.push([prereqsList[i]]);
    }
    return prereqs;
}
