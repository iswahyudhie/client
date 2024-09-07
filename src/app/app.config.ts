import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './Interceptors/error.interceptor';
import { jwtInterceptor } from './Interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './Interceptors/loading.interceptor';
import { TimeagoModule } from 'ngx-timeago';
import {ModalModule} from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient( withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    importProvidersFrom(NgxSpinnerModule.forRoot({
      type: "line-scale-party"
    }), TimeagoModule.forRoot(), ModalModule.forRoot())
  ]
};
