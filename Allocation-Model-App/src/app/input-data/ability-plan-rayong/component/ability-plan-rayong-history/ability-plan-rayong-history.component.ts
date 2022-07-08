import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import * as _ from 'lodash';
import { AbilityPlanRayongService } from 'src/app/service/ability-plan-rayong.service';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-ability-plan-rayong-history',
  templateUrl: './ability-plan-rayong-history.component.html',
  styleUrls: ['./ability-plan-rayong-history.component.css']
})
export class AbilityPlanRayongHistoryComponent implements OnInit {

  masterData: any = {};
  year: any = moment().year();
  month: any = moment().format('MM');
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};

  apiUrlService = '';
  formatMonthName = 'MMM-yyyy';
  listMonth: any;
  filterHistoryByUser: any;

  @Output() onEventClick = new EventEmitter();
  constructor(
    private abilityPlanRayong: AbilityPlanRayongService) { }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlService;
    this.renderMonthList();
  }

  retrieveMasterData(): Observable<any> {
    // const version = this.abilityPlanRayong.getVersion(this.year, this.month, this.version);
    const version = this.abilityPlanRayong.getMonthVersion(this.year, this.month);
    return forkJoin([version]);
  }
  retrieveData() {
    // this.version = _.max(_.map(this.masterData.version, 'version'))
    // this.dataInfo = _.find(this.masterData.version, (item) => {
    //   return item.version === this.version && _.toInteger(item.year) === _.toInteger(this.year) && _.toInteger(item.month) === _.toInteger(this.month)
    // })
    // if (!this.dataInfo) {
    //   this.dataInfo = {};
    // }
    this.maxVersion = _.max(_.map(this.masterData.version, 'version'));
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.version, (item) => {
      return item.version === this.version;
    })
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;
  }
  setDataInfo(dataInfo) {
    this.dataInfo = dataInfo;
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
    this.dataInfo = data;
    this.onEventClick.emit(data);
  }

  renderMonthList() {

    // this.month = 1;
    // this.year = this.year;
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
    console.log("this.month >> ", this.month);
    // console.log("this.listMonth >> ", this.listMonth);
    // console.log("this.filterHistoryByUser >> ", this.filterHistoryByUser);
  }

  onMonthChanged($event: any) {
    this.onYearChange(this.year, $event.value, false);
  }

  getMaxVersion(month: any, year: any) {
    const maxVersion = _.max(_.map(_.filter(_.cloneDeep(this.masterData.version), { month: _.toNumber(month), year: _.toNumber(year) }), 'version'));
    return maxVersion;
  }
}
