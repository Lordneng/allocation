import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class ExcelsService {

  url = environment.apiUrlService;
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }
  uploadExcelCost(data: FormData) {
    const params = new HttpParams();

    // params.set('Year', year);
    const options = { params: params };
    const requestBody = data;

    const httpRequest = new HttpRequest('POST', (this.url + 'UploadExcelCost'), requestBody, options);
    const $http = this.http.request(httpRequest);
    return $http.pipe(catchError(this.errorMethod));
  }


  uploadExcelReferencePrice(data: any, year: any) {//, year: any
    const params = new HttpParams();

    params.set('Year', year);
    const options = { params: params };
    const requestBody = data;

    const httpRequest = new HttpRequest('POST', (this.url + 'UploadExcelReferencePrice?Year=' + year), requestBody, options); //?Year=' + year
    const $http = this.http.request(httpRequest);
    return $http.pipe(catchError(this.errorMethod));
  }

  uploadExcelAbilityPlanKHM(data: any) {
    const params = new HttpParams();

    const options = { params: params };
    const requestBody = data;

    const httpRequest = new HttpRequest('POST', (this.url + 'ImportAbilityKHM'), requestBody, options);
    const $http = this.http.request(httpRequest);
    return $http.pipe(catchError(this.errorMethod));
  }

  uploadExcelAbilityPlanRayong(data: any) {
    const params = new HttpParams();

    const options = { params: params };
    const requestBody = data;

    const httpRequest = new HttpRequest('POST', (this.url + 'ImportAbilityRayong'), requestBody, options);
    const $http = this.http.request(httpRequest);
    return $http.pipe(catchError(this.errorMethod));
  }

  uploadVolumeConstrainKT(data: any) {
    const params = new HttpParams();

    const options = { params: params };
    const requestBody = data;

    const httpRequest = new HttpRequest('POST', (this.url + 'ImportVolumeConstrainKT'), requestBody, options);
    const $http = this.http.request(httpRequest);
    return $http.pipe(catchError(this.errorMethod));
  }

  uploadVolumeConstrainMeter(data: any) {
    const params = new HttpParams();

    const options = { params: params };
    const requestBody = data;

    const httpRequest = new HttpRequest('POST', (this.url + 'ImportVolumeConstrainMeter'), requestBody, options);
    const $http = this.http.request(httpRequest);
    return $http.pipe(catchError(this.errorMethod));
  }
}
