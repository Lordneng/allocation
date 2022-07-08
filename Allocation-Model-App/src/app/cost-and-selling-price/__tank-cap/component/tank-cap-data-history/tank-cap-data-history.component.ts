import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import * as _ from 'lodash';
import { TankCapService } from 'src/app/service/tankcap.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tank-cap-data-history',
  templateUrl: './tank-cap-data-history.component.html',
  styleUrls: ['./tank-cap-data-history.component.css']
})
export class TankCapDataHistoryComponent implements OnInit {
  masterData: any = {};
  year: any = '2021';
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};
  isApplyVersion: any = 0;

  @Output() onEventClick = new EventEmitter();
  constructor(private TankCapService: TankCapService) { }

  ngOnInit(): void {
  }

  retrieveMasterData(): Observable<any> {
    const version = this.TankCapService.getVersion(this.year, this.month);
    return forkJoin([version]);
  }
  retrieveData() {
    let data = _.find(this.masterData.tankcap, (item) => {
      return item.isApply === true && item.month === _.toNumber(this.month) && item.year === _.toNumber(this.year)
    })

    if (data) {
      this.version = data.version
      this.isApplyVersion = data.version;
    } else {
      data = _.find(this.masterData.tankcap, (item) => {
        return item.isApply === true 
      })

      if(data) {
        this.version = data.version
        this.isApplyVersion = data.version;
      }
    }

    const dataMaxVersion = _.filter(this.masterData.tankcap, (item) => {
      return item.month ===  _.toNumber(this.month)
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
      this.masterData.tankcap = res[0];
      
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
      observable.push(this.TankCapService.saveVersion([data]));

      forkJoin(observable).subscribe(res => {
        this.retrieveMasterData().subscribe(res => {
          this.masterData.tankcap = res[0];

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

}
