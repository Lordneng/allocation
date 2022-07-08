import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class CalMarginService {

  url = environment.apiUrlNestJS + 'cal-margin/';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }

  getList(month: any, year: any, version: any, costProductTypeId: any, costVersionId: any, referencePriceVersionId: any) {
    return this.http
      .get(this.url + '?month=' + month + '&year=' + year + '&version=' + version + '&costProductTypeId=' + costProductTypeId + '&costVersionId=' + costVersionId + '&referencePriceVersionId=' + referencePriceVersionId)
      .pipe(catchError(this.errorMethod));
  }

  save(data: any) {
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  getFollCostManual(month: any, year: any, version: any) {
    return this.http
      .get(this.url + 'full-cost/manual?year=' + year + '&month=' + month + '&version=' + version)
      .pipe(catchError(this.errorMethod));
  }

  getSellingPriceManual(month: any, year: any, version: any) {
    return this.http
      .get(this.url + 'selling-price/manual?year=' + year + '&month=' + month + '&version=' + version)
      .pipe(catchError(this.errorMethod));
  }

  getVersion(month: any, year: any) {
    return this.http
      .get(this.url + 'version?year=' + year + '&month=' + month)
      .pipe(catchError(this.errorMethod));
  }
  getVersionByYear(year: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'versionByYear', { params: { year: year } })
      .pipe(catchError(this.errorMethod));
  }

  getVersionById(id: any) {
    return this.http
      .get(this.url + 'version/id', {
        params: {
          id: id
        }
      })
      .pipe(catchError(this.errorMethod));
  }

}
