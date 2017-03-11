import { Component, ElementRef } from '@angular/core';

import { UndergradDegreeService } from '../services/undergraddegree.service';
import { DepartmentService, Department } from '../services/department.service';
import { CourseService, Course } from '../services/course.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as _ from 'underscore';

@Component({
    selector: 'course-degree-modal',
    templateUrl: '/templates/courseDegreeModal.html'
})
export class CourseDegreeModal {public colleges: string[];
    public undergradDegrees: string[];
    public departments: Department[];
    public courses: Course[];

    private _courseModel: Course;
    private _departmentModel: Department;

    private _courseSelect: JQuery;

    public get courseModel() {
        return this._courseModel;
    }

    public set courseModel(value) {
console.log(value);

        if (this._courseModel !== value) {
            this._courseModel = value;
        }
    }

    public get departmentModel() {
        return this._departmentModel;
    }

    public set departmentModel(value) {
        if (this._departmentModel !== value) {
            this._departmentModel = value;

            this.courseService.getCoursesAsync(value.code)
                .then(r => this.courses = r)
        }
    }

    constructor(
        private _element: ElementRef,
        private undergradDegreeService: UndergradDegreeService,
        private departmentService: DepartmentService,
        private courseService: CourseService,
        private pubSubEventService: PubSubEventService) {
        departmentService.getDepartmentsAsync().then(r => this.departments = r);
    }

    private _add(): void {
        this.pubSubEventService.publish(Events.CourseChangedEvent, this.courseModel);
    }
}
