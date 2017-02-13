

exports.getPrereqs = function(callback, request, cheerio, courseArray) {
    var prereqs = [];

    courseArray[5] = prereqs;
    callback(courseArray);
};
