import { Component, ElementRef } from '@angular/core';
import { MdDialog } from '@angular/material';

import { CourseDegreeModal } from './app.courseDegreeModal';
import { MultiNodeModal } from './app.multiNodeModal';

import { Course, CourseMap, CourseService } from '../services/course.service';
import { UndergradDegreeService, UndergradDegreeInfo } from '../services/undergraddegree.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';
import { PersistenceService } from '../services/persistence.service';

import * as $ from 'jquery';

import * as cytoscape from 'cytoscape';
import * as _ from 'underscore';

@Component({
    selector: 'graphDisplay',
    templateUrl: './templates/graphDisplay.html'
})
export class graphDisplayComponent {
    private _cy: Cy.Instance;
    private _fullCourseMapLoaded: boolean;
    private _fullCourseMap: CourseMap[];
    private _rootNamesLoaded: boolean;
    private _rootNames: string[] = [];

    public get fullCourseMap() {
        if (!this._fullCourseMapLoaded) {
            this._fullCourseMap = this._persistenceService.getData("FullCourseMap") || [];

            this._fullCourseMapLoaded = true;
        }

        return this._fullCourseMap;
    }

    public set fullCourseMap(value) {
        this._fullCourseMapLoaded = true;
        this._persistenceService.setData("FullCourseMap", value);

        this._fullCourseMap = value;
    }

    public get rootNames() {
        if (!this._rootNamesLoaded) {
            this._rootNames = this._persistenceService.getData("RootNames") || [];

            this._rootNamesLoaded = true;
        }

        return this._rootNames;
    }

    public set rootNames(value) {
        this._rootNamesLoaded = true;
        this._persistenceService.setData("RootNames", value);

        this._rootNames = value;
    }

    constructor(private _pubsubEventService: PubSubEventService,
        private _courseService: CourseService,
        private _undergradDegreeService: UndergradDegreeService,
        private _persistenceService: PersistenceService,
        private _dialog: MdDialog) {
        this._pubsubEventService.subscribe(Events.CourseAddedEvent, p => this._courseChangedAsync(p));
        this._pubsubEventService.subscribe(Events.MultiNodeSelectedEvent, p => this._updateMultiNode(p));
        this._pubsubEventService.subscribe(Events.DegreeAddedEvent, payload => this._degreeAdded(payload))
        this._pubsubEventService.subscribe(Events.ClearButtonEvent, p => this._clearGraph());
    }

    public ngOnInit() {
        this._cy = cytoscape({
            container: document.getElementById('cy'),
            style: [
                {
                    selector: 'node',
                    style: {
                        'shape': 'circle',
                        'text-valign': 'center',
                        'background-color': '#ff5d6a',
                        'color': 'white',
                        'content': 'data(name)',
                        'padding': 60,
                        'border-color': 'black',
                        'border-width': 3,
                        'font-size': 24,
                        'font-family': "Helvetica Neue",
                        'shadow-blur': 5,
                        'shadow-color': '#a5a5a5',
                        'shadow-offset-x': 9,
                        'shadow-offset-y': 10,
                        'shadow-opacity': 0.55,
                        'text-shadow-blur': 5,
                        'text-shadow-color': '#000',
                        'text-shadow-offset-x': 6,
                        'text-shadow-offset-y': 6,
                        'text-shadow-opacity': 0.55
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'target-arrow-shape': 'triangle',
                        'width': 6,
                        'line-color': 'grey',
                        'curve-style': 'bezier'
                    }
                },
                {
                    selector: '.multiNode',
                    style: {
                        'shape': 'circle',
                        'text-valign': 'center',
                        'background-color': '#ffb437',
                        'color': 'white',
                        'content': 'data(name)',
                        'padding': 60,
                        'border-color': 'black',
                        'border-width': 3,
                        'font-size': 24,
                        'font-family': "Helvetica Neue",
                        'shadow-blur': 5,
                        'shadow-color': '#a5a5a5',
                        'shadow-offset-x': 9,
                        'shadow-offset-y': 10,
                        'shadow-opacity': 0.55,
                        'text-shadow-blur': 5,
                        'text-shadow-color': '#000',
                        'text-shadow-offset-x': 6,
                        'text-shadow-offset-y': 6,
                        'text-shadow-opacity': 0.55
                    }
                },
                {
                    selector: '.degreeNode',
                    style: {
                        'border-color': '#070101',
                        'border-width': 8,
                    }
                },
                {
                    selector: '.req0',
                    style: {
                        'background-color': '#9de093',
                    }
                },
                {
                    selector: '.req1',
                    style: {
                        'background-color': '#6cdae7',
                    }
                },
                {
                    selector: '.req2',
                    style: {
                        'background-color': '#5d96ff',
                    }
                },
                {
                    selector: '.req3',
                    style: {
                        'background-color': '#9a5dff',
                    }
                },
                {
                    selector: '.req4',
                    style: {
                        'background-color': '#ff5df2',
                    }
                },
                {
                    selector: '.req5',
                    style: {
                        'background-color': '#ffb97b',
                    }
                },
                {
                    selector: '.req6',
                    style: {
                        'background-color': '#3333ff',
                    }
                },
            ],
            layout: {
                name: 'breadthfirst',
                fit: true,
                directed: true,
                animate: true,
                animationDuration: 500
            },
            zoom: false
        });

        this._cy.on('tap', event => {
            if (event.cyTarget.hasClass &&
                event.cyTarget.hasClass('multiNode')) {
                this._pubsubEventService.publish(Events.MultiNodeEvent,
                    {
                        id: event.cyTarget.id(),
                        courses: event.cyTarget.data('courses')
                    });

                let dialog = this._dialog.open(MultiNodeModal);
                dialog.componentInstance.availableCourses = event.cyTarget.data('courses');
                dialog.componentInstance.selectedCourse = event.cyTarget.data('name');

                dialog.afterClosed().subscribe(() => {
                    this._updateMultiNode({
                        id: event.cyTarget.id(),
                        name: dialog.componentInstance.selectedCourse
                    });
                });

            }

            if (event.cyTarget.isNode()) {
                this._pubsubEventService.publish(Events.CourseCardEvent,
                    {
                        id: event.cyTarget.id(),
                        name: event.cyTarget.data('name'),
                        title: event.cyTarget.data('title'),
                        description: event.cyTarget.data('description'),
                        credits: event.cyTarget.data('credits')
                    });
            }
        });

        let cyData = this._persistenceService.getData("Cy");
        if (cyData) {
            this._cy.add(cyData);

            this._updateLayout();
        }
    }

