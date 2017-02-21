var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var database_accessor = require('database-accessor');
var app     = express();

var courseLinkScraper = require('./scrapers/courseLinkScraper');
var courseCatalogScraper = require('./scrapers/courseCatalogScraper');
var coursePrereqsScraper = require('./scrapers/coursePrereqsScraper');

app.listen("3001");
console.log("Scraping Host Started on Port 3001");

app.get('/scrapeAllCourses', function(req, res){
    console.log("getting courses");
    var allCourses = [];
    var coursesToFind = 0;
    var coursesFound = 0;
    var totalCourses = 0;

    var databaseCallback = function(message) {
        console.log("inserted " + totalCourses);
    }

    var prereqCallback = function(courseArray) {
        coursesFound++;
        if(courseArray){
            allCourses.push(courseArray);
            //console.log("to find " + coursesToFind + "\tfound " + coursesFound + " " + courseArray[0] + " " + courseArray[1]);
            //console.log("prereqs: " + courseArray[5]);
        } else {
            //console.log("to find " + coursesToFind + "\tfound " + coursesFound + " null");
        }
        if(coursesToFind==coursesFound) {
            database_accessor.insertCourses(allCourses, databaseCallback);
            allCourses = [];
            totalCourses += coursesFound;
            coursesToFind = 0;
            coursesFound = 0;
        }
    }

    var coursesCallback = function(courses) {
        for(var course of courses) {
            coursesToFind++;
            coursePrereqsScraper.getPrereqs(prereqCallback, request, cheerio, course);
        }
    };

    var courseLinksCallback = function(courseLinks) {
        console.log(courseLinks.length + " department links");
        var i = 0;
        var id = 0;
        var intervalCallback = function() {
            if(i == courseLinks.length) {
                console.log("DONE");
                clearInterval(id);
            } else {
                console.log(i + ": " + courseLinks[i]);
                courseCatalogScraper.getCourses(coursesCallback, request, cheerio, courseLinks[i]);
                i++;
            }
        };
        id = setInterval(intervalCallback, 5000);
        //courseCatalogScraper.getCourses(coursesCallback, request, cheerio, "http://ucsd.edu/catalog/courses/MATH.html");
    };

    var start = function() {
        courseLinkScraper.getCourseLinks(courseLinksCallback, request, cheerio);
    }

    database_accessor.removeAllCourses(start);
    res.send("check console\n");
})
