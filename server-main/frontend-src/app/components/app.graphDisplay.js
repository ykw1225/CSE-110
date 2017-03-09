"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var course_service_1 = require("../services/course.service");
var pubsubevent_service_1 = require("../services/pubsubevent.service");
var cytoscape = require("cytoscape");
var _ = require("underscore");
var graphDisplayComponent = (function () {
    function graphDisplayComponent(_pubsubEventService, courseService) {
        var _this = this;
        this._pubsubEventService = _pubsubEventService;
        this.courseService = courseService;
        this._fullCourseMap = [];
        this._rootNames = [];
        this._pubsubEventService.subscribe(pubsubevent_service_1.Events.CourseChangedEvent, function (p) { return _this._courseChangedAsync(p); });
        this._pubsubEventService.subscribe(pubsubevent_service_1.Events.MultiNodeSelectedEvent, function (p) { return _this.updateMultiNode(p); });
    }
    graphDisplayComponent.prototype.ngOnInit = function () {
        var _this = this;
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
                {
                    selector: 'edges',
                    style: {
                        target-arrow-shape: 'triangle',
                        width: 4,
                        line-color: '#ddd',
                        curve-style: 'bezier'
                    }
                }
            ],
            layout: {
                name: 'breadthfirst',
                directed: false
            }
        });
        this._cy.on('tap', function (event) {
            if (event.cyTarget.hasClass('multiNode')) {
                _this._pubsubEventService.publish(pubsubevent_service_1.Events.MultiNodeEvent, {
                    id: event.cyTarget.id(),
                    courses: event.cyTarget.data('courses')
                });
                console.log('tap ' + event.cyTarget.id());
                console.log(event.cyTarget.data('courses'));
                console.log(event.cyTarget);
                console.log("updating multi node for testing");
                _this.updateMultiNode({
                    id: event.cyTarget.id(),
                    name: event.cyTarget.data('courses')[1]
                });
            }
        });
    };
    graphDisplayComponent.prototype._courseChangedAsync = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var rootName, courseMap, _a, _b, _c, data, nodes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        rootName = payload.department + " " + payload.number;
                        _b = (_a = _).chain;
                        return [4 /*yield*/, this.courseService.getCourseMapAsync(payload.department, payload.number)];
                    case 1:
                        courseMap = _b.apply(_a, [_d.sent()])
                            .filter(function (c) { return !c.hasOwnProperty('Code'); })
                            .value();
                        this._fullCourseMap = _.union(this._fullCourseMap, courseMap);
                        this._rootNames.push(rootName);
                        data = {
                            id: rootName,
                            name: rootName
                        };
                        nodes = [];
                        nodes.push({
                            data: data
                        });
                        this._createTree(data, nodes);
                        return [2 /*return*/];
                }
            });
        });
    };
    graphDisplayComponent.prototype._createTree = function (root, nodes) {
        var edges = [];
        var nodeQueue = [];
        nodeQueue.push({ id: root.id, name: root.name });
        var _loop_1 = function () {
            var nodeObj = nodeQueue.shift();
            console.log(nodeObj);
            var node = _.find(this_1._fullCourseMap, function (c) { return c.name === nodeObj.name; });
            if (node.prereqs) {
                for (var _i = 0, _a = node.prereqs; _i < _a.length; _i++) {
                    var preq = _a[_i];
                    var preqId = preq.join('');
                    edges.push({
                        data: {
                            id: nodeObj.id + preqId,
                            source: nodeObj.id,
                            target: preqId
                        }
                    });
                    if (preq.length > 1) {
                        nodes.push({
                            data: {
                                id: preqId,
                                name: preq[0],
                                courses: preq
                            },
                            classes: "multiNode",
                        });
                        nodeQueue.push({ id: preqId, name: preq[0] });
                    }
                    else {
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
        };
        var this_1 = this;
        while (nodeQueue.length > 0) {
            _loop_1();
        }
        this._cy.add(nodes.concat(edges));
        this._cy.layout({
            name: 'breadthfirst',
            roots: this._rootNames,
            directed: false
        });
    };
    graphDisplayComponent.prototype.updateMultiNode = function (payload) {
        console.log("updating: ");
        console.log(this._cy.$('node[id = "' + payload.id + '"]'));
        var rootNode = this._cy.$('node[id = "' + payload.id + '"]');
        this.removeTree(rootNode);
        rootNode.data("name", payload.name);
        console.log(rootNode);
        this._createTree(payload, []);
    };
    graphDisplayComponent.prototype.removeTree = function (rootNode) {
        var nodes = rootNode;
        var allNodes = this._cy.$('node');
        var nodesToRemove = [];
        var _loop_2 = function () {
            var connectedEdgesToRemove = nodes.connectedEdges(function () {
                return !this.target().anySame(nodes);
            });
            var connectedEdgesToFilter = nodes.connectedEdges().difference(nodes.connectedEdges());
            connectedEdgesToRemove.targets().forEach(function (target) {
                var cetf = target.connectedEdges(function () {
                    return this.sources().anySame(allNodes.difference(nodes).difference(target));
                });
                connectedEdgesToFilter = connectedEdgesToFilter.union(cetf);
            });
            var connectedNodesToRemove = connectedEdgesToRemove.targets().difference(connectedEdgesToFilter.targets());
            connectedEdgesToRemove.remove();
            Array.prototype.push.apply(nodesToRemove, connectedNodesToRemove);
            nodes = connectedNodesToRemove;
        };
        while (!nodes.empty()) {
            _loop_2();
        }
        nodesToRemove.forEach(function (n) { return n.remove(); });
    };
    return graphDisplayComponent;
}());
graphDisplayComponent = __decorate([
    core_1.Component({
        selector: 'graphDisplay',
        templateUrl: '/templates/graphDisplay.html'
    }),
    __metadata("design:paramtypes", [pubsubevent_service_1.PubSubEventService, course_service_1.CourseService])
], graphDisplayComponent);
exports.graphDisplayComponent = graphDisplayComponent;
