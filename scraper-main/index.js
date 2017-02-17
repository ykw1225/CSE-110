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

    var databaseCallback = function(message) {
        console.log("inserted " + coursesFound);
    }

    var prereqCallback = function(courseArray) {
        if(courseArray) allCourses.push(courseArray);
        coursesFound++;
        console.log("to find " + coursesToFind + "\tfound" + coursesFound);
        if(coursesToFind==coursesFound) {
            database_accessor.insertCourses(allCourses, databaseCallback);
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
        for(var courseLink of courseLinks){
            console.log(courseLink);
            courseCatalogScraper.getCourses(coursesCallback, request, cheerio, courseLink);
        }
        //courseCatalogScraper.getCourses(coursesCallback, request, cheerio, "http://ucsd.edu/catalog/courses/CSE.html");
    };

    courseLinkScraper.getCourseLinks(courseLinksCallback, request, cheerio);
    res.send("check console");
})
