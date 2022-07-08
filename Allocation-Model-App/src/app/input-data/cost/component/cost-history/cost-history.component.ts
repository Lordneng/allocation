import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';

import * as _ from 'lodash';
import { CostsService } from 'src/app/service/costs.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-cost-history',
  templateUrl: './cost-history.component.html',
  styleUrls: ['./cost-history.component.css']
})
export class CostHistoryComponent implements OnInit {

  masterData: any = {};
  year: any = 2021;
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};

  apiUrlService = '';
  formatMonthName = 'MMM-yyyy';
  listMonth: any;
  filterHistoryByUser: any;

  subject: Subject<any> = new Subject();
  @Output() onEventClick = new EventEmitter();
  constructor(
    private costsService: CostsService,
    private loaderService: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlService;
    this.renderMonthList();

    this.subject
      .pipe(debounceTime(100))
      .subscribe((data) => {
        this.onEventClick.emit(data);
      }
      );
  }

  retrieveMasterData(): Observable<any> {
    // const costVersion = this.costsService.getVersion(this.year);
    const costVersion = this.costsService.getMonthVersion(this.year, this.month);
    return forkJoin([costVersion]);
  }

  retrieveData() {
    // const dataMaxVersion = _.filter(this.masterData.costVersion, (item) => {
    //   return item.month === this.month
    // })
    // if (dataMaxVersion.length > 0) {
    //   this.maxVersion = _.max(_.map(dataMaxVersion, 'version'));
    //   this.version = this.maxVersion;
    // }
    // console.log('this.version', this.version)
    // this.dataInfo = _.find(this.masterData.costVersion, (item) => {
    //   return item.month === this.month && item.version === this.version;
    // })
    // if (!this.dataInfo) {
    //   this.dataInfo = {};
    // }
    // this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

    this.maxVersion = _.max(_.map(this.masterData.costVersion, 'version'));
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.costVersion, (item) => {
      return item.version === this.version;
    });

    if (!this.dataInfo) {
      this.dataInfo = {};
    }

    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

  }

  onYearChange(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    // this.filterHistoryByUser = _.toNumber(this.month);
    this.retrieveMasterData().subscribe(res => {
      this.masterData.costVersion = res[0];
      console.log('this.masterData.costVersion', this.masterData.costVersion)
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }

  onView($event, data: any) {
    this.loaderService.show();
    this.dataInfo = data;
    this.subject.next(data);
  }

  getDataVersion() {
    return this.masterData.costVersion;
  }

  renderMonthList() {

    // this.month = 1;
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
    this.onYearChange(this.year, $event.value, false);
  }
}
