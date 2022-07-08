import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class MasterConditionOfSaleSmartPriceService {
  url = environment.apiUrlNestJS + 'master-condition-of-sale-smart-price';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }

  getListFromDb(year: any) {
    return this.http
      .get(this.url, { params: { year: year } })
      .pipe(catchError(this.errorMethod));
  }

  getYear(month: any, year: any) {
    return this.http
      .get(this.url + `/save-actual?month=${month}&year=${year}`,
        { responseType: 'text' })
      .pipe(catchError(this.errorMethod));
  }
}
