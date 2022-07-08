import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import * as _ from 'lodash';
import { LRByLegalService } from 'src/app/service/lr-by-legal.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-lr-by-legal-history',
  templateUrl: './lr-by-legal-history.component.html',
  styleUrls: ['./lr-by-legal-history.component.css']
})
export class LRByLegalHistoryComponent implements OnInit {

  masterData: any = {};
  year: any = moment().year();
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};

  @Output() onEventClick = new EventEmitter();
  constructor(
    private lrbylegalService: LRByLegalService,
    private loaderService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  retrieveMasterData(): Observable<any> {
    const version = this.lrbylegalService.getVersion(this.year, this.month);
    return forkJoin([version]);
  }

  retrieveData() {
    let data = _.find(this.masterData.version, (item) => {
      return item.month === _.toNumber(this.month) && item.year === _.toNumber(this.year)
    })

    if (data) {
      this.version = data.version
    }

    const dataMaxVersion = _.filter(this.masterData.version, (item) => {
      return item.month === _.toNumber(this.month)
    });

    if (dataMaxVersion.length > 0) {
      this.maxVersion = _.max(_.map(dataMaxVersion, 'version'));
    }

    this.dataInfo = data
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
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }
  onView($event, data: any) {
    this.loaderService.show();
    this.version = data.version;
    this.dataInfo = data;
    // console.log("this.dataInfo ::: ", this.dataInfo);
    this.onEventClick.emit(data);
  }
}
