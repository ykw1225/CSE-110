import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

enum Standing {
    Freshman = 1,
    Sophomore,
    Junior,
    Senior
}

enum Session {
    Fall,
    Winter,
    Spring
}

interface Year {
    standing: Standing;
    quarters: Quarter[];
}

interface Quarter {
    session: Session;
    courseNames: string[];
}

interface FourYearPlan {
    years: Year[];
}

interface UndergradDegree {
    college: string;
    degreeCode: string;
    department: string;
    fourYearPlan: FourYearPlan;
    requiredCourses: string[];
    units: number;
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
            .map(response => JSON.parse(response.json()) as UndergradDegree)
            .toPromise();
    }
}