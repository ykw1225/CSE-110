import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/modules/app.module';

import * as $ from 'jquery';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);