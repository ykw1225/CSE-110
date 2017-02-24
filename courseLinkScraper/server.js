var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  function CoursePage(courseName, courseLink) {
    this.courseName = courseName;
    this.courseLink = courseLink;
  }

  var courseWebLinks = [];
  var base = "ucsd.edu/catalog"
  var courseStr;

  url = 'http://ucsd.edu/catalog/front/courses.html';

  request(url, function(error, response, html) {

    if(!error){

      var $ = cheerio.load(html);

      $('#content > p > span.courseFacLink > a:contains("courses")').each(function() {

        var data = $(this);

        courseName = data.attr('title');
        courseStr = data.attr('href');
        courseLink = base + courseStr.substr(2);

        courseWebLinks.push(new CoursePage(courseName, courseLink));


      })
    }

    fs.writeFile('output.json', JSON.stringify(courseWebLinks, null, 4), function(err){

        console.log('File successfully written! - Check your project directory for the output.json file');

    })

    res.send('Check your console!')

  }) ;


})

app.listen('7878')

console.log('Magic happens on port 7878');

exports = module.exports = app;
