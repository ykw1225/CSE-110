import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as _ from 'underscore';

export interface Department {
    department: string;
    //name: string;
}

@Injectable()
export class DepartmentService {
    constructor(private http: Http) {
    } 

    public getDepartmentsAsync(): Promise<Department[]> {
        return this.http.get('/api/department')
            .map(response => response.json() as Department[])
            .map(data => data.map(e => {
                e.department = e.department.toUpperCase();

                return e;
            }))
            .map(data => _.sortBy(data, e => e.department))
            .toPromise();
    }
}