import { Injectable } from '@angular/core';

// These compile to simple numbers in the JS.
export enum Events {
    CourseChangedEvent
}

@Injectable()
export class PubSubEventService {
    // This class is a psedo-singleton.
    // Angular2 does not easily allow singletons,
    // so instead, the subscribers are static so all instances
    // share the same list of subscribers.

    private static _subscribers: {} = {};

    public subscribe(event: Events, callback: (any) => void): void {
        // Create the array to hold the subscribers if it does not already exist.
        PubSubEventService._subscribers[event] = PubSubEventService._subscribers[event] || [];
        (PubSubEventService._subscribers[event] as Array<(payload: any) => void>).push(callback);
    }

    public unsubscribe(event: Events, callback: (payload: any) => void): void {
        let callbacks: Array<(any) => void> = PubSubEventService._subscribers[event];

        if (typeof callbacks !== 'undefined') {
            // Filter out all of the callbacks which match the specified callback.
            PubSubEventService._subscribers[event] = callbacks.filter(e => e !== callback);
        }
    }

    // Events can be published without a payload.
    public publish(event: Events, payload?: any): void {
        let callbacks: Array<(payload: any) => void> = PubSubEventService._subscribers[event];

        // Ensure that the subscribers array is already defined.
        if (typeof callbacks !== 'undefined') {
            callbacks.forEach(function (callback) {
                if (typeof callback !== 'undefined') {
                    callback(payload);
                }
            })
        }
    }
}