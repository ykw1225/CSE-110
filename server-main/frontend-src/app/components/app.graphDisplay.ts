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
            { data: { id: 'CSE 130' } },
            { data: { id: 'CSE 105' } },
            { data: { id: 'CSE 100' } },
            { data: { id: 'CSE 30' } },
            { data: { id: 'CSE 21' } },
            { data: { id: 'CSE 15L' } },
            { data: { id: 'CSE 12' } },
            { data: { id: 'CSE 20' } },
            { data: { id: 'CSE 11' } },
            // edges
            {
              data: {
                id: 'CSE130CSE105',
                source: 'CSE 130',
                target: 'CSE 105'
              }
            },
            {
              data: {
                id: 'CSE130CSE100',
                source: 'CSE 130',
                target: 'CSE 100'
              }
            },
            {
              data: {
                id: 'CSE130CSE12',
                source: 'CSE 130',
                target: 'CSE 12'
              }
            },
            {
              data: {
                id: 'CSE100CSE30',
                source: 'CSE 100',
                target: 'CSE 30'
              }
            },
            {
              data: {
                id: 'CSE100CSE21',
                source: 'CSE 100',
                target: 'CSE 21'
              }
            },
            {
              data: {
                id: 'CSE100CSE12',
                source: 'CSE 100',
                target: 'CSE 12'
              }
            },
            {
              data: {
                id: 'CSE100CSE15L',
                source: 'CSE 100',
                target: 'CSE 15L'
              }
            },
            {
              data: {
                id: 'CSE105CSE21',
                source: 'CSE 105',
                target: 'CSE 21'
              }
            },
            {
              data: {
                id: 'CSE105CSE12',
                source: 'CSE 105',
                target: 'CSE 12'
              }
            },
            {
              data: {
                id: 'CSE105CSE12',
                source: 'CSE 105',
                target: 'CSE 15L'
              }
            },
            {
              data: {
                id: 'CSE12CSE11',
                source: 'CSE 12',
                target: 'CSE 11'
              }
            },
            {
              data: {
                id: 'CSE15LCSE11',
                source: 'CSE 15L',
                target: 'CSE 11'
              }
            },
            {
              data: {
                id: 'CSE20CSE11',
                source: 'CSE 20',
                target: 'CSE 11'
              }
            },
            {
              data: {
                id: 'CSE21CSE20',
                source: 'CSE 21',
                target: 'CSE 20'
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
