import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { CollegeService } from '../services/college.service';
import { UndergradDegreeService } from '../services/undergraddegree.service';

import { AppComponent } from '../components/app.component';
import { LeftBarComponent } from '../components/app.leftbar';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        LeftBarComponent
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