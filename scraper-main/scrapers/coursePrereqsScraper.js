

exports.getPrereqs = function(callback, request, cheerio, courseArray) {
    // courseArray = [department, number, title, description, credits, prereqs, coreqs, quarter]
    var prereqs = [];

    courseArray[5] = prereqs;
    callback(courseArray);
};
