import { Component, ElementRef } from '@angular/core';

import * as $ from 'jquery';
import 'materialize-css';

@Component({
    selector: 'modal',
    templateUrl: '/templates/modal.html'
})
export class ModalComponent {
    constructor (private _modalElement: ElementRef) {
    }

    public ngOnInit() {
        $(document).ready(() => {
            $(this._modalElement.nativeElement).children().modal().modal('open');
        });
    }
}