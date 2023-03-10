import { ApplicationRef, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { enableDebugTools } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}
let appInit = false;

firebase.initializeApp(environment.firbase);

firebase.auth().onAuthStateChanged(() => {
  if (!appInit) {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .then((module) =>
        enableDebugTools(module.injector.get(ApplicationRef).components[0])
      )
      .catch((err) => console.error(err));
  }

  appInit = true;
});
