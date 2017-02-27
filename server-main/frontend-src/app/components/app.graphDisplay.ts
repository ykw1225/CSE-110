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

  public ngOnInit() {
    var cy = cytoscape({
          container: document.getElementById('cy'),
          elements: [
            // nodes
            { data: { id: 'a' } },
            { data: { id: 'b' } },
            { data: { id: 'c' } },
            { data: { id: 'd' } },
            { data: { id: 'e' } },
            { data: { id: 'f' } },
            // edges
            {
              data: {
                id: 'ab',
                source: 'a',
                target: 'b'
              }
            },
            {
              data: {
                id: 'cd',
                source: 'c',
                target: 'd'
              }
            },
            {
              data: {
                id: 'ef',
                source: 'e',
                target: 'f'
              }
            },
            {
              data: {
                id: 'ac',
                source: 'a',
                target: 'd'
              }
            },
            {
              data: {
                id: 'be',
                source: 'b',
                target: 'e'
              }
            }
          ],
          style: [
            {
              selector: 'node',
              style: {
                shape: 'circle',
                'background-color': 'red',
                label: 'data(id)'
              }
            }],
          layout: {
            name: 'grid'
          }
        });
  }

  private _courseChanged(payload: Course): void {
  }
}
