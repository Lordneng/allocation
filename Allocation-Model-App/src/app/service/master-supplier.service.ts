import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class MasterSupplierService {
    url = environment.apiUrlNestJS + 'master-supplier/';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }

  getList() {

    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url)
      .pipe(catchError(this.errorMethod));
  }
}

