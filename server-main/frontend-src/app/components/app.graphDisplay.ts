import { Component } from '@angular/core';

import { Course, CourseMap, CourseService } from '../services/course.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as cytoscape from 'cytoscape';
import * as _ from 'underscore';

@Component({
  selector: 'graphDisplay',
  templateUrl: '/templates/graphDisplay.html'
})
export class graphDisplayComponent {
  private _cy: Cy.Instance;

  constructor(pubsubEventService: PubSubEventService, private courseService: CourseService) {
    pubsubEventService.subscribe(Events.CourseChangedEvent, p => this._courseChangedAsync(p));
  }

  public ngOnInit() {
    this._cy = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'node',
          style: {
            shape: 'circle',
            'background-color': 'red',
            label: 'data(id)'
          }
        },
        {
          selector: '.multiNode',
          style: {
            'background-color': 'black',
            'border-width': 3,
            'border-color': '#000',
          }
        }
      ],
      layout: {
        name: 'breadthfirst'
      }
    });
  }

  private async _courseChangedAsync(payload: Course): Promise<void> {
    let rootName = payload.department + " " +  payload.number;
    let courseMap: CourseMap[] =
      _.chain(await this.courseService.getCourseMapAsync(payload.department, payload.number))
        .filter((c: Object) => !c.hasOwnProperty('Code'))
        .value() as CourseMap[];

    let nodes = _.chain(courseMap)
      .map(c => ({
        data: {
          id: c.name,
        },
      }))
      .value();

    for(let node of nodes) {
      node.addClass('multiNode');
    }

    let edges = _.chain(courseMap)
      .filter(c => typeof c.prereqs !== 'undefined')
      .map(c => (
        _.chain(c.prereqs)
          .flatten()
          .map(p => ({ course: c.name, prereq: p }))
          .value()
      ))
      .flatten()
      .map(c => ({
        data: {
          id: c.course + c.prereq,
          source: c.course,
          target: c.prereq
        }
      }))
      .value();

    this._cy.remove(this._cy.elements());
    this._cy.add(nodes.concat(edges));
    this._cy.layout({
      name: 'breadthfirst',
      roots: [rootName]
    });
  }
}