    private _clearGraph(): void {
        this._cy.remove(this._cy.elements());

        this.rootNames = [];
        this.fullCourseMap = [];
        this._persistenceService.deleteData("Cy");
    }

    private async _degreeAdded(payload: UndergradDegreeInfo): Promise<void> {
        setTimeout(() => {
            this._updateLayout
        }, 30000);

        let classes =
            _.chain(payload.requirements)
                .map(r => r.courses)
                .flatten()
                .unique()
                .value();

        for (let course of classes) {
            if (!_.find(this.fullCourseMap, c => (c.name == course.toUpperCase()))) {
                try {
                    await this._addCourseMap(course);
                } catch (e) {
                    
                }
            }
        }

        //checking for invalid classes
        for (let req of payload.requirements) {
            if (req.courses_needed != req.courses.length) {
                var toRemove = [];
                for (let j = 0; j < req.courses.length; j++) {
                    if (!_.find(this.fullCourseMap, c => c.name === req.courses[j])) {
                        toRemove.push(j);
                    }
                }
                while (toRemove.length > 0) {
                    let j = toRemove.pop();
                    req.courses.splice(j, 1);
                }
            }
        }

        let i = 0;
        for (let req of payload.requirements) {
            if (req.courses_needed >= req.courses.length) {
                for (var course of req.courses) {
                    var node = this._cy.getElementById(course);
                    if (node.isNode()) {
                        node.addClass("degreeNode");
                    } else {
                        let courseAdding = _.find(this.fullCourseMap, c => c.name === course);
                        if (!courseAdding) continue;

                        let nodes = [];
                        nodes.push({
                            data: {
                                id: course,
                                name: course,
                                title: courseAdding.title,
                                description: courseAdding.description,
                                credits: courseAdding.credits
                            },
                            classes: "degreeNode"
                        });
                        this.rootNames.push(course);
                        this.rootNames = this.rootNames;

                        this._createTree({ id: course, name: course }, nodes);
                    }
                }
            } else {
                var reqId = req.courses.join('');
                var node = this._cy.getElementById(reqId);
                if (node.isNode()) {
                    node.addClass("degreeNode");
                } else {
                    for (let j = 0; j < req.courses_needed; j++) {
                        let courseName = req.courses[j];
                        let courseAdding = _.find(this.fullCourseMap, c => c.name === courseName);
                        if (!courseAdding) continue;

                        let nodes = [];
                        nodes.push({
                            data: {
                                id: reqId + j,
                                name: courseName,
                                title: courseAdding.title,
                                description: courseAdding.description,
                                credits: courseAdding.credits,
                                courses: req.courses
                            },
                            classes: "degreeNode multiNode req" + i
                        });
                        this.rootNames.push(reqId + j);
                        this.rootNames = this.rootNames;
                        this._createTree({ id: reqId + j, name: courseName }, nodes);
                    }
                    i++;
                }

            }
        }

        this._updateLayout();
    }

