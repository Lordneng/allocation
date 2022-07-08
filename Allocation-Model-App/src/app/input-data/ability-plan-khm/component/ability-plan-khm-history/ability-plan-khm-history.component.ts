import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AbilityPlanKhmService } from 'src/app/service/ability-plan-khm.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ability-plan-khm-history',
  templateUrl: './ability-plan-khm-history.component.html',
  styleUrls: ['./ability-plan-khm-history.component.css']
})
export class AbilityPlanKhmHistoryComponent implements OnInit {

  masterData: any = {};
  year: any = '2021';
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  isApplyVersion: any = 0;
  dataInfo: any = {};
  apiUrlService = '';

  @Output() onEventClick = new EventEmitter();
  constructor(
    private abilityPlanKhm: AbilityPlanKhmService) { }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlService
  }

  retrieveMasterData(): Observable<any> {
    const abilityPlanKhmVersion = this.abilityPlanKhm.getMonthVersion(this.year, this.month);

    return forkJoin([abilityPlanKhmVersion]);
  }


  retrieveData() {


    this.maxVersion = _.max(_.map(this.masterData.abilityPlanKhmVersion, 'version'));
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.abilityPlanKhmVersion, (item) => {
      return item.version === this.version;
    })
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

    // let data = _.find(this.masterData.abilityPlanKhmVersion, (item) => {
    //   return item.isApply === true && item.month === _.toNumber(this.month) && item.year === _.toNumber(this.year)
    // })

    // if (data) {
    //   this.version = data.version
    //   this.isApplyVersion = data.version;
    // } else {
    //   data = _.find(this.masterData.abilityPlanKhmVersion, (item) => {
    //     return item.isApply === true
    //   })

    //   if(data) {
    //     this.version = data.version
    //     this.isApplyVersion = data.version;
    //   }
    // }

    // const dataMaxVersion = _.filter(this.masterData.abilityPlanKhmVersion, (item) => {
    //   return item.month ===  _.toNumber(this.month)
    // })
    // if (dataMaxVersion.length > 0) {
    //   this.maxVersion = _.max(_.map(dataMaxVersion, 'version'));
    // }

    // this.dataInfo = data
    // if (!this.dataInfo) {
    //   this.dataInfo = {};
    // }
    // this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;
    // this.dataInfo.isApplyVersion = this.isApplyVersion ? this.isApplyVersion : 0;
  }

  onYearChange(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    this.retrieveMasterData().subscribe(res => {
      this.masterData.abilityPlanKhmVersion = res[0];
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }

  onYearChangeImport(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    this.retrieveMasterData().subscribe(res => {
      this.masterData.abilityPlanKhmVersion = res[0];
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

  onApplyValueChange($event, data: any) {
    if (data.isApply === true) {
      const observable: any[] = [];
      observable.push(this.abilityPlanKhm.saveVersion([data]));

      forkJoin(observable).subscribe(res => {
        this.retrieveMasterData().subscribe(res => {
          this.masterData.abilityPlanKhmVersion = res[0];
          // this.retrieveData();

        });
      }, error => {

      });
    }

  }

  setDataInfo(dataInfo) {
    this.dataInfo = dataInfo;
  }
}
