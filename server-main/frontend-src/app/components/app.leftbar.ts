import { Component } from '@angular/core';

import { CollegeService } from '../services/college.service';
import { UndergradDegreeService } from '../services/undergraddegree.service';

@Component({
    selector: 'left-bar',
    templateUrl: '/templates/leftBar.html'
})
export class LeftBarComponent {
    public colleges: string[];
    public undergradDegrees: string[];

    constructor(collegeService: CollegeService, undergradDegreeService: UndergradDegreeService ) {
        collegeService.getCollegesAsync().then(r => this.colleges = r);
        undergradDegreeService.getDegreesAsync('Sixth').then(r => this.undergradDegrees = r);
    }
}
