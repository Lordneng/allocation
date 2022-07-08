import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class EthanePlanningReportService {

  url = environment.apiUrlNestJS + 'ethane-planning-report';
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }

  getList(month: any, year: any, optimizationVersionEstimateId: any, optimizationVersionPlanId: any) {
    return this.http
      .get(this.url + '?month=' + month + '&year=' + year  + 
      '&estimateVersionId=' + optimizationVersionEstimateId +
      '&planVersionId=' + optimizationVersionPlanId)
      .pipe(catchError(this.errorMethod));
  }


}
