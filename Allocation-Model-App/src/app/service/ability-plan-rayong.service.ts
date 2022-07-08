import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class AbilityPlanRayongService {

  url = environment.apiUrlNestJS + 'ability-plan-rayong/';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }

  getList(year: any, month: any, version: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url, { params: { year: year, month: month, version: version } })
      .pipe(catchError(this.errorMethod));
  }

  getListbyVersionID(versionId: any) {
    return this.http
      .get(this.url + 'getListbyVersionId', {
        params: {
          versionId: versionId
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

  getVersion(year: any, month: any, version: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'version', { params: { year: year, month: month, version: version } })
      .pipe(catchError(this.errorMethod));
  }

  getVersionByID(id: any) {
    return this.http
      .get(this.url + 'version/id', {
        params: {
          id: id
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  saveVersion(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url + 'version', data)
      .pipe(catchError(this.errorMethod));
  }

  getDaily(year: any, month: any, version: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'daily', { params: { year: year, month: month, version: version } })
      .pipe(catchError(this.errorMethod));
  }
  saveDaily(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url + 'daily', data)
      .pipe(catchError(this.errorMethod));
  }

  getAbility(year: any, month: any, version: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ability', { params: { year: year, month: month, version: version } })
      .pipe(catchError(this.errorMethod));
  }
  getVersionByYear(year: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'versionByYear', { params: { year: year } })
      .pipe(catchError(this.errorMethod));
  }

  getMonthVersion(year: any, month: any) {
    return this.http
      .get(this.url + 'version-month', {
        params: {
          year: year,
          month: month
        }
      })
      .pipe(catchError(this.errorMethod));
  }
}

