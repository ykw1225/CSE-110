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
var core_1 = require("@angular/core");
var course_service_1 = require("../services/course.service");
var pubsubevent_service_1 = require("../services/pubsubevent.service");
var cytoscape = require("cytoscape");
var _ = require("underscore");
var graphDisplayComponent = (function () {
    function graphDisplayComponent(pubsubEventService, courseService) {
        var _this = this;
        this.courseService = courseService;
        pubsubEventService.subscribe(pubsubevent_service_1.Events.CourseChangedEvent, function (p) { return _this._courseChangedAsync(p); });
    }
    graphDisplayComponent.prototype.ngOnInit = function () {
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
    };
    graphDisplayComponent.prototype._courseChangedAsync = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var rootName, courseMap, _a, _b, _c, nodes, _i, nodes_1, node, edges;
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
                        nodes = _.chain(courseMap)
                            .map(function (c) { return ({
                            data: {
                                id: c.name,
                            },
                        }); })
                            .value();
                        for (_i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                            node = nodes_1[_i];
                            node.addClass('multiNode');
                        }
                        edges = _.chain(courseMap)
                            .filter(function (c) { return typeof c.prereqs !== 'undefined'; })
                            .map(function (c) { return (_.chain(c.prereqs)
                            .flatten()
                            .map(function (p) { return ({ course: c.name, prereq: p }); })
                            .value()); })
                            .flatten()
                            .map(function (c) { return ({
                            data: {
                                id: c.course + c.prereq,
                                source: c.course,
                                target: c.prereq
                            }
                        }); })
                            .value();
                        this._cy.remove(this._cy.elements());
                        this._cy.add(nodes.concat(edges));
                        this._cy.layout({
                            name: 'breadthfirst',
                            roots: [rootName]
                        });
                        return [2 /*return*/];
                }
            });
        });
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
