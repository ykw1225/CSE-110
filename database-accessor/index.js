var cassandra = require('cassandra-driver');
var async = require('async');
var _ = require('underscore');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'grad'});

const NUM_BATCHES = 50;

const getCourseInfoQuery = "SELECT * FROM courses WHERE department = ? AND number = ?";
const getAllDepartmentsQuery = "SELECT * FROM departments";
const getAllClassesInDepartment = "SELECT * FROM courses WHERE department = ?";

const insertCourseQuery = "INSERT INTO courses (department, number, title, description, credits, prereqs, coreqs, quarter) VALUES (?,?,?,?,?,?,?,?)";
const insertDepartmentQuery = "INSERT INTO departments (code, name) VALUES (?,?)";

const removeAllCoursesQuery = "TRUNCATE courses";
//query that deletes row with specific department
const deleteDepartmentFromCoursesQuery = "DELETE FROM courses where department = ?";

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
    console.log("curr course: " + currCourse);
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
        }
        else if(!result) {
            errorType = 2;
            var errorNode = {
                Code: 400,
                Message: "Data not fetched\n"
            };
            courseMapNodes.push(errorNode);
        }
        else if(!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 404,
                Message: "No results found\n"
            };
            courseMapNodes.push(errorNode);
        }
        else {
            var name = result['rows'][0]['department'] + " " + result['rows'][0]['number'];

            //checking if not already found node
            if(courseMapNames.indexOf(name)<0) {
                courseMapNames.push(name);
                var courseNode = {
                        name: name,
                        title: result['rows'][0]['title'],
                        description : result['rows'][0]['description'],
                        credits : result['rows'][0]['credits'],
                        prereqs : result['rows'][0]['prereqs']
                }
                courseMapNodes.push(courseNode);
                if(courseNode.prereqs) {
                    for(var prereqGroup of courseNode.prereqs) {
                        for(var prereq of prereqGroup) {
                            if(courseMapNames.indexOf(prereq)<0){
                                findingCourses++;
                                getAllPrereqs(prereq, callback);
                            }
                        }
                    }
                }
            }
        }
        foundCourses++;
        callback();
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
            var name = result['rows'][0]['department'] + " " + result['rows'][0]['number'];

            var courseNode = {
                Code: 200,
                body: {
                    name: name,
                    title: result['rows'][0]['title'],
                    description : result['rows'][0]['description'],
                    credits : result['rows'][0]['credits'],
                    prereqs : result['rows'][0]['prereqs']
                }
            }
            callback(courseNode);
        }
    });
};

exports.getCourseMap = function(course, callback) {
    var courseMapCallback = function() {
        if(foundCourses === findingCourses) {
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
        callback(result["rows"]);
    });
};

exports.getAllClassesInDepartment = function(department, callback) {
    console.log("getting " + department + " courses");
    var params = [department];
    client.execute(getAllClassesInDepartment, params, function(err, result) {
        if(err) console.log(err);
        //console.log(result);
        callback(result['rows']);
    });
}

exports.insertCourses = function(courses, callback) {
    var insertionCallback = function() {
        num_completed++;
        if(num_completed==batches) callback("inserted");
    }

    //cassandra cannot accept too large of a batch of queries, so splitting the batches

    var batches = Math.ceil(courses.length/NUM_BATCHES);
    var num_completed = 0;

    console.log("inserting " + courses.length + " courses into database");
    const queries = [];
    for(var i = 0; i < batches; i++) {
        queries.push([]);
    }

    var count = 0;
    for(var course of courses) {
        queries[Math.floor(count/NUM_BATCHES)].push({query: insertCourseQuery, params: course});
        count++;
    }

    if(queries.length) {
        for(var batchQuery of queries) {
            client.batch(batchQuery, {prepare:true}, function(err, result) {
                if(err) console.log(err);
                insertionCallback();
            });
        }
    } else {
        callback("nothing to insert");
    }
}

exports.insertDepartments = function(departments, callback) {
    var insertionCallback = function() {
        num_completed++;
        if(num_completed==batches) callback("inserted");
    }

    //cassandra cannot accept too large of a batch of queries, so splitting the batches
    var batches = Math.ceil(departments.length/NUM_BATCHES);
    var num_completed = 0;

    console.log("inserting " + departments.length + " departments into database");
    const queries = [];
    for(var i = 0; i < batches; i++) {
        queries.push([]);
    }

    var count = 0;
    for(var dep of departments) {
        queries[Math.floor(count/NUM_BATCHES)].push({query: insertDepartmentQuery, params: dep});
        count++;
    }

    if(queries.length) {
        for(var batchQuery of queries) {
            client.batch(batchQuery, {prepare:true}, function(err, result) {
                if(err) console.log(err);
                insertionCallback();
            });
        }
    } else {
        callback("nothing to insert");
    }
}

/*insert an array of majors*/
exports.insertMajors = function(majors, callback) {

    callback("can't insert yet");
}

exports.removeAllCourses = function(callback) {
    client.execute(removeAllCoursesQuery, function(err) {
        callback();
    })
}

exports.removeDepartmentCourses = function(department, callback){
    var param = [department];
    client.execute(deleteDepartmentFromCoursesQuery, param, function(err, result) {
        if(err) console.log(err);
        //console.log(result);
        callback();
    });
}
