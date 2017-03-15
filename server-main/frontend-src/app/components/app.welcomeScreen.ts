import { Component, ElementRef } from '@angular/core';
import { MdDialog } from '@angular/material';

import { CourseDegreeModal } from './app.courseDegreeModal';

import { PubSubEventService, Events } from '../services/pubsubevent.service';
import { PersistenceService } from '../services/persistence.service';

@Component({
    selector: 'welcomeScreen',
    templateUrl: '/templates/welcomeScreen.html'
})
export class WelcomeScreenComponent {
    public showWelcomeScreen: boolean = true;

    constructor(pubsub: PubSubEventService, private _dialog: MdDialog, private _persistenceService: PersistenceService) {
        let delegate = () => {
            this.showWelcomeScreen = false;
        }

        pubsub.subscribe(Events.CourseAddedEvent, delegate);
        pubsub.subscribe(Events.DegreeAddedEvent, delegate);

        this.showWelcomeScreen = (this._persistenceService.getData("FullCourseMap") || []).length === 0;
    }

    private _showCourseDegreeModal() {
        this._dialog.open(CourseDegreeModal);
    }
}