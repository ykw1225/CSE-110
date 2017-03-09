import { Component } from '@angular/core';

import { Course, CourseMap, CourseService } from '../services/course.service';
import { UndergradDegreeService, UndergradDegree } from '../services/undergraddegree.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as cytoscape from 'cytoscape';
import * as _ from 'underscore';

@Component({
    selector: 'graphDisplay',
    templateUrl: '/templates/graphDisplay.html'
})
export class graphDisplayComponent {
    private _cy: Cy.Instance;
    private _fullCourseMap: CourseMap[] = [];
    private _rootNames: string[] = [];
    /*constructor(pubsubEventService: PubSubEventService, private courseService: CourseService) {
        subscribe(Events.CourseChangedEvent, p => this._courseChangedAsync(p));
    }*/
    constructor(private _pubsubEventService: PubSubEventService,
        private _courseService: CourseService,
        private _undergradDegreeService: UndergradDegreeService) {
        this._pubsubEventService.subscribe(Events.CourseChangedEvent, p => this._courseChangedAsync(p));
        this._pubsubEventService.subscribe(Events.MultiNodeSelectedEvent, p => this._updateMultiNode(p));
        this._pubsubEventService.subscribe(Events.DegreeAddedEvent, payload => this._degreeAdded(payload))
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

        this._cy.on('tap', event =>  {
            if (event.cyTarget.hasClass('multiNode')) {
                this._pubsubEventService.publish(Events.MultiNodeEvent,
                {
                    id: event.cyTarget.id(),
                    courses: event.cyTarget.data('courses')
                });
                console.log('tap ' + event.cyTarget.id());
                console.log(event.cyTarget.data('courses'));
                console.log(event.cyTarget);

                console.log("updating multi node for testing");
                //just for testing
                this._updateMultiNode({
                    id: event.cyTarget.id(),
                    name: event.cyTarget.data('courses')[1]
                });
            }
        });
    }

    private _degreeAdded(payload: UndergradDegree): void {
      console.log(payload);

      alert("Help, I've shot myself in the foot");
    }

    private async _courseChangedAsync(payload: Course): Promise<void> {
        let rootName = payload.department + " " + payload.number;
        let courseMap: CourseMap[] =
            _.chain(await this._courseService.getCourseMapAsync(payload.department, payload.number))
                .filter((c: Object) => !c.hasOwnProperty('Code'))
                .value() as CourseMap[];

        this._fullCourseMap = _.union(this._fullCourseMap, courseMap);
        this._rootNames.push(rootName);

        let data = {
            id: rootName,
            name: rootName
        };
        let nodes = [];
        nodes.push({
            data: data
        });
        this._createTree(data, nodes);
    }

    private _createTree(root, nodes: any[]) {
        let edges = [];

        let nodeQueue = [];
        nodeQueue.push({ id: root.id, name: root.name });

        while (nodeQueue.length > 0) {

            let nodeObj = nodeQueue.shift();
            console.log(nodeObj);
            let node = _.find(this._fullCourseMap, c => c.name === nodeObj.name);

            if (node.prereqs) {
                for (let preq of node.prereqs) {
                    let preqId = preq.join('');
                    edges.push({
                        data: {
                            id: nodeObj.id + preqId,
                            source: nodeObj.id,
                            target: preqId
                        }
                    });

                    if (preq.length > 1) {
                        //multi node
                        nodes.push({
                            data: {
                                id: preqId,
                                name: preq[0],
                                courses: preq
                            },
                            classes: "multiNode",
                        });
                        nodeQueue.push({ id: preqId, name: preq[0] });
                    } else {
                        //single node
                        nodes.push({
                            data: {
                                id: preqId,
                                name: preqId
                            }
                        });
                        nodeQueue.push({ id: preqId, name: preq[0] });
                    }
                }
            }
        }

        this._cy.add(nodes.concat(edges));
        this._cy.layout({
            name: 'breadthfirst',
            roots: this._rootNames
        });
    }

    private _updateMultiNode(payload) {
        console.log("updating: ");
        console.log(this._cy.$('node[id = "' + payload.id + '"]'));

        var rootNode = this._cy.$('node[id = "' + payload.id + '"]');
        this.removeTree(rootNode);
        rootNode.data("name", payload.name);

        console.log(rootNode);
        this._createTree(payload, []);
    }

    private removeTree(rootNode) {
        var nodes = rootNode;
        let allNodes = this._cy.$('node');

        var nodesToRemove = [];
        while(!nodes.empty()){
            let connectedEdgesToRemove = nodes.connectedEdges(function(){
              return !this.target().anySame(nodes);
            });

            let connectedEdgesToFilter = nodes.connectedEdges().difference(nodes.connectedEdges());

            connectedEdgesToRemove.targets().forEach(function(target) {
                let cetf = target.connectedEdges(function() {
                    return this.sources().anySame(allNodes.difference(nodes).difference(target));
                });
                connectedEdgesToFilter = connectedEdgesToFilter.union(cetf);
            });

            let connectedNodesToRemove = connectedEdgesToRemove.targets().difference(connectedEdgesToFilter.targets());
            connectedEdgesToRemove.remove();

            Array.prototype.push.apply(nodesToRemove, connectedNodesToRemove);

            nodes = connectedNodesToRemove;
        }
        nodesToRemove.forEach(n => n.remove());
    }
}
