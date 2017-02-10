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
    var i = 0;
    var databaseCallback = function(message) {
        i++;
        console.log("inserted " + i + " " + message);
    }

    var coursesCallback = function(courses) {
        database_accessor.insertCourses(courses, databaseCallback);
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
