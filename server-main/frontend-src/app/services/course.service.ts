import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as _ from 'underscore';

export interface Course {
    department: string;
    description: string;
    number: string;
    coreqs: string[];
    credits: number[];
    prereqs: string[];
    quarter: string;
    title: string;
}

@Injectable()
export class CourseService {
    constructor(private http: Http) {
    }

    public getCoursesAsync(department: string): Promise<Course[]> {
        return this.http.get(`/api/${department}/course`)
            .map(response => response.json() as Course[])
            .map(data => _.sortBy(data, e => parseInt(e.number.match(/[0-9]+/)[0])))
            .toPromise();
    }

    public getCourseAsync(department: string, number: string): Promise<Course> {
        //return this.http.get('/api/')
    }
}