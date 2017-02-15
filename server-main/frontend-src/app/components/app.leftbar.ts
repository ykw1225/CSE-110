import { Component } from '@angular/core';

import { CollegeService } from '../services/college.service';

@Component({
    selector: 'left-bar',
    templateUrl: '/templates/leftBar.html'
})
export class LeftBarComponent {
    public colleges: string[];

    constructor(collegeService: CollegeService) {
        collegeService.getCollegesAsync().then(r => this.colleges = r);
    }
}