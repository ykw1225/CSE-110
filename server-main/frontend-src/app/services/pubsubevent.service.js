"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Events;
(function (Events) {
    Events[Events["CourseChangedEvent"] = 0] = "CourseChangedEvent";
    Events[Events["MultiNodeEvent"] = 1] = "MultiNodeEvent";
    Events[Events["MultiNodeSelectedEvent"] = 2] = "MultiNodeSelectedEvent";
})(Events = exports.Events || (exports.Events = {}));
var PubSubEventService = PubSubEventService_1 = (function () {
    function PubSubEventService() {
    }
    PubSubEventService.prototype.subscribe = function (event, callback) {
        PubSubEventService_1._subscribers[event] = PubSubEventService_1._subscribers[event] || [];
        PubSubEventService_1._subscribers[event].push(callback);
    };
    PubSubEventService.prototype.unsubscribe = function (event, callback) {
        var callbacks = PubSubEventService_1._subscribers[event];
        if (typeof callbacks !== 'undefined') {
            PubSubEventService_1._subscribers[event] = callbacks.filter(function (e) { return e !== callback; });
        }
    };
    PubSubEventService.prototype.publish = function (event, payload) {
        var callbacks = PubSubEventService_1._subscribers[event];
        if (typeof callbacks !== 'undefined') {
            callbacks.forEach(function (callback) {
                if (typeof callback !== 'undefined') {
                    callback(payload);
                }
            });
        }
    };
    return PubSubEventService;
}());
PubSubEventService._subscribers = {};
PubSubEventService = PubSubEventService_1 = __decorate([
    core_1.Injectable()
], PubSubEventService);
exports.PubSubEventService = PubSubEventService;
var PubSubEventService_1;
