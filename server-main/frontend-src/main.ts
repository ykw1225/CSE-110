import '/polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/modules/app.module';

setTimeout(function () {
    platformBrowserDynamic().bootstrapModule(AppModule);
}, 1200);