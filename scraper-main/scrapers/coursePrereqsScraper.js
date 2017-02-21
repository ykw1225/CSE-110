"use strict";

exports.getPrereqs = function(callback, request, cheerio, courseArray) {
    // courseArray = [department, number, title, description, credits, prereqs, orReqs, quarter]
    var prereqs = [];

    var courseName = courseArray[0] + courseArray[1];
    var termCode = 'SP17';
    var url = 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesPreReq.htm?termCode='
    + termCode
    +'&courseId='
    + courseName;

    request(url, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(html);
            prereqs = $('td').map(function() {
                var orReqs = []
                var data = $(this).children('span.bold_text').text().replace(/ +/g,'%');
                if(data != ''){
                    var parsed = data.split('%');
                    parsed.pop();
                    orReqs.push(parsed);
                    return orReqs;
                } else {
                    return null;
                }
            }).get();
            courseArray[5] = prereqs;
            callback(courseArray);
        } else {
            console.log(courseArray[0] + " " + courseArray[1] + "  null");
            callback(null);
        }
    });
};
