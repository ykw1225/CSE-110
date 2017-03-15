import { Component } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';

import { CourseDegreeModal } from './app.courseDegreeModal';

import { PubSubEventService, Events } from '../services/pubsubevent.service';
import { UndergradDegreeService } from '../services/undergraddegree.service';

@Component({
    selector: 'toolbar',
    templateUrl: '../templates/toolbar.html'
})
export class ToolbarComponent {
    constructor(private _pubsubEventService: PubSubEventService, private _undergradDegreeService: UndergradDegreeService, private _dialog: MdDialog) {
    }

    public _clearGraph(): void {
        this._pubsubEventService.publish(Events.ClearButtonEvent);
    }

    private async _shootSelfInFootAsync(): Promise<void> {
        let payload = await this._undergradDegreeService.getDegreeAsync("Gary", "cse", "26");
        this._pubsubEventService.publish(Events.DegreeAddedEvent, payload);
    }

    private _addButtonClicked(): void {
        let dialogRef = this._dialog.open(CourseDegreeModal);
    }
}