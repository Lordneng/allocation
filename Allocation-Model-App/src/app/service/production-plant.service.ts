import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ProductionPlantService {
  url = environment.apiUrlNestJS + 'master-production-plants/';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }
  getList(options?: any) {
    if (!options) {
      options = {};
    }
    const requestOption = {
      params: options,
    };
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url, requestOption)
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

  delete(id: any) {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .delete(this.url + id)
      .pipe(catchError(this.errorMethod));
  }
}
