import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes), provideClientHydration(withEventReplay()), 
  provideAnimationsAsync(), 
  provideAnimationsAsync(),
  provideHttpClient(),
  provideAnimations(),  
  provideToastr({
    timeOut: 2000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    progressBar: true,     
    closeButton: true,
    tapToDismiss: false
  }),
]
};
