import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';

import * as _ from 'lodash';
import { CostsService } from 'src/app/service/costs.service';
import { RefPricesService } from 'src/app/service/reference-prices.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-reference-price-history',
  templateUrl: './reference-price-history.component.html',
  styleUrls: ['./reference-price-history.component.css']
})
export class ReferencePriceHistoryComponent implements OnInit {

  @Input() masterData: any = {};
  year: any = 2022;
  month: any = moment().format('MM');
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
    private refPricesService: RefPricesService,
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
    // const refPricesVersion = this.refPricesService.getVersion(this.year);
    const refPricesVersion = this.refPricesService.getMonthVersion(this.year, this.month);
    return forkJoin([refPricesVersion]);
  }
  retrieveData() {

    this.maxVersion = _.max(_.map(this.masterData.refPricesVersion, 'version'));
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.refPricesVersion, (item) => {
      return item.version === this.version;
    });

    if (!this.dataInfo) {
      this.dataInfo = {};
    }

    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

    // const dataMaxVersion = _.filter(this.masterData.refPricesVersion, (item) => {
    //   return item.month === this.month
    // })
    // if (dataMaxVersion.length > 0) {
    //   this.maxVersion = _.max(_.map(dataMaxVersion, 'version'));
    //   this.version = this.maxVersion;
    // }
    // console.log('this.version', this.version)
    // this.dataInfo = _.find(this.masterData.refPricesVersion, (item) => {
    //   return item.month === this.month && item.version === this.version;
    // })
    // if (!this.dataInfo) {
    //   this.dataInfo = {};
    // }
    // this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

  }
  onYearChange(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    this.filterHistoryByUser = _.toNumber(this.month);
    this.retrieveMasterData().subscribe(res => {
      this.masterData.refPricesVersion = res[0];
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }

  onView($event, data: any) {
    // console.log("data >> ", data);
    this.loaderService.show();
    this.dataInfo = data;
    this.subject.next(data);
  }

  // onApplyValueChange($event, data: any) {

  //   if (data.isApply === true) {
  //     const observable: any[] = [];
  //     observable.push(this.refPricesService.saveVersion([data]));

  //     forkJoin(observable).subscribe(res => {
  //       this.retrieveMasterData().subscribe(res => {
  //         this.masterData.refPricesVersion = res[0];
  //         // this.retrieveData();

  //       });
  //     }, error => {

  //     });
  //   }

  // }

  getDataVersion() {
    return this.masterData.refPricesVersion;
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
