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

export interface Department {
    department: string;
}

export interface UndergradDegree {
    number: string;
    title: string;
}

export interface UndergradDegreeInfo {
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

    public getDegreesAsync(college: string, department: string): Promise<UndergradDegree[]> {
        return this.http.get(`/api/undergrad/${college}/degree/${department}`)
            .map(response => response.json() as UndergradDegree[])
            .map(data => data.sort())
            .toPromise();
    }

    public getDegreeAsync(college: string, department: string, degreeCode: string): Promise<UndergradDegreeInfo> {
        return this.http.get(`/api/undergrad/${college}/degree/${department}/${degreeCode}`)
            .map(response => response.json() as UndergradDegreeInfo)
            .toPromise();
    }

    public getDepartmentsAsync(): Promise<Department[]> {
        return this.http.get('/api/undergrad/department')
            .map(response => response.json() as Department[])
            .toPromise();
    }
}