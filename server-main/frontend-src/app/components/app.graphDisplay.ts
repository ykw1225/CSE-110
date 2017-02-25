import { Component } from '@angular/core';

import { Course } from '../services/course.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as cytoscape from 'cytoscape';

@Component({
    selector: 'graphDisplay',
    templateUrl: '/templates/graphDisplay.html'
})
export class graphDisplayComponent {
    private cy: Cy.Instance;

    constructor(pubsubEventService: PubSubEventService) {
        pubsubEventService.subscribe(Events.CourseChangedEvent, p => this._courseChanged(p));
    }

    private _courseChanged(payload: Course): void {
return;

if (typeof this.cy === 'undefined') {
        this.cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [
    { data: { id: 'a' } },
    { data: { id: 'b' } },
    {
      data: {
        id: 'ab',
        source: 'a',
        target: 'b'
      }
    }],
    /*style: [
        {
            selector: 'node',
            style: {
                shape: 'hexagon',
                'background-color': 'red'
            }
        }]      */
});
}
    }
}
