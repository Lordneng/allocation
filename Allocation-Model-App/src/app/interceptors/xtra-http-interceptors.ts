import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class XtraHttpInterceptor implements HttpInterceptor {

  constructor(private authenService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authenService.getIsAuthorized()) {
      const jwtToken = this.authenService.getToken();
      if (jwtToken) {
        const nextRequest = req.clone({ setHeaders: { Authorization: `Bearer ${jwtToken}` } });
        return next.handle(nextRequest);
      } else {
        const nextRequest = req.clone({ setHeaders: { 'Content-Type': 'application/json' } });
        return next.handle(nextRequest);
      }
    }
    return next.handle(req);
  }
}
