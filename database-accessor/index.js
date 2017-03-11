var cassandra = require('cassandra-driver');
var async = require('async');

var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'grad' });

const NUM_BATCHES = 50;

const getCourseInfoQuery = "SELECT * FROM courses WHERE department = ? AND number = ?";
const getAllDepartmentsQuery = "SELECT code, name FROM departments";
const getAllClassesInDepartment = "SELECT * FROM courses WHERE department = ?";
const getAllCodeListInDepartment = "SELECT code_list FROM departments WHERE code = ?";

const insertCourseQuery = "INSERT INTO courses (department, number, title, description, credits, prereqs, coreqs, quarter) VALUES (?,?,?,?,?,?,?,?)";
const insertDepartmentQuery = "INSERT INTO departments (code, name, code_list) VALUES (?,?,?)";

const insertDegreeQuery = "INSERT INTO degrees (department, number, title, description, requirements) VALUES (?,?,?,?,?)";

const removeAllCoursesQuery = "TRUNCATE courses";
const removeAllDepartmentsQuery = "TRUNCATE departments";
//query that deletes row with specific department
const deleteCoursesFromDepartmentQuery = "DELETE FROM courses where department = ?";
//query that deletes row with specific department
const deleteDegreesFromDepartmentQuery = "DELETE FROM degrees where department = ?";
//query that finds all degrees with department name, in degrees table
const getAllDegreesInDepartment = "SELECT number, title FROM degrees where department = ?";
//query that return specific degree with given number
const getDegreeFromCodeName = "SELECT * FROM degrees where department = ? and number = ?";
//query that return all department names in degrees table
const getDepartmentsFromDegreesQuery = "SELECT DISTINCT department from degrees";

