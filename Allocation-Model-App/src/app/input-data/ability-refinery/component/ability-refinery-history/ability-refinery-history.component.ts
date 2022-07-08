import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AbilityRefineryService } from 'src/app/service/ability-refinery.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ability-refinery-history',
  templateUrl: './ability-refinery-history.component.html',
  styleUrls: ['./ability-refinery-history.component.css']
})
export class AbilityRefineryHistoryComponent implements OnInit {
  masterData: any = {};
  year: any = '2021';
  month: any = 1;
  version: any = 1;
  maxVersion: any = 0;
  dataInfo: any = {};
  isApplyVersion: any = 0;

  @Output() onEventClick = new EventEmitter();

  constructor(private abilityRefineryService: AbilityRefineryService) { }

  ngOnInit(): void {
  }

  retrieveMasterData(): Observable<any> {
    const version = this.abilityRefineryService.getMonthVersion(this.year, this.month);
    return forkJoin([version]);
  }
  retrieveData() {

    this.maxVersion = _.max(_.map(this.masterData.refinery, 'version'));
    this.version = this.maxVersion;

    console.log('this.version', this.version)
    this.dataInfo = _.find(this.masterData.refinery, (item) => {
      return item.version === this.version;
    })
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
    this.dataInfo.maxVersion = this.maxVersion ? this.maxVersion : 0;

  }

  onYearChange(year: any, month: any, callbak) {
    this.year = year;
    this.month = month;
    this.retrieveMasterData().subscribe(res => {
      this.masterData.refinery = res[0];
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

  setDataInfo(dataInfo) {
    this.dataInfo = dataInfo;
  }

}
