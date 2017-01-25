"use strict";

import * as _ from "underscore";
import * as cheerio from "cheerio";
import * as WebRequest from 'web-request';

class Course {
    constructor (public name: string, public prerequisites: string[]) { }

    public toString(): string {
        return `${this.name} Requires [${this.prerequisites}]`;
    }

    public static parse(name: string, description: string) {
        let nameRegexResult = name.match(/[A-Z]{3,4} [1-9][0-9A-Z]*(?=\.)/);
        let descriptionRegexResult = description.match(new RegExp("(<strong class=\"italic\">Prerequisites:</strong>).+"));

        // Exit if our data was invalid.
        if (nameRegexResult === null || descriptionRegexResult == null) return undefined;

        // Transform the prerequisites text into something useful.
        let prereqs = _.map(
            _.without(
                _.map(descriptionRegexResult[0].substring(47).split(','),
                p => p.match(/[A-Z]{3,4} [1-9][0-9A-Z]*/)),
            null),
        p => p[0]);

        let course = new Course(nameRegexResult[0], prereqs);

        return course;
    }
}

export class CourseCatalogScraper {
    public static async scrape (url: string): Promise<Course[]> {
        let result = await WebRequest.get(url);
        let $ = cheerio.load(result.content);
        
        let courses: Course[] = [];
        // All course names have the course name class.
        $('.course-name').each(function (index, element) {
            let $element = $(element);
            // The "next" element contains text talking about prereqs.
            let course = Course.parse($element.html(), $element.next().html());

            // A course could be null.
            if (course) courses.push(course);
        });

        return courses;
    }
}

// Test
(async function () {
    var courses = await CourseCatalogScraper.scrape("http://ucsd.edu/catalog/courses/CSE.html");

    courses.forEach(function (element) {
        console.log(element.toString());
    });
})();