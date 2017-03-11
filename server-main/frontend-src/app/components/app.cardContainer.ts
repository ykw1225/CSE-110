import { Component, ElementRef } from '@angular/core';

import { PubSubEventService, Events } from '../services/pubsubevent.service';

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
        /*
            <md-card class="example-card">
        <md-card-header>
            <div md-card-avatar class="example-header-image"></div>
            <md-card-title>Shiba Inu</md-card-title>
            <md-card-subtitle>Dog Breed</md-card-subtitle>
        </md-card-header>
        <img md-card-image src="assets/img/examples/shiba2.jpg">
        <md-card-content>
            <p>
                The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes
                very well with mountainous terrain, the Shiba Inu was originally bred for hunting.
            </p>
        </md-card-content>
        <md-card-actions>
            <button md-button>LIKE</button>
            <button md-button>SHARE</button>
        </md-card-actions>
    </md-card>*/

        this.cards.push(payload);
    }
}
