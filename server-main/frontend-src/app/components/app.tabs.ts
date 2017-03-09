import { Component, ElementRef } from '@angular/core';

import * as $ from 'jquery';
import 'materialize-css';

@Component({
    selector: 'tabs',
    templateUrl: '/templates/tabs.html'
})
export class TabsComponent {
    constructor(private _element: ElementRef) {
    }

    public ngOnInit() {
        $(document).ready(() => {
            $(this._element.nativeElement).tabs();
        });
    }
}
