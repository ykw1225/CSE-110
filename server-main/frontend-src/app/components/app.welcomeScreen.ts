import { Component, ElementRef } from '@angular/core';
import { MdDialog } from '@angular/material';

import { CourseDegreeModal } from './app.courseDegreeModal';

import { PubSubEventService, Events } from '../services/pubsubevent.service';

@Component({
    selector: 'welcomeScreen',
    templateUrl: '/templates/welcomeScreen.html'
})
export class WelcomeScreenComponent {
    public showWelcomeScreen: boolean = true;

    constructor(pubsub: PubSubEventService, private _dialog: MdDialog) {
        let delegate = () => this.showWelcomeScreen = false;

        pubsub.subscribe(Events.CourseCardEvent, delegate);
        pubsub.subscribe(Events.DegreeAddedEvent, delegate);
    }

    private _showCourseDegreeModal() {
        this._dialog.open(CourseDegreeModal);
    }
}