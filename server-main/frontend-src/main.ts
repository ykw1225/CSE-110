import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/modules/app.module';

window.addEventListener("contextmenu", function(e) { e.preventDefault(); })

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);