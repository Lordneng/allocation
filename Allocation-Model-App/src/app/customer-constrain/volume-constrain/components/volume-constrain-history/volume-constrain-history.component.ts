import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import * as _ from 'lodash';
import { VolumeConstrainService } from 'src/app/service/volume-constrain.service';
@Component({
  selector: 'app-volume-constrain-history',
  templateUrl: './volume-constrain-history.component.html',
  styleUrls: ['./volume-constrain-history.component.css']
})
export class VolumeConstrainHistoryComponent implements OnInit {

  masterData: any = {};
  year: any = '2022';
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};

  @Output() onEventClick = new EventEmitter();
  constructor(
    private volumeConstrainService: VolumeConstrainService,) { }

  ngOnInit(): void {
  }

  retrieveMasterData(): Observable<any> {
    const version = this.volumeConstrainService.getVersion(this.year, this.month);
    return forkJoin([version]);
  }
  retrieveData() {
    // this.version = _.max(_.map(this.masterData.version, 'version'))
    // this.maxVersion = _.max(_.map(this.masterData.version, 'version'));
    this.maxVersion = _.max(_.map(this.masterData.version, 'version'));
    this.version = this.maxVersion;
    this.dataInfo = _.find(this.masterData.version, (item) => {
      return item.version === this.version
    })
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
  }
  onYearChange(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    this.retrieveMasterData().subscribe(res => {
      console.log('res version', res);
      this.masterData.version = res[0];
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }
  onView($event, data: any) {
    console.log('data.version', data.version);
    this.version = data.version;
    this.dataInfo = data;
    this.onEventClick.emit(data);
  }

  setDataInfo(dataInfo) {
    this.dataInfo = dataInfo;
  }
}
