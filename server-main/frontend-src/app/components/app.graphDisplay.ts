import { Component } from '@angular/core';

import { Course, CourseService } from '../services/course.service';
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
            }],
          layout: {
            name: 'grid'
          }
        });
  }

  private async _courseChangedAsync(payload: Course): Promise<void> {
    console.log(payload);

    let courseMap = await this.courseService.getCourseMapAsync(payload.department, payload.number);

    console.log(courseMap);

    let nodes = _.chain(courseMap)
                  .map(c => ({
                    data: {
                      id: c.name
                    }
                  }))
                  .value();
    
    let edges = _.chain(courseMap)
                  .filter(c => typeof c.prereqs !== 'undefined')
                  .map(c => 
                    _.chain(c.prereqs)
                      .flatten()
                      .map(p => ({ course: c.name, prereq: p}))
                      .value()
                  )
                  .flatten()
                  .map(c => ({
                    data: {
                      id: c.course + c.prereq,
                      source: c.course,
                      target: c.prereq
                    }
                  }))
                  .value();

    console.log(nodes);
    console.log(edges);

    this._cy.add(nodes.concat(edges));
  }
}
