var cassandra = require('cassandra-driver');
var async = require('async');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'grad'});

const getCourseInfoQuery = "SELECT * FROM courses WHERE department = ? AND number = ?";
const getAllDepartmentsQuery = "SELECT DISTINCT department FROM courses";
const getAllClassesInDepartment = "SELECT * FROM courses WHERE department = ?";

//global variables for synchronization
var courseMapNames = [], courseMapNodes = [], findingCourses = 0, foundCourses = 0;
/*
introduce errorType.
0 for no errors;
1 for err getting info;
2 for data not fetched;
3 for No results found;
*/
var errorType = 0;
/*
const query = 'INSERT INTO courses (department, number, description, prereqs) VALUES (?,?,?,?)';
const params = ["CSE", "100", "stuffs", [["CSE 30"], ["CSE 21"]]];

client.execute(query, params, function(err) {
//assert.ifError(err);
if(err) console.log(err);
else console.log("inserted");
})*/

//recursively getting all relevant nodes
var getAllPrereqs = function(currCourse, callback) {
    const params = currCourse.split(" ");
    client.execute(getCourseInfoQuery, params, function(err, result) {

        //handle errors
        if(err) {
            errorType = 1;
            var errorNode = {
                Code: 400,
                Message: "Error getting course info\n"
            };
            courseMapNodes.push(errorNode);
            callback();
        }
        else if(!result) {
            errorType = 2;
            var errorNode = {
                Code: 400,
                Message: "Data not fetched\n"
            };
            courseMapNodes.push(errorNode);
            callback();
        }
        else if(!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 404,
                Message: "No results found\n"
            };
            courseMapNodes.push(errorNode);
            callback();
        }
        else {
            var name = result['rows'][0]['department'] + " " + result['rows'][0]['number'];

            //checking if not already found node
            if(courseMapNames.indexOf(name)<0) {
                courseMapNames.push(name);
                var courseNode = {
                        name : name,
                        description : result['rows'][0]['description'],
                        prereqs : result['rows'][0]['prereqs']

                }
                courseMapNodes.push(courseNode);
                if(courseNode.prereqs) {
                    for(var prereq of courseNode.prereqs) {
                        //not dealing with co-reqs yet, so just accesssing index 0
                        if(courseMapNames.indexOf(prereq[0])<0){
                            findingCourses++;
                            getAllPrereqs(prereq[0], callback);
                        }
                    }
                }
            }
            foundCourses++;
            callback();
        }
    });
};

exports.getCourseInfo = function(course, callback) {
    const params = course.split(" ");
    client.execute(getCourseInfoQuery, params, function(err, result) {

        if(err) {
            errorType = 1;
            var errorNode = {
                Code: 403,
                Message: "Error getting course info\n"
            };
            callback(errorNode);
        }
        else if(!result) {
            errorType = 2;
            var errorNode = {
                Code: 404,
                Message: "Data not fetched\n"
            };
            callback(errorNode);
        }
        else if(!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 405,
                Message: "No results found\n"
            };
            callback(errorNode);
        }
        else {
            var courseNode = {
                Code: 200,
                body: {
                    name : result['rows'][0]['department'] + " " + result['rows'][0]['number'],
                    description : result['rows'][0]['description'],
                    prereqs : result['rows'][0]['prereqs']
                }
            }
            callback(courseNode);
        }
    });
};

exports.getCourseMap = function(course, callback) {
    var courseMapCallback = function() {
        if (errorType != 0){
            callback(courseMapNodes);
        } else if(foundCourses==findingCourses) {
            callback(courseMapNodes);
        }
    };

    courseMapNames = [];
    courseMapNodes = [];
    foundCourses = 0
    findingCourses = 1;
    getAllPrereqs(course, courseMapCallback);
};

exports.getAllDepartments = function(callback) {
    client.execute(getAllDepartmentsQuery, function(err, result) {
        if(err) console.log(err);
        console.log(result);
        callback(result['rows']);
    });
};

exports.getAllClassesInDepartment = function(department, callback) {
    console.log("getting " + department + " courses");
    var params = [department];
    client.execute(getAllClassesInDepartment, params, function(err, result) {
        if(err) console.log(err);
        console.log(result);
        callback(result['rows']);
    });
}
