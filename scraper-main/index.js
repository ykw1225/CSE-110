var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var courseLinkScraper = require('./scrapers/courseLinkScraper');

app.listen("3001");
console.log("Scraping Host Started on Port 3001");

app.get('/scrapeAllCourses', function(req, res){
    var courseLinksCallback = function(courseLinks) {
        console.log(courseLinks.length);
        res.send(courseLinks);
    }

    courseLinkScraper.getCourseLinks(courseLinksCallback, request, cheerio);
})
