import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as _ from 'underscore';

export interface CourseMap {
    name: string;
    prereqs: string[][];
}

export interface ErrorNode {
    Code: number;
    Message: string;
}

export interface Course {
    department: string;
    description: string;
    number: string;
    coreqs: string[];
    credits: number[];
    prereqs: string[];
    quarter: string;
    title: string;
    name: string;
}

@Injectable()
export class CourseService {
    constructor(private http: Http) {
    }

    public getCoursesAsync(department: string): Promise<Course[]> {
        return this.http.get(`/api/${department}/course`)
            .map(response => response.json() as Course[][])
            .map(c => _.chain(c)
                        .flatten()
                        .value())
            .map(data => _.sortBy(data, e => parseInt(e.number.match(/[0-9]+/)[0])))
            .toPromise();
    }

    public getCourseInfoAsync(department: string, number: string): Promise<Course> {
        return this.http.get(`/api/course/info/${department}/${number}`)
            .map(response => response.json() as Course)
            .toPromise();
    }

    public getCourseMapAsync(department: string, number: string): Promise<Array<CourseMap | ErrorNode>> {
        return this.http.get(`/api/course/map/${department}/${number}`)
            .map(response => { return response.json() as CourseMap[] })
            .toPromise();
    }
}

