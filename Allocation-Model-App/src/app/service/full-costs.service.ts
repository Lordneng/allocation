import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class FullCostsService {

  url = environment.apiUrlNestJS + 'full-costs/';
  urlNew = environment.apiUrlNestJS;
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }
  // getList(year: any) {

  //   // tslint:disable-next-line: arrow-return-shorthand
  //   return this.http
  //     .get(this.url + year)
  //     .pipe(catchError(this.errorMethod));
  // }

  // getList(year: any, version: any) {
  //   return this.http
  //     .get(this.url + year + '/' + version)
  //     .pipe(catchError(this.errorMethod));
  // }

  getList(month: any, year: any, version: any) {
    return this.http
      .get(this.urlNew + 'cal-margin/full-costs?month=1&year=2022&version=0')
      .pipe(catchError(this.errorMethod));
  }

  getOne(id: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + id)
      .pipe(catchError(this.errorMethod));
  }

  create(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  update(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .put(this.url, data)
      .pipe(catchError(this.errorMethod));
  }


  createVersion(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .put(this.url, data)
      .pipe(catchError(this.errorMethod));
  }
  getVersion(year: any) {

    return this.http
      .get(this.url + year)
      .pipe(catchError(this.errorMethod));
  }
}
