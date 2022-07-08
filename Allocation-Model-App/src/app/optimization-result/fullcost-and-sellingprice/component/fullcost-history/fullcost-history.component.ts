import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import * as _ from 'lodash';
import { FullCostsService } from 'src/app/service/full-costs.service';
import { FullCostsManualService } from 'src/app/service/full-costs-manual.service';
import { CalMarginService } from 'src/app/service/cal-margin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-fullcost-history',
  templateUrl: './fullcost-history.component.html',
  styleUrls: ['./fullcost-history.component.css']
})
export class FullcostHistoryComponent implements OnInit {
  masterData: any = {};
  month: any = moment().format('M')
  year: any = moment().format('yyyy');
  version: any = 1;
  maxVersion: any = 1;
  dataInfo: any = {};
  formatMonthName = 'MMM-yyyy';
  listMonth: any;
  filterHistoryByUser: any;

  @Output() onEventClick = new EventEmitter();
  constructor(private calMarginService: CalMarginService) { }

  ngOnInit(): void {
    this.renderMonthList();
  }

  retrieveMasterData(): Observable<any> {
    const calMarginVersion = this.calMarginService.getVersion(this.month, this.year);
    return forkJoin([calMarginVersion]);
  }

  retrieveData() {

    // const dataMaxVersion = _.filter(_.cloneDeep(this.masterData.calMarginVersion), (item) => {
    //   return item.month === Math.abs(_.toNumber(this.month));
    // })

    // if (dataMaxVersion.length > 0) {
    //   this.maxVersion = _.max(_.map(dataMaxVersion, 'version'));
    //   this.version = this.maxVersion;
    // }

    // this.dataInfo = _.find(_.cloneDeep(this.masterData.calMarginVersion), (item) => {
    //   return _.toNumber(item.month) === _.toNumber(this.month) && _.toNumber(item.version) === _.toNumber(this.version);
    // })

    // if (!this.dataInfo) {
    //   this.dataInfo = {};
    // }

    // this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

    this.maxVersion = _.max(_.map(this.masterData.calMarginVersion, 'version'));
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.calMarginVersion, (item) => {
      return item.version === this.version;
    });

    if (!this.dataInfo) {
      this.dataInfo = {};
    }

    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

  }

  onYearChange(month: any, year: any, callbak) {
    this.month = month
    this.year = year;
    // this.filterHistoryByUser = _.toNumber(this.month);
    this.retrieveMasterData().subscribe(res => {
      this.masterData.calMarginVersion = res[0];
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }

  onView($event, data: any) {
    this.dataInfo = data;
    this.version = data.version;
    this.onEventClick.emit(data);
  }

  renderMonthList() {

    this.listMonth = [{
      id: -1,
      monthName: 'ทั้งหมด'
    }]

    this.year = this.year;
    let dateStart = moment(this.year + '-' + '01' + '-01');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();

    this.listMonth = [{ id: -1, monthName: 'ทั้งหมด' }]

    for (let index = 1; index < 13; index++) {
      const data: any = {
        id: index,
        monthName: dateStart.format(this.formatMonthName),
      }

      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();

    }

    this.filterHistoryByUser = _.toNumber(this.month);
    console.log("this.listMonth >> ", this.listMonth);
    console.log("this.filterHistoryByUser >> ", this.filterHistoryByUser);
  }

  onMonthChanged($event: any) {
    this.onYearChange($event.value, this.year, false);
  }

  setDataInfo(dataInfo) {
    this.dataInfo = dataInfo;
  }
}
