"use strict";

exports.getCourseLinks = function(callback, request, cheerio) {
    var courseWebLinks = [];
    var base = "http://ucsd.edu/catalog"

    var url = 'http://ucsd.edu/catalog/front/courses.html';

    request(url, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(html);

            $('#content > p > span.courseFacLink > a:contains("courses")').each(function() {
              var data = $(this);

              var courseStr = data.attr('href');
              var courseLink = base + courseStr.substr(2);

              courseWebLinks.push(courseLink);
            })
        }
        callback(courseWebLinks);
    });
}
