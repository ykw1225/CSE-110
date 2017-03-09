import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

interface Requirement {
    courses: string[];
    courses_needed?: number;
    credits_needed?: number;
    type: string;
}

export interface UndergradDegree {
    department: string;
    description: string;
    number: string;
    requirements: Requirement[];
    title: string;
}

@Injectable()
export class UndergradDegreeService {
    constructor(private http: Http) {
    }

    public getDegreesAsync(college: string): Promise<string[]> {
        return this.http.get(`/api/undergrad/${college}/degree`)
            .map(response => response.json() as string[])
            .map(data => data.sort())
            .toPromise();
    }

    public getDegreeAsync(college: string, department: string, degreeCode: string): Promise<UndergradDegree> {
        return this.http.get(`/api/undergrad/${college}/degree/${department}/${degreeCode}`)
            .map(response => response.json() as UndergradDegree)
            .toPromise();
    }
}