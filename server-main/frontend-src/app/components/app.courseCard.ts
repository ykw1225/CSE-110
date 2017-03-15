import { Component } from '@angular/core';

@Component({
    selector: 'courseCard',
    templateUrl: '../templates/courseCard.html'
})
export class courseCardComponent {
    public isHidden: boolean = true;
    public showHideText: string = "Show";

    public toggleVisibility(): void {
        this.showHideText = this.isHidden ? "Hide" : "Show";

        this.isHidden = !this.isHidden;
    }
}
