import { Component } from '@angular/core';

import { PubSubEventService, Events } from '../services/pubsubevent.service';

import 'materialize-css';

@Component({
    selector: 'toolbar',
    templateUrl: '/templates/toolbar.html'
})
export class ToolbarComponent {
    constructor(private _pubsubEventService: PubSubEventService) {
    }

    public _clearGraph(): void {
        this._pubsubEventService.publish(Events.ClearButtonEvent);
    }
}