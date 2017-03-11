import { Component, ElementRef } from '@angular/core';

import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as _ from 'underscore';

@Component({
    selector: 'card-container',
    templateUrl: '/templates/cardContainer.html'
})
export class CardContainerComponent {
    public cards: {
        id: string,
        name: string,
        title: string,
        description: string,
        credits: number
    }[] = [];

    constructor(pubsub: PubSubEventService, private _element: ElementRef) {
        pubsub.subscribe(Events.CourseCardEvent, p => this._addCourseCard(p));
    }

    private _addCourseCard(payload: {
        id: string,
        name: string,
        title: string,
        description: string,
        credits: number
    }) {
        if (!_.find(this.cards, c => c.name === payload.name))
            this.cards.push(payload);
    }

    private _closeCard(card) {
        this.cards.splice(this.cards.indexOf(card), 1);
    }
}
