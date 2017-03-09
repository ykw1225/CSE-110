import { Component, ElementRef } from '@angular/core';

import { Course } from '../services/course.service';
import { PubSubEventService, Events } from '../services/pubsubevent.service';

import * as $ from 'jquery';

import * as cytoscape from 'cytoscape';

@Component({
  selector: 'graphDisplay',
  templateUrl: '/templates/graphDisplay.html'
})
export class graphDisplayComponent {
  private cy: Cy.Instance;
  private readonly _emptyGraphJokes: {
    title: string,
    subtitle: string
  }[] = [
    { title: "it feels lonely here :'(", subtitle: "Use the Add class or degree button" }
  ];

  private _graphJokeElement: JQuery;

  constructor(pubsubEventService: PubSubEventService, private _element: ElementRef) {
    pubsubEventService.subscribe(Events.CourseChangedEvent, p => this._courseChanged(p));
    pubsubEventService.subscribe(Events.ClearButtonEvent, p => this._clearGraph());
  }

  private _clearGraph(): void {
    this.cy.remove(this.cy.elements());

    

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
  }

  private _getRandomJoke() {
    let randomNumber = Math.floor((Math.random() * 100) % this._emptyGraphJokes.length);

    return this._emptyGraphJokes[randomNumber];
  }

  public ngOnInit() {
    this.cy = cytoscape({
          container: this._element.nativeElement,
          elements: [
            // nodes
            { data: { id: 'CSE 130' } },
            { data: { id: 'CSE 105' } },
            { data: { id: 'CSE 100' } },
            { data: { id: 'CSE 30' } },
            { data: { id: 'CSE 21' } },
            { data: { id: 'CSE 15L' } },
            { data: { id: 'CSE 12' } },
            { data: { id: 'CSE 20' } },
            { data: { id: 'CSE 11' } },
            // edges
            {
              data: {
                id: 'CSE130CSE105',
                source: 'CSE 130',
                target: 'CSE 105'
              }
            },
            {
              data: {
                id: 'CSE130CSE100',
                source: 'CSE 130',
                target: 'CSE 100'
              }
            },
            {
              data: {
                id: 'CSE130CSE12',
                source: 'CSE 130',
                target: 'CSE 12'
              }
            },
            {
              data: {
                id: 'CSE100CSE30',
                source: 'CSE 100',
                target: 'CSE 30'
              }
            },
            {
              data: {
                id: 'CSE100CSE21',
                source: 'CSE 100',
                target: 'CSE 21'
              }
            },
            {
              data: {
                id: 'CSE100CSE12',
                source: 'CSE 100',
                target: 'CSE 12'
              }
            },
            {
              data: {
                id: 'CSE100CSE15L',
                source: 'CSE 100',
                target: 'CSE 15L'
              }
            },
            {
              data: {
                id: 'CSE105CSE21',
                source: 'CSE 105',
                target: 'CSE 21'
              }
            },
            {
              data: {
                id: 'CSE105CSE12',
                source: 'CSE 105',
                target: 'CSE 12'
              }
            },
            {
              data: {
                id: 'CSE105CSE12',
                source: 'CSE 105',
                target: 'CSE 15L'
              }
            },
            {
              data: {
                id: 'CSE12CSE11',
                source: 'CSE 12',
                target: 'CSE 11'
              }
            },
            {
              data: {
                id: 'CSE15LCSE11',
                source: 'CSE 15L',
                target: 'CSE 11'
              }
            },
            {
              data: {
                id: 'CSE20CSE11',
                source: 'CSE 20',
                target: 'CSE 11'
              }
            },
            {
              data: {
                id: 'CSE21CSE20',
                source: 'CSE 21',
                target: 'CSE 20'
              }
            }
          ],
          style: [
            {
              selector: 'node',
              style: {
                shape: 'circle',
                'background-color': 'red',
                label: 'data(id)'
              }
            }],
          layout: {
            name: 'grid'
          }
        });
  }

  private _courseChanged(payload: Course): void {
  }
}
