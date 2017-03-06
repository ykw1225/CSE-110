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
    private _fullCourseMap: CourseMap[];
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
                label: 'data(name)'
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

        this._fullCourseMap = courseMap;

        let nodes = [];
        let edges = [];

        let nodeQueue = [];
        nodeQueue.push({id: courseMap[0].name, name: courseMap[0].name});
        nodes.push({
            data: {
                id: courseMap[0].name,
                name: courseMap[0].name
            }
        });

        console.log("no problem");

        while(nodeQueue.length > 0) {
            console.log("q ing");

            let nodeObj = nodeQueue.shift();
            let node = _.find(courseMap, c => c.name == nodeObj.name);

            if(node.prereqs) {
                for(let preq of node.prereqs) {
                    console.log("in preq");
                    let preqId = preq.join('');
                    edges.push({
                        data: {
                            id: nodeObj.id + preqId,
                            source: nodeObj.id,
                            target: preqId
                        }
                    });

                    if(preq.length > 1) {
                        //multi node
                        nodes.push({
                            data: {
                                id: preqId,
                                name: preq[0]
                            },
                            classes: "multiNode",
                            courses: preq
                        });
                        nodeQueue.push({id: preqId, name: preq[0]});
                    } else {
                        //single node
                        nodes.push({
                            data: {
                                id: preqId,
                                name: preqId
                            }
                        });
                        nodeQueue.push({id: preqId, name: preq[0]});
                    }
                }
            }
        }

        this._cy.remove(this._cy.elements());
        this._cy.add(nodes.concat(edges));
        this._cy.layout({
            name: 'breadthfirst',
            roots: [rootName]
        });
    }
}
