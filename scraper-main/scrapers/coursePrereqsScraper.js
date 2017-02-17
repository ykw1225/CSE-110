exports.getPrereqs = function(callback, request, cheerio, courseArray) {
    // courseArray = [department, number, title, description, credits, prereqs, coreqs, quarter]
    var prereqs = [];
    request("https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesPreReq.htm?termCode=SP17&courseId=CSE100", function(err, response, html) {
        courseArray[5] = prereqs;
        callback(courseArray);
    });
};
