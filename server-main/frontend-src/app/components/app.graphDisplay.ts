import { Component, ElementRef } from '@angular/core';

import { Course, CourseMap, CourseService } from '../services/course.service';
import { UndergradDegreeService, UndergradDegree } from '../services/undergraddegree.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as $ from 'jquery';

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
                        'border-color': 'blue',
                        'border-width': 10,
                    }
                },
                {
                    selector: '.req0',
                    style: {
                        'background-color': '#0099ff',
                    }
                },
                {
                    selector: '.req1',
                    style: {
                        'background-color': '#00ff99',
                    }
                },
                {
                    selector: '.req2',
                    style: {
                        'background-color': '#ff9933',
                    }
                },
                {
                    selector: '.req3',
                    style: {
                        'background-color': '#cc66ff',
                    }
                },
                {
                    selector: '.req4',
                    style: {
                        'background-color': '#996633',
                    }
                },
                {
                    selector: '.req5',
                    style: {
                        'background-color': '#ff6600',
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

    private _clearGraph(): void {
        this._cy.remove(this._cy.elements());
        
        this._rootNames = [];
        this._fullCourseMap = [];


/*
    let graphJokes = this._getRandomJoke();

    if (this._graphJokeElement) {
      this._graphJokeElement.remove();
      this._graphJokeElement = undefined;
    }

    private _clearGraph(): void {
        this._cy.remove(this._cy.elements());


        /*
            let graphJokes = this._getRandomJoke();

            if (this._graphJokeElement) {
              this._graphJokeElement.remove();
              this._graphJokeElement = undefined;
            }

            let title = $('<h3>')
                            .addClass('grey-text')
                            .addClass('text-darken-2')
                            .html(graphJokes.title);

            let subtitle = $('<h5>')
                            .addClass('graph-joke-subtitle')
                            .addClass('grey-text')
                            .addClass('text-lighten-1')
                            .html(graphJokes.subtitle);

            this._graphJokeElement = $('<div>')
                                        .addClass('center-align')
                                        .append(title)
                                        .append(subtitle);

            $(this._element.nativeElement)
              .prepend(this._graphJokeElement);
              */
    }

    /*
      private _getRandomJoke() {
        let randomNumber = Math.floor((Math.random() * 100) % this._emptyGraphJokes.length);

        return this._emptyGraphJokes[randomNumber];
      }
      */

    private async _degreeAdded(payload: UndergradDegree): Promise<void> {
        console.log(payload);
        let classes =
            _.chain(payload.requirements)
                .map(r => r.courses)
                .flatten()
                .unique()
                .value();

        console.log(classes);

        for (let course of classes) {
            //until we can deal with bad courses
            if(course != "Math 15B" && course != "MAE 8" && course != "MAE 9" && course != "CENG 15" && course != "CSE 95" && course != "Math 20F" && course != "Math 176" && course != "Math 188" && course != "Math 166" && course != "Math 176") {
                if(!_.find(this._fullCourseMap, c => (c.name == course.toUpperCase()))) {
                    await this._addCourseMap(course);
                }
            }
        }

        console.log(this._fullCourseMap);

        //checking for invalid classes
        for (let req of payload.requirements) {
            if(req.courses_needed != req.courses.length) {
                var toRemove = [];
                for(let j = 0; j < req.courses.length; j++) {
                    if(!_.find(this._fullCourseMap, c => c.name === req.courses[j])) {
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
            console.log(req);
            if(req.courses_needed >= req.courses.length) {
                for(var course of req.courses) {
                    var node = this._cy.getElementById(course);
                    if(node.isNode()) {
                        node.addClass("degreeNode");
                    } else {
                        let courseAdding = _.find(this._fullCourseMap, c => c.name === course);
                        if(!courseAdding) continue;

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
                        this._rootNames.push(course);

                        this._createTree({id: course, name: course}, nodes);
                    }
                }
            } else {
                console.log("multi req");
                var reqId = req.courses.join('');
                var node = this._cy.getElementById(reqId);
                if(node.isNode()) {
                    node.addClass("degreeNode");
                    console.log("no muli");
                } else {
                    console.log("Multining");
                    console.log(req.courses_needed);
                    for(let j = 0; j < req.courses_needed; j++) {
                        console.log(j);
                        let courseName = req.courses[j];
                        let courseAdding = _.find(this._fullCourseMap, c => c.name === courseName);
                        if(!courseAdding) continue;

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
                        this._rootNames.push(reqId + j);
                        console.log("multi: " + courseName);
                        this._createTree({id: reqId + j, name: courseName}, nodes);
                    }
                    i++;
                }

            }
        }

    }

    private async _addCourseMap(payload: string): Promise<void> {
        let ssplit = payload.split(' ');
        let courseMap: CourseMap[] =
            _.chain(await this._courseService.getCourseMapAsync(ssplit[0], ssplit[1]))
                .filter((c: Object) => !c.hasOwnProperty('Code'))
                .value() as CourseMap[];
        this._fullCourseMap = _.union(this._fullCourseMap, courseMap);
        this._fullCourseMap = _.uniq(this._fullCourseMap, false, c => c.name);
    }

    private async _courseChangedAsync(payload: Course): Promise<void> {
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

        this._fullCourseMap = _.union(this._fullCourseMap, courseMap);
        this._fullCourseMap = _.uniq(this._fullCourseMap, false, c => c.name);
        this._rootNames.push(rootName);

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
                        let courseAdding = _.find(this._fullCourseMap, c => c.name === preq[0]);
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
                            renderedPosition: { x: Math.random()*500, y: Math.random()*800 },
                            classes: "multiNode",
                        });
                        nodeQueue.push({ id: preqId, name: preq[0] });
                    } else {
                        let courseAdding = _.find(this._fullCourseMap, c => c.name === preqId);
                        //single node
                        nodes.push({
                            data: {
                                id: preqId,
                                name: preqId,
                                title: courseAdding.title,
                                description: courseAdding.description,
                                credits: courseAdding.credits
                            },
                            renderedPosition: { x: Math.random()*500, y: Math.random()*800 },
                        });
                        nodeQueue.push({ id: preqId, name: preq[0] });
                    }
                }
            }
        }

        this._cy.add(nodes.concat(edges));

        var leggo = this._cy.layout({
            name: 'breadthfirst',
            roots: this._rootNames,
            directed: true,
            avoidOverlap: true,
            boundingBox: {x1: 0, y1: 0, w: this._cy.$('node').length*150, h: 2000},
            spacingFactor: 0.1,
            maximalAdjustments: 80,
            animate: true, // whether to transition the node positions
            animationDuration: 1000, // duration of animation in ms if enabled
            //animationEasing: false, // easing of animation if enabled
        }).animation({duration: 3000});
        leggo.progress(1).apply();
    }

    private _updateMultiNode(payload) {
        console.log("updating: ");
        console.log(this._cy.$('node[id = "' + payload.id + '"]'));

        var rootNode = this._cy.$('node[id = "' + payload.id + '"]');
        this.removeTree(rootNode);

        let course = _.find(this._fullCourseMap, c => c.name === payload.name);
        rootNode.data("name", course.name);
        rootNode.data("title", course.title);
        rootNode.data("description", course.description);
        rootNode.data("credits", course.credits);

        console.log(rootNode);
        this._createTree(payload, []);
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
