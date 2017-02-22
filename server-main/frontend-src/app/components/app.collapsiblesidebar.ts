import { Component } from '@angular/core';

@Component({
    selector: 'collapsible-sidebar',
    templateUrl: '/templates/collapsibleSidebar.html'
})
export class CollapsibleSidebarComponent {
    public isHidden: boolean = true;
    public showHideText: string = "Show";

    public toggleVisibility(): void {
        this.showHideText = this.isHidden ? "Hide" : "Show";

        this.isHidden = !this.isHidden;
    }
}