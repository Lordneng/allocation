import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { XtraHttpInterceptor } from './xtra-http-interceptors';


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: XtraHttpInterceptor, multi: true },
];
