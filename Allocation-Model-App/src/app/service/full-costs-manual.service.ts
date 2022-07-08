import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class FullCostsManualService {

  url = environment.apiUrlNestJS + 'full-cost-manuals/';
  url_allodevapp = environment.apiModel;
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }
  getList(year: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url, {
        params: {
          year: year,
          month: '9',
        }
      })
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

  sendDataPentane(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    //C2C3_Pentane
    return this.http
      .post(this.url_allodevapp + 'C2C3_Pentane', data)
      .pipe(catchError(this.errorMethod));
  }

}
