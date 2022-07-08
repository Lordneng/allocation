import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class MasterCustomerTypeService {
  url = environment.apiUrlNestJS + 'master-customer-type/';
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
}
