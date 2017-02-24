import { Component } from '@angular/core';

import { CollegeService } from '../services/college.service';
import { UndergradDegreeService } from '../services/undergraddegree.service';
import { DepartmentService, Department } from '../services/department.service';
import { CourseService, Course } from '../services/course.service';

@Component({
    selector: 'left-bar',
    templateUrl: '/templates/leftBar.html'
})
export class LeftBarComponent {
    public colleges: string[];
    public undergradDegrees: string[];
    public undergradMinors: string[];
    public departments: Department[];
    public courses: Course[];

    private _departmentModel: string;

    public get departmentModel() {
        return this._departmentModel;
    }

    public set departmentModel(value) {
        this._departmentModel = value;

        this.courseService.getCoursesAsync(value).then(r => this.courses = r);
    }

    constructor(
        private collegeService: CollegeService,
        private undergradDegreeService: UndergradDegreeService,
        private departmentService: DepartmentService,
        private courseService: CourseService
    ) {
        collegeService.getCollegesAsync().then(r => this.colleges = r);
        departmentService.getDepartmentsAsync().then(r => this.departments = r);

        undergradDegreeService.getDegreesAsync('Sixth').then(r => this.undergradDegrees = r);
        undergradDegreeService.getMinorsAsync('Sixth').then(r => this.undergradMinors = r);
    }
}
