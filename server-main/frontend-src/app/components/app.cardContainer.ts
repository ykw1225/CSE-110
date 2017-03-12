import { Component, ElementRef } from '@angular/core';

import { PubSubEventService, Events } from '../services/pubsubevent.service';
import { PersistenceService } from '../services/persistence.service';

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
    }[];

    constructor(pubsub: PubSubEventService, private _element: ElementRef, private _persistenceService: PersistenceService) {
        pubsub.subscribe(Events.CourseCardEvent, p => this._addCourseCard(p));
        pubsub.subscribe(Events.ClearButtonEvent, () => {
            this.cards = []
            this._persistenceService.deleteData("Cards");
        });

        this.cards = this._persistenceService.getData("Cards") || [];
    }

    private _addCourseCard(payload: {
        id: string,
        name: string,
        title: string,
        description: string,
        credits: number
    }) {
        if (!_.find(this.cards, c => c.name === payload.name)) {
            this.cards.unshift(payload);

            this._persistenceService.setData("Cards", this.cards);
        }
    }

    private _closeCard(card) {
        this.cards.splice(this.cards.indexOf(card), 1);
    }
}