//global variables for synchronization
var courseMapNames = [],
    courseMapNodes = [],
    findingCourses = 0,
    foundCourses = 0,
    errorCourses = [];
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
        if (err) {
            errorType = 1;
            var errorNode = {
                Code: 401,
                name: params,
                Message: "Error getting course info\n"
            };
            errorCourses.push(currCourse);
            courseMapNodes.push(errorNode);
        } else if (!result) {
            errorType = 2;
            var errorNode = {
                Code: 402,
                name: params,
                Message: "Data not fetched\n"
            };
            errorCourses.push(currCourse);
            courseMapNodes.push(errorNode);
        } else if (!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 403,
                name: params,
                Message: "No results found\n"
            };
            errorCourses.push(currCourse);
            courseMapNodes.push(errorNode);
        } else {
            var name = result['rows'][0]['department'] + " " + result['rows'][0]['number'];

            //checking if not already found node
            if (courseMapNames.indexOf(name) < 0) {
                courseMapNames.push(name);
                var courseNode = {
                    name: name,
                    title: result['rows'][0]['title'],
                    description: result['rows'][0]['description'],
                    credits: result['rows'][0]['credits'],
                    prereqs: result['rows'][0]['prereqs']
                }
                courseMapNodes.push(courseNode);
                if (courseNode.prereqs) {
                    for (var prereqGroup of courseNode.prereqs) {
                        for (var prereq of prereqGroup) {
                            if (courseMapNames.indexOf(prereq) < 0) {
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
        if (err) {
            errorType = 1;
            var errorNode = {
                Code: 401,
                name: course,
                Message: "Error getting course info\n"
            };
            callback(errorNode);
        } else if (!result) {
            errorType = 2;
            var errorNode = {
                Code: 402,
                name: course,
                Message: "Data not fetched\n"
            };
            callback(errorNode);
        } else if (!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 403,
                name: course,
                Message: "No results found\n"
            };
            callback(errorNode);
        } else {
            var name = result['rows'][0]['department'] + " " + result['rows'][0]['number'];
            console.log("no error in querying " + name);

            var courseNode = {
                Code: 200,
                body: {
                    name: name,
                    title: result['rows'][0]['title'],
                    description: result['rows'][0]['description'],
                    credits: result['rows'][0]['credits'],
                    prereqs: result['rows'][0]['prereqs']
                }
            }
            callback(courseNode);
        }
    });
};

exports.getCourseMap = function(course, callback) {
    var courseMapCallback = function() {
        if (foundCourses == findingCourses) {
            console.log("error courses: ");
            console.log(errorCourses);
            for (var course of courseMapNodes) {
                for (var i in course.prereqs) {
                    var toRemove = [];
                    for (var j in course.prereqs[i]) {
                        if (errorCourses.indexOf(course.prereqs[i][j]) > -1) {
                            toRemove.push(j);
                        }
                    }
                    if (course.prereqs[i].length == toRemove.length) {
                        course.prereqs.splice(i, 1);
                    } else {
                        while (toRemove.length > 0) {
                            var j = toRemove.pop();
                            course.prereqs[i].splice(j, 1);
                        }
                    }
                }
            }
            callback(courseMapNodes);
        }
    };

    courseMapNames = [];
    courseMapNodes = [];
    foundCourses = 0
    findingCourses = 1;
    errorCourses = [];
    getAllPrereqs(course, courseMapCallback);
};

exports.getAllDepartments = function(callback) {
    client.execute(getAllDepartmentsQuery, function(err, result) {
        if (err) console.log(err);
        callback(result["rows"]);
    });
};

exports.getAllClassesInDepartment = function(department, callback) {
    console.log("getting " + department + " courses");
    var finalResult = [];
    var params = [department];
    client.execute(getAllCodeListInDepartment, params, function(err, result) {
        if (err) {
            errorType = 1;
            var errorNode = {
                Code: 401,
                name: params,
                Message: "Error getting course info\n"
            };
            callback(errorNode);
        } else if (!result) {
            errorType = 2;
            var errorNode = {
                Code: 402,
                name: params,
                Message: "Data not fetched\n"
            };
            callback(errorNode);
        } else if (!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 403,
                name: params,
                Message: "No results found\n"
            };
            callback(errorNode);
        } else {
            var codeList = result["rows"][0]["code_list"];
            //async needed for client execution
            async.each(codeList, function(code, executeCallback) {
                var param = [code];
                client.execute(getAllClassesInDepartment, param, function(err2, result2) {
                    if (err2) {
                        errorType = 1;
                        var errorNode = {
                            Code: 401,
                            name: params,
                            Message: "Error getting course info\n"
                        };
                        callback(errorNode);
                    } else if (!result) {
                        errorType = 2;
                        var errorNode = {
                            Code: 402,
                            name: params,
                            Message: "Data not fetched\n"
                        };
                        callback(errorNode);
                    } else if (!result['rows'].length) {
                        errorType = 3;
                        var errorNode = {
                            Code: 403,
                            name: params,
                            Message: "No results found\n"
                        };
                        callback(errorNode);
                    } else {
                        //console.log(result);
                        finalResult = finalResult.concat(result2['rows']);
                        //console.log("finalresult in client: " + finalResult);
                        executeCallback();
                    }
                });
            }, function(err) {
                callback(finalResult);
            });
        }
    });

}

exports.insertCourses = function(courses, callback) {
    var insertionCallback = function() {
        num_completed++;
        if (num_completed == batches) callback("inserted");
    }

    //cassandra cannot accept too large of a batch of queries, so splitting the batches

    var batches = Math.ceil(courses.length / NUM_BATCHES);
    var num_completed = 0;

    console.log("inserting " + courses.length + " courses into database");
    const queries = [];
    for (var i = 0; i < batches; i++) {
        queries.push([]);
    }

    var count = 0;
    for (var course of courses) {
        queries[Math.floor(count / NUM_BATCHES)].push({ query: insertCourseQuery, params: course });
        count++;
    }

    if (queries.length) {
        for (var batchQuery of queries) {
            client.batch(batchQuery, { prepare: true }, function(err, result) {
                if (err) console.log(err);
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
        if (num_completed == batches) callback("inserted");
    }

    //cassandra cannot accept too large of a batch of queries, so splitting the batches
    var batches = Math.ceil(departments.length / NUM_BATCHES);
    var num_completed = 0;

    console.log("inserting " + departments.length + " departments into database");
    const queries = [];
    for (var i = 0; i < batches; i++) {
        queries.push([]);
    }

    var count = 0;
    for (var dep of departments) {
        queries[Math.floor(count / NUM_BATCHES)].push({ query: insertDepartmentQuery, params: dep });
        count++;
    }

    if (queries.length) {
        for (var batchQuery of queries) {
            client.batch(batchQuery, { prepare: true }, function(err, result) {
                if (err) console.log(err);
                insertionCallback();
            });
        }
    } else {
        callback("nothing to insert");
    }
}

/*insert an array of majors*/
exports.insertMajors = function(majors, callback) {
    var major = [
        "CS",
        "25",
        "CE",
        "desc", [{
            type: "yes",
            courses: ["CSE 20", "CSE 21"],
            courses_needed: 0,
            credits_needed: 4
        }]
    ];

    const queries = [];
    for (var major of majors) {
        queries.push({ query: insertDegreeQuery, params: major });
    }
    client.batch(queries, { prepare: true }, function(err, result) {
        callback("inserted");
    });
    /*
    client.execute(insertDegreeQuery, major, {prepare:true}, function(err) {
        if(err) console.log(err);
        else console.log("worked");
        callback("TRIED");
    })*/
    //callback("can't insert yet");
};

/*
 * get all the degrees in given department
 */
exports.getDegreesInDepartment = function(department, callback) {
    var params = [department];
    client.execute(getAllDegreesInDepartment, params, function(err, result) {
        if (err) {
            errorType = 1;
            var errorNode = {
                Code: 401,
                name: params,
                Message: "Error getting course info\n"
            };
            callback(errorNode);
        } else if (!result) {
            errorType = 2;
            var errorNode = {
                Code: 402,
                name: params,
                Message: "Data not fetched\n"
            };
            callback(errorNode);
        } else if (!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 403,
                name: params,
                Message: "No results found\n"
            };
            callback(errorNode);
        } else {
            var degrees = result["rows"];
            callback(degrees);
        }
    });
}

/*
 * get specific degree object with given degree code
 */
exports.getDegreeFromCode = function(department, code, callback) {
    var params = [department, code];
    client.execute(getDegreeFromCodeName, params, function(err, result) {
        if (err) {
            errorType = 1;
            var errorNode = {
                Code: 401,
                name: params,
                Message: "Error getting course info\n"
            };
            callback(errorNode);
        } else if (!result) {
            errorType = 2;
            var errorNode = {
                Code: 402,
                name: params,
                Message: "Data not fetched\n"
            };
            callback(errorNode);
        } else if (!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 403,
                name: params,
                Message: "No results found\n"
            };
            callback(errorNode);
        } else {
            callback(result["rows"][0]);
        }
    });
}

exports.getDepartmentsFromDegrees = function(callback) {
    client.execute(getDepartmentsFromDegreesQuery, function(err, result) {
        if (err) {
            errorType = 1;
            var errorNode = {
                Code: 401,
                name: params,
                Message: "Error getting course info\n"
            };
            callback(errorNode);
        } else if (!result) {
            errorType = 2;
            var errorNode = {
                Code: 402,
                name: params,
                Message: "Data not fetched\n"
            };
            callback(errorNode);
        } else if (!result['rows'].length) {
            errorType = 3;
            var errorNode = {
                Code: 403,
                name: params,
                Message: "No results found\n"
            };
            callback(errorNode);
        } else {
            callback(result["rows"]);
        }
    })
}

exports.removeAllCourses = function(callback) {
    client.execute(removeAllCoursesQuery, function(err) {
        callback();
    })
}

exports.removeDepartmentCourses = function(department, callback) {
    var param = [department];
    client.execute(deleteCoursesFromDepartmentQuery, param, function(err, result) {
        if (err) console.log(err);
        //console.log(result);
        callback();
    });
}

exports.removeDepartmentDegrees = function(department, callback) {
    var param = [department];
    client.execute(deleteDegreesFromDepartmentQuery, param, function(err, result) {
        if (err) console.log(err);
        callback();
    });
}

exports.removeAllDepartments = function(callback) {
    client.execute(removeAllDepartmentsQuery, function(err) {
        callback();
    })
}
