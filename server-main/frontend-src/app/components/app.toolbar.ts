import { Component } from '@angular/core';

import { PubSubEventService, Events } from '../services/pubsubevent.service';
import { UndergradDegreeService } from '../services/undergraddegree.service';

import 'materialize-css';

@Component({
    selector: 'toolbar',
    templateUrl: '/templates/toolbar.html'
})
export class ToolbarComponent {
    constructor(private _pubsubEventService: PubSubEventService, private _undergradDegreeService: UndergradDegreeService) {
    }

    public _clearGraph(): void {
        this._pubsubEventService.publish(Events.ClearButtonEvent);
    }

    private async _shootSelfInFootAsync(): Promise<void> {
        let payload = await this._undergradDegreeService.getDegreeAsync("Gary", "cse", "26");
        this._pubsubEventService.publish(Events.DegreeAddedEvent, payload);
    }
}