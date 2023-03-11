/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// console.log("rendered bootstrap")
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// console.log("rendered bootstrap")
