import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CollegeService {
    constructor(private http: Http) {
    }

    public getCollegesAsync(): Promise<string[]> {
        return this.http.get('api/college')
            .map(response => response.json() as string[])
            .map(data => data.sort())
            .toPromise();
    }

    /*
    getCollegeRequirementsAsync
    */
}