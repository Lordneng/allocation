import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import * as _ from 'lodash';
import { OrDemandPlantService } from 'src/app/service/or-demand-plan.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-or-demand-plan-version',
  templateUrl: './or-demand-plan-version.component.html',
  styleUrls: ['./or-demand-plan-version.component.css']
})
export class OrDemandPlanVersionComponent implements OnInit {

  masterData: any = {};
  year: any = 2021;
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};

  apiUrlService = '';

  @Output() onEventClick = new EventEmitter();
  constructor(
    private orDemandPlantService: OrDemandPlantService,
    private loaderService: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlService
  }

  retrieveMasterData(): Observable<any> {
    const dataVersion = this.orDemandPlantService.getVersion(this.year, this.month);
    return forkJoin([dataVersion]);
  }

  retrieveData() {
    const dataMaxVersion = _.filter(this.masterData.version, (item) => {
      return item.month == this.month && item.year == this.year;
    })

    if (dataMaxVersion.length > 0) {
      this.maxVersion = _.max(_.map(dataMaxVersion, 'version'));
      this.version = this.maxVersion;
    }
    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.version, (item) => {
      return item.month == this.month && item.year == this.year && item.version == this.version;
    })
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;
  }

  onYearChange(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    this.retrieveMasterData().subscribe(res => {
      this.masterData.version = res[0];
      console.log('Version', this.masterData.version)
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }

  onView($event, data: any) {
    this.loaderService.show();
    this.dataInfo = data;
    this.onEventClick.emit(data);
  }

  onApplyValueChange($event, data: any) {
    if (data.isApply === true) {
      const observable: any[] = [];
      observable.push(this.orDemandPlantService.saveVersion([data]));

      forkJoin(observable).subscribe(res => {
        this.retrieveMasterData().subscribe(res => {
          this.masterData.costVersion = res[0];
          // this.retrieveData();

        });
      }, error => {

      });
    }

  }

  getDataVersion() {
    return this.masterData.costVersion;
  }
}
