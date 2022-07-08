import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import * as _ from 'lodash';
import { CostsService } from 'src/app/service/costs.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { OptimizationsService } from 'src/app/service/optimizations.service';

@Component({
  selector: 'app-optimization-version',
  templateUrl: './optimization-version.component.html',
  styleUrls: ['./optimization-version.component.css']
})
export class OptimizationVersionComponent implements OnInit {

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

  @Output() onEventClick = new EventEmitter();
  constructor(
    private costsService: CostsService,
    private loaderService: NgxSpinnerService,
    private optimizationsService: OptimizationsService) { }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlNestJS;
    this.renderMonthList();
  }

  retrieveMasterData(): Observable<any> {
    // const costVersion = this.costsService.getVersion(this.year);
    const optimizationsVersion = this.optimizationsService.getMonthVersion(this.year, this.month);
    return forkJoin([optimizationsVersion]);
  }

  retrieveData() {

    // this.maxVersion = _.max(_.map(this.masterData.optimizationsVersion, 'version'));
    this.maxVersion = _.cloneDeep(this.masterData.optimizationsVersion)[0]?.version;
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.optimizationsVersion, (item) => {
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
      console.log("optimizationsVersion >> ", res);
      this.masterData.optimizationsVersion = _.orderBy(res[0], ['createDate'], ['desc']);
      // console.log('this.masterData.optimizationsVersion', this.masterData.optimizationsVersion)
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

  getDataVersion() {
    return this.masterData.optimizationsVersion;
  }

  getVersionNarmal() {
    return this.maxVersion = _.max(_.map(_.cloneDeep(this.masterData.optimizationsVersion), 'version'));
  }

  getVersionAI() {

    const isWithOutDemandAI = _.filter(_.cloneDeep(this.masterData.optimizationsVersion), {
      // month: _.toNumber(this.month),
      // year: _.toNumber(this.year),
      isWithOutDemandAI: true
    });

    return this.maxVersion = _.max(_.map(isWithOutDemandAI, 'version'));
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
  }

  onMonthChanged($event: any) {
    this.onYearChange(this.year, $event.value, false);
  }
  download(fileName) {
    this.optimizationsService.download(fileName).subscribe((res:any) => {
      // console.log('download', res)
      var data = new Blob([JSON.stringify(res)], { type: 'text/plain' });

      let url = window.URL.createObjectURL(data);

      let a = document.createElement('a');
      document.body.appendChild(a);

      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }
}
