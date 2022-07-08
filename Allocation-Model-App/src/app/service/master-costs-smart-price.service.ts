import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class MasterCostsSmartPriceService {

  url = environment.apiUrlNestJS + 'master-product-costs-smart-price';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }

  getListFromDb(year: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url, { params: { year: year } })
      .pipe(catchError(this.errorMethod));
  }

  getYear(year: any) {
    return this.http
      .get(this.url + '/save-actual?year=' + year,
        { responseType: 'text' })
      .pipe(catchError(this.errorMethod));
  }
  getYearForecast(year: any) {
    return this.http
      .get(this.url + '/get-forecast?year=' + year)
      .pipe(catchError(this.errorMethod));
  }
}
