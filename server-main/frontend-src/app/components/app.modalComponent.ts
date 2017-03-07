import { Component, ElementRef, Input } from '@angular/core';

import * as $ from 'jquery';
import 'materialize-css';

@Component({
    selector: 'modal',
    templateUrl: '/templates/modal.html'
})
export class ModalComponent {
    @Input("modal-id") public modalID: string;
    @Input() public title: string;

    constructor (private _modalElement: ElementRef) {
    }

    public ngOnInit() {
        $(document).ready(() => {
            // Get the angular element.
            // It will be the parent to the element we want.
            $(this._modalElement.nativeElement)
                .children()
                .modal();
        });
    }
}