import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class OptimizationsService {

  url = environment.apiUrlNestJS + 'optimizations/';
  url_allodevapp = environment.apiModel;
  constructor(
    private http: HttpClient, private loaderService: NgxSpinnerService) { }

  errorMethod = (error: any): any => {
    this.loaderService.hide();
    return throwError(error);
  }

  getList(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url, {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getListC3Lpg(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'c3lpg', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getListNgl(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'ngl', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getListCo2(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'co2', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getListPantane(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'pantane', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getListLrMonthly(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'lr-monthly', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getListVolumn(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'volumn', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getRevisionList(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'revision', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getRevisionListC3Lpg(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'revision/c3lpg', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getRevisionListNgl(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'revision/ngl', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getRevisionListCo2(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'revision/co2', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getRevisionListPantane(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'revision/pantane', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  getRevisionListLrMonthly(year: any, month: any, version: any, isWithOutDemandAI: any) {
    return this.http
      .get(this.url + 'revision/lr-monthly', {
        params: {
          year: year,
          month: month,
          version: version,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
      .pipe(catchError(this.errorMethod));
  }

  saveAll(data: any) {
    return this.http
      .post(this.url, data)
      .pipe(catchError(this.errorMethod));
  }

  saveC3Lpg(data: any) {
    return this.http
      .post(this.url + 'c3lpg', data)
      .pipe(catchError(this.errorMethod));
  }

  saveNGL(data: any) {
    return this.http
      .post(this.url + 'ngl', data)
      .pipe(catchError(this.errorMethod));
  }

  getVersion(year: any, isApply?: any, isWithOutDemandAI?: any) {
    return this.http
      .get(this.url + 'version', {
        params: {
          year: year,
          isApply: isApply,
          isWithOutDemandAI: isWithOutDemandAI
        }
      })
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

  getManual(year: any, month: any, version: any) {
    return this.http
      .get(this.url + 'manual', {
        params: {
          year: year,
          month: month,
          version: version
        }
      })
      .pipe(catchError(this.errorMethod));
  }


  sendOptimize(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    //C2C3_Pentane
    return this.http
      .post(this.url_allodevapp + 'optimize', data)
      .pipe(catchError(this.errorMethod));
  }

  sendOptimizeNGLShip(data: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    //C2C3_Pentane
    return this.http
      .post(this.url_allodevapp + 'optimize_ngl_ship', data)
      .pipe(catchError(this.errorMethod));
  }

  // getDataToModel(year: any, month: any, version: any) {
  getDataToModel(optimizationCondition: any) {
    return this.http
      .post(this.url + 'data-to-model', optimizationCondition)
      .pipe(catchError(this.errorMethod));
  }

  download(fileName: any) {
    return this.http
      .get(this.url + 'download-file', {
        params: {
          fileName: fileName
        }
      })
      .pipe(catchError(this.errorMethod));
  }
}
