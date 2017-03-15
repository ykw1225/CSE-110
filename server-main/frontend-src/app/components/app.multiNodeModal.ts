import { Component } from '@angular/core';

@Component({
    selector: 'mutlinode-modal',
    templateUrl: './templates/multiNodeModal.html'
})
export class MultiNodeModal {
    public availableCourses: string[];
    public selectedCourse: string;
}