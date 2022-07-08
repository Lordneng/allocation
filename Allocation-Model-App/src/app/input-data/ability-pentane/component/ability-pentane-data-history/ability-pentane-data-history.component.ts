import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import * as _ from 'lodash';
import { AbilityPentaneService } from 'src/app/service/ability-pentane.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ability-pentane-data-history',
  templateUrl: './ability-pentane-data-history.component.html',
  styleUrls: ['./ability-pentane-data-history.component.css']
})
export class AbilityPentaneDataHistoryComponent implements OnInit {
  masterData: any = {};
  year: any = '2021';
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};
  isApplyVersion: any = 0;

  @Output() onEventClick = new EventEmitter();
  constructor(private abilityPentaneService: AbilityPentaneService) { }

  ngOnInit(): void {
  }

  retrieveMasterData(): Observable<any> {
    const version = this.abilityPentaneService.getVersion(this.year, this.month);
    return forkJoin([version]);
  }
  retrieveData() {

    this.maxVersion = _.max(_.map(this.masterData.pentane, 'version'));
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.pentane, (item) => {
      return item.version === this.version;
    })
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

    // let data = _.find(this.masterData.pentane, (item) => {
    //   return item.isApply === true && item.month === _.toNumber(this.month) && item.year === _.toNumber(this.year)
    // })

    // if (data) {
    //   this.version = data.version
    //   this.isApplyVersion = data.version;
    // } else {
    //   data = _.find(this.masterData.pentane, (item) => {
    //     return item.isApply === true
    //   })

    //   if(data) {
    //     this.version = data.version
    //     this.isApplyVersion = data.version;
    //   }
    // }

    // const dataMaxVersion = _.filter(this.masterData.pentane, (item) => {
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
      this.masterData.pentane = res[0];

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
      observable.push(this.abilityPentaneService.saveVersion([data]));

      forkJoin(observable).subscribe(res => {
        this.retrieveMasterData().subscribe(res => {
          this.masterData.pentane = res[0];

          this.dataInfo = data
        });
      }, error => {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: error.message,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
        })
      });
    }
  }

  setDataInfo(dataInfo) {
    this.dataInfo = dataInfo;
  }

}
