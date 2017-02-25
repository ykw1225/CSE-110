import { Component } from '@angular/core';

import { CollegeService } from '../services/college.service';
import { UndergradDegreeService } from '../services/undergraddegree.service';
import { DepartmentService, Department } from '../services/department.service';
import { CourseService, Course } from '../services/course.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

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

    private _courseModel: string;
    private _departmentModel: string;

    public get courseModel() {
        return this._courseModel;
    }

    public set courseModel(value) {
        if (this._courseModel !== value) {
            this._courseModel = value;

            // We don't know who is listening, but tell them we did a thing.
            this.pubSubEventService.publish(Events.CourseChangedEvent, value);
        }
    }

    public get departmentModel() {
        return this._departmentModel;
    }

    public set departmentModel(value) {
        if (this._departmentModel !== value) {
            this._departmentModel = value;

            this.courseService.getCoursesAsync(value).then(r => this.courses = r);
        }
    }

    constructor(
        private collegeService: CollegeService,
        private undergradDegreeService: UndergradDegreeService,
        private departmentService: DepartmentService,
        private courseService: CourseService,
        private pubSubEventService: PubSubEventService
    ) {
        collegeService.getCollegesAsync().then(r => this.colleges = r);
        departmentService.getDepartmentsAsync().then(r => this.departments = r);

        undergradDegreeService.getDegreesAsync('Sixth').then(r => this.undergradDegrees = r);
        undergradDegreeService.getMinorsAsync('Sixth').then(r => this.undergradMinors = r);
    }
}
