import { Component, ElementRef } from '@angular/core';

import * as UndergradDegreeService from '../services/undergraddegree.service';
import * as DepartmentService from '../services/department.service';
import { CourseService, Course } from '../services/course.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as _ from 'underscore';

@Component({
    selector: 'course-degree-modal',
    templateUrl: '../templates/courseDegreeModal.html'
})
export class CourseDegreeModal {public colleges: string[];
    public undergradDegrees: UndergradDegreeService.UndergradDegree[];
    public courseDepartments: DepartmentService.Department[];
    public degreeDepartments: UndergradDegreeService.Department[];
    public courses: Course[];

    public courseModel: Course;
    private _courseDepartmentModel: DepartmentService.Department;
    private _degreeDepartmentModel: UndergradDegreeService.Department;
    public degreeModel: UndergradDegreeService.UndergradDegree;

    private _courseSelect: JQuery;

    public get courseDepartmentModel() {
        return this._courseDepartmentModel;
    }

    public set courseDepartmentModel(value) {
        if (this._courseDepartmentModel !== value) {
            this._courseDepartmentModel = value;

            this.courseService.getCoursesAsync(value.code)
                .then(r => this.courses = r)
        }
    }

    public get degreeDepartmentModel(): UndergradDegreeService.Department {
        return this._degreeDepartmentModel;
    }

    public set degreeDepartmentModel(value) {
        if (this._degreeDepartmentModel !== value) {
            this._degreeDepartmentModel = value;

            this.undergradDegreeService.getDegreesAsync("Gary", value.department)
                .then(r => this.undergradDegrees = r)
        }
    }

    constructor(
        private _element: ElementRef,
        private undergradDegreeService: UndergradDegreeService.UndergradDegreeService,
        private departmentService: DepartmentService.DepartmentService,
        private courseService: CourseService,
        private pubSubEventService: PubSubEventService) {
        departmentService.getDepartmentsAsync().then(r => this.courseDepartments = r);
        undergradDegreeService.getDepartmentsAsync().then(r => this.degreeDepartments = r);
    }

    private _addCourse(): void {
        this.pubSubEventService.publish(Events.CourseAddedEvent, this.courseModel);
    }

    private async _addDegreeAsync(): Promise<void> {
        this.pubSubEventService.publish(Events.DegreeAddedEvent, await this.undergradDegreeService.getDegreeAsync("Gary", this.degreeDepartmentModel.department, this.degreeModel.number));
    }
}
