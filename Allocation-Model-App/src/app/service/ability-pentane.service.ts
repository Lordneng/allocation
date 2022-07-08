import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AbilityPentaneService {
  url = environment.apiUrlNestJS + 'ability-pentane/';
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

  getaAbilityMonthly(year: any, month: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ability-monthly', { params: { year: year, month: month } })
      .pipe(catchError(this.errorMethod));
  }

  getFormList(year: any, month: any, version: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'form', { params: { year: year, month: month, version: version } })
      .pipe(catchError(this.errorMethod));
  }


  getListHistory(year: any, month: any, version: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'history', { params: { year: year, month: month, version: version } })
      .pipe(catchError(this.errorMethod));
  }
  create(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  createVersion(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .put(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  // update(data: any) {
  //   // tslint:disable-next-line: arrow-return-shorthand
  //   return this.http
  //     .put(this.url, data)
  //     .pipe(catchError(this.errorMethod));
  // }

  save(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  saveForm(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url + 'form', data)
      .pipe(catchError(this.errorMethod));
  }

  delete(data: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .delete(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  saveVersion(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .post(this.url + 'version', data)
      .pipe(catchError(this.errorMethod));
  }

  getVersion(year: any, month?: any) {
    return this.http
      .get(this.url + 'version', {
        params: {
          year: year,
          month: month
        }
      })
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

  getVersionById(id: any) {
    return this.http
      .get(this.url + 'versionById/id', {
        params: {
          id: id
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getMonthMaxVersion(year: any, month: any): Promise<any> {
    return this.http
      .get<any>(this.url + 'version/month', {
        params: {
          year: year,
          month: month
        }
      })
      .pipe(catchError(this.errorMethod))
      .toPromise();
  }
  getVersionByYear(year: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'versionByYear', { params: { year: year } })
      .pipe(catchError(this.errorMethod));
  }
}

