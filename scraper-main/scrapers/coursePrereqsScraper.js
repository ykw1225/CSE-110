"use strict";

exports.getPrereqs = function(callback, request, cheerio, courseArray) {
   // courseArray = [department, number, title, description, credits, prereqs, coreqs, quarter]
   var prereqs = [];

   // courseName = department + number; ex: CSE100
   var courseName = courseArray[0] + courseArray[1];

   // not sure what form 'quarter' is in the courseArray, it might go in the
   // variable 'termCode' below
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

                // grabs all of the bolded text inside each row, and replaces the spaces
                // in between with a delimiter '%' to parse. Might fail if there
                // is a class without a space after the name.
                data = $(this).children('span.bold_text').text().replace(/ +/g,'%');

                // filters out rows without class names
                if (data != '') {
                  // saves the parsed data in an array
                  var parsed = data.split('%');

                  // removes the last element in parsed, which is an empty string
                  parsed.pop();

                  // pushes all the 'or' classes into an array
                  orReqs.push(parsed);

                  return orReqs;

                } else {
                  return null;
                }
            }).get();
         }

         courseArray[5] = prereqs;
         callback(courseArray);
   });
};
