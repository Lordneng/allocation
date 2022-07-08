import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class RefPricesService {

  url = environment.apiUrlNestJS + 'reference-prices';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }
  getList(year: any, month: any, version: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url, {
        params: {
          year: year,
          month: month,
          version: version
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  save(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  saveVersion(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url + '/version', data)
      .pipe(catchError(this.errorMethod));
  }

  getVersion(year: any, isApply?: any) {
    return this.http
      .get(this.url + '/version', {
        params: {
          year: year,
          isApply: isApply
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getMonthVersion(year: any, month: any) {
    return this.http
      .get(this.url + '/version-month', {
        params: {
          year: year,
          month: month
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getManual(year: any, month: any, version: any) {

    return this.http
      .get(this.url + '/manual', {
        params: {
          year: year,
          month: month,
          version: version
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  saveManual(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url + '/manual', data)
      .pipe(catchError(this.errorMethod));
  }

  /*create(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }*/

  /*createVersion(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .put(this.url, data)
      .pipe(catchError(this.errorMethod));
  }*/
  /*getVersion(year: any) {

    return this.http
      .get(this.url, {
        params: {
          year: year
        }
      })
      .pipe(catchError(this.errorMethod));
  }*/

  update(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .put(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  delete(data: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .delete(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  getActual(year: any, month: any, version: any) {

    return this.http
      .get(this.url + '/actual', {
        params: {
          year: year,
          month: month,
          version: version
        }
      })
      .pipe(catchError(this.errorMethod));
  }
}