    private async _addCourseMap(payload: string): Promise<void> {
        try {
            let ssplit = payload.split(' ');
            let courseMap: CourseMap[] =
                _.chain(await this._courseService.getCourseMapAsync(ssplit[0], ssplit[1]))
                    .filter((c: Object) => !c.hasOwnProperty('Code'))
                    .value() as CourseMap[];
            this.fullCourseMap = _.union(this.fullCourseMap, courseMap);
            this.fullCourseMap = _.uniq(this.fullCourseMap, false, c => c.name);
        } catch (e) {
            
        }
    }

    private async _courseChangedAsync(payload: Course): Promise<void> {
        try {
            let rootName = payload.department + " " + payload.number;
            let courseMap: CourseMap[] =
                _.chain(await this._courseService.getCourseMapAsync(payload.department, payload.number))
                    .filter((c: Object) => !c.hasOwnProperty('Code'))
                    .value() as CourseMap[];

            let data = {
                id: rootName,
                name: rootName,
                description: courseMap[0].description,
                credits: courseMap[0].credits,
                title: courseMap[0].title
            };

            this.fullCourseMap = _.union(this.fullCourseMap, courseMap);
            this.fullCourseMap = _.uniq(this.fullCourseMap, false, c => c.name);
            this.rootNames.push(rootName);
            this.rootNames = this.rootNames;

            let nodes = [];
            nodes.push({
                data: data
            });
            this._createTree(data, nodes);

            this._updateLayout();
        } catch (e) {
            
        }
    }

    private _createTree(root, nodes: any[]) {
        let edges = [];

        let nodeQueue = [];
        nodeQueue.push({ id: root.id, name: root.name });

        while (nodeQueue.length > 0) {

            let nodeObj = nodeQueue.shift();
            let node = _.find(this.fullCourseMap, c => c.name === nodeObj.name);

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

                    let preqNode = this._cy.getElementById(preqId);
                    if (preqNode.isNode()) continue;

                    if (preq.length > 1) {
                        let courseAdding = _.find(this.fullCourseMap, c => c.name === preq[0]);
                        //multi node

                        nodes.push({
                            data: {
                                id: preqId,
                                name: preq[0],
                                courses: preq,
                                title: courseAdding.title,
                                description: courseAdding.description,
                                credits: courseAdding.credits
                            },
                            //renderedPosition: { x: Math.random()*500, y: Math.random()*800 },
                            classes: "multiNode",
                        });
                        nodeQueue.push({ id: preqId, name: preq[0] });
                    } else {
                        let courseAdding = _.find(this.fullCourseMap, c => c.name === preqId);
                        //single node
                        nodes.push({
                            data: {
                                id: preqId,
                                name: preqId,
                                title: courseAdding.title,
                                description: courseAdding.description,
                                credits: courseAdding.credits,
                                course: courseAdding
                            },
                            //renderedPosition: { x: Math.random()*500, y: Math.random()*800 },
                            classes: "node",
                        });
                        nodeQueue.push({ id: preqId, name: preq[0] });
                    }
                }
            }
        }

        this._cy.add(nodes.concat(edges));
        this._persistenceService.setData("Cy", this._cy.elements().jsons());
    }

    private _updateLayout() {
        this._cy.layout({
            name: 'breadthfirst',
            roots: this.rootNames,
            directed: true,
            animate: true, // whether to transition the node positions
            animationDuration: 1000, // duration of animation in ms if enabled
            avoidOverlap: true,
            boundingBox: { x1: 0, y1: 0, w: this._cy.$('node').length * 150, h: 2000 },
            spacingFactor: 0.1,
        });
    }

    private _updateMultiNode(payload) {
        var rootNode = this._cy.$('node[id = "' + payload.id + '"]');
        this.removeTree(rootNode);

        let course = _.find(this.fullCourseMap, c => c.name === payload.name);
        rootNode.data("name", course.name);
        rootNode.data("title", course.title);
        rootNode.data("description", course.description);
        rootNode.data("credits", course.credits);

        this._createTree(payload, []);
        this._updateLayout();
    }

    private _updateCourseCard(payload: {
        id: string,
        name: string,
        title: string,
        description: string,
        credits: number
    }) {
        /*
                var courseCard = something something ... blah

                let course = _.find(this._fullCourseMap, c => c.name === payload.name);
                //Basically something like this right?
                courseCard.data("name", course.name);
                courseCard.data("title", course.title);
                courseCard.data("description", course.description);
                courseCard.data("credits", course.credits);
        */
        

        //this._pubsubEventService.publish(Events.CourseCardEvent, payload);
    }

    private removeTree(rootNode) {
        var nodes = rootNode;
        let allNodes = this._cy.$('node');

        var nodesToRemove = [];
        while (!nodes.empty()) {
            let connectedEdgesToRemove = nodes.connectedEdges(function () {
                return !this.target().anySame(nodes);
            });

            let connectedEdgesToFilter = nodes.connectedEdges().difference(nodes.connectedEdges());

            connectedEdgesToRemove.targets().forEach(function (target) {
                let cetf = target.connectedEdges(function () {
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
