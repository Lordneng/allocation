import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class SellingPricesManualService {

  url = environment.apiUrlNestJS + 'selling-prices-manual/';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }
  getList(year: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + year)
      .pipe(catchError(this.errorMethod));
  }

  create(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  createVersion(data: any) {
    return this.http
      .post(this.url + 'version', data)
      .pipe(catchError(this.errorMethod));
  }

  getVersion(year: any, isApply?: any) {
    return this.http
      .get(this.url + 'version', {
        params: {
          year: year,
          isApply: isApply
        }
      })
      .pipe(catchError(this.errorMethod));
  }
  
}
