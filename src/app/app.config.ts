import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../enviorments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
 providers: [

    provideRouter(routes),

    provideFirebaseApp(() =>
      initializeApp(environment.firebase)
    ),

    provideFirestore(() =>
      getFirestore()
    )

  ]};

