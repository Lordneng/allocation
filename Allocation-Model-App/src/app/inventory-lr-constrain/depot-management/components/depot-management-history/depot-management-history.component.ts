import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import * as _ from 'lodash';
import { DepotManagementMeterService } from 'src/app/service/depot-management.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-depot-management-history',
  templateUrl: './depot-management-history.component.html',
  styleUrls: ['./depot-management-history.component.css']
})
export class DepotManagementHistoryComponent implements OnInit {

  masterData: any = {};
  year: any = '2021';
  month: any = 1;
  version: any = 1;
  dataInfo: any = {};
  maxVersion: any = 0;
  isApplyVersion: any = 0;

  @Output() onEventClick = new EventEmitter();
  constructor(
    private depotManagementMeterService: DepotManagementMeterService) { }

  ngOnInit(): void {
  }

  retrieveMasterData(): Observable<any> {
    const version = this.depotManagementMeterService.getVersion(this.year, this.month);
    return forkJoin([version]);
  }

  retrieveData() {
    console.log(this.masterData.depot)
    let data = _.find(this.masterData.depot, (item) => {
      return item.year === _.toNumber(this.year)
    })

    if (data) {
      this.version = data.version
      this.isApplyVersion = data.version;
    }

    const dataMaxVersion = _.filter(this.masterData.depot, (item) => {
      return item.month === _.toNumber(this.month)
    })
    if (dataMaxVersion.length > 0) {
      this.maxVersion = _.max(_.map(dataMaxVersion, 'version'));
    }

    this.dataInfo = data
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;
    this.dataInfo.isApplyVersion = this.isApplyVersion ? this.isApplyVersion : 0;
  }

  onYearChange(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    this.retrieveMasterData().subscribe(res => {
      this.masterData.depot = res[0];

      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }

  onView($event, data: any) {
    this.version = data.version;
    this.dataInfo = data;
    this.onEventClick.emit(data);
  }

  setDataInfo(dataInfo) {
    this.dataInfo = dataInfo;
  }
}
