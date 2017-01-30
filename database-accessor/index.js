var cassandra = require('cassandra-driver');
var async = require('async');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'grad'});

const getCourseInfoQuery = "SELECT * FROM courses WHERE department = ? AND number = ?";

//global variables for synchronization
var courseMapNames = [], courseMapNodes = [], findingCourses = 0, foundCourses = 0;

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
        //TODO handle no prereqs

        //TODO handle errors
        if(err) console.log("Error getting course info");
        else if(!result) console.log("Data not fetched");
        else if(!result['rows'].length) console.log("result null");
        else {
            var name = result['rows'][0]['department'] + " " + result['rows'][0]['number'];
            //console.log(name);
            //console.log("finding " + findingCourses);
            //console.log("found " + foundCourses);
            //checking if not already found node
            //console.log(courseMapNames.indexOf(name));
            if(courseMapNames.indexOf(name)<0) {
                //console.log("not in array");
                courseMapNames.push(name);
                var courseNode = {
                    name : name,
                    description : result['rows'][0]['description'],
                    prereqs : result['rows'][0]['prereqs']
                }
                courseMapNodes.push(courseNode);
                if(courseNode.prereqs) {
                    for(var prereq of courseNode.prereqs) {
                        //console.log("prereq " + prereq);

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
        if(err) console.log("Error getting course info");
        else if(!result) console.log("Data not fetched");
        else if(!result['rows'].length) console.log("result null");
        else {
            var courseNode = {
                name : result['rows'][0]['department'] + " " + result['rows'][0]['number'],
                description : result['rows'][0]['description'],
                prereqs : result['rows'][0]['prereqs']
            }
            callback(courseNode);
        }
    });
};

exports.getCourseMap = function(course, callback) {
    var courseMapCallback = function() {
        if(foundCourses==findingCourses) {
            callback(courseMapNodes);
        }
    };

    courseMapNames = [];
    courseMapNodes = [];
    foundCourses = 0
    findingCourses = 1;
    getAllPrereqs(course, courseMapCallback);
};
