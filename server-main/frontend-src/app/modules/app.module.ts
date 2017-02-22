import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { CollegeService } from '../services/college.service';
import { UndergradDegreeService } from '../services/undergraddegree.service';

import { AppComponent } from '../components/app.component';
import { CollapsibleSidebarComponent } from '../components/app.collapsiblesidebar';
import { LeftBarComponent } from '../components/app.leftbar';
import { RightBarComponent } from '../components/app.rightbar';
import { graphDisplayComponent } from '../components/app.graphDisplay';
import { headerComponent } from '../components/app.header';
import { footerComponent } from '../components/app.footer';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        CollapsibleSidebarComponent,
        LeftBarComponent,
        RightBarComponent,
        graphDisplayComponent,
        headerComponent,
        footerComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        CollegeService,
        UndergradDegreeService
    ]
})
export class AppModule {
}
