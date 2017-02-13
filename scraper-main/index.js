var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var database_accessor = require('database-accessor');
var app     = express();

var courseLinkScraper = require('./scrapers/courseLinkScraper');
var courseCatalogScraper = require('./scrapers/courseCatalogScraper');

app.listen("3001");
console.log("Scraping Host Started on Port 3001");

app.get('/scrapeAllCourses', function(req, res){
    var courses[];
    var coursesToFind = 0;
    var coursesFound = 0;

    var databaseCallback = function(message) {
        console.log("inserted " + coursesFound);
    }

    var prereqCallback = function(courseArray) {
        courses.push(courseArray);
        coursesFound++;
        if(coursesToFind==coursesFound) {
            database_accessor.insertCourses(courses, databaseCallback);
        }
    }

    var coursesCallback = function(courses) {
        database_accessor.insertCourses(courses, databaseCallback);
        coursesToFind += courses.length;
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
