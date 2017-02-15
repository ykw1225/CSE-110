import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { CollegeService } from '../services/college.service';

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
        CollegeService
    ]
})
export class AppModule {    
}