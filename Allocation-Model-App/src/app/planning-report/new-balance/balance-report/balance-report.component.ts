import { Component, OnInit, ViewChild } from '@angular/core';
import { Workbook } from 'exceljs';
import { forkJoin, Observable } from 'rxjs';
import { EthaneBalanceReportComponent } from './ethane-balance-report/ethane-balance-report.component';
import { Cl3lpgBalanceReportComponent } from './cl3lpg-balance-report/cl3lpg-balance-report.component';
import { NglBalanceReportComponent } from './ngl-balance-report/ngl-balance-report.component';
import { PentaneComponent } from './pentane/pentane.component';
import { OptimizationsService } from 'src/app/service/optimizations.service';
import { AbilityPlanRayongService } from 'src/app/service/ability-plan-rayong.service';
import { AbilityPlanKhmService } from 'src/app/service/ability-plan-khm.service';
import { AbilityRefineryService } from 'src/app/service/ability-refinery.service';
import { AbilityPentaneService } from 'src/app/service/ability-pentane.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.css']
})
export class BalanceReportComponent implements OnInit {

  year: any;
  month: any;
  listMonth = [];
  mergeAlloVersionList: any = [];
  mergeAlloVersion:any = [];
  mergeAlloId:any = null;
  abilityVersion:any = [];
  abilityDataList:any = [];
  dataListRayong:any = [];
  dataListKhm:any = [];
  dataListRefinery:any = [];
  dataListPentane:any = [];
  mergeAlloC2List: any = [];
  mergeAlloC3LpgList: any = [];
  mergeAlloNGLList: any = [];
  mergeAlloPentaneList: any = [];

  formatMonthName = 'MMM-yyyy';

  @ViewChild('dataGridEthane') dataGridEthane: EthaneBalanceReportComponent;
  @ViewChild('dataGridCl3lpg') dataGridCl3lpg: Cl3lpgBalanceReportComponent;
  @ViewChild('dataGridNgl') dataGridNgl: NglBalanceReportComponent;
  @ViewChild('dataGridPentane') dataGridPentane: PentaneComponent;
  
  constructor(
    private optimizationsService: OptimizationsService,
    private abilityPlanRayongService: AbilityPlanRayongService,
    private abilityPlanKhmService: AbilityPlanKhmService,
    private abilityRefineryService: AbilityRefineryService,
    private abilityPentaneService: AbilityPentaneService,
  ) { }

  ngOnInit(): void {

  }

  onYearChange(
    year: any,
    month: any,
    callback?: any
  ) {

    this.year = year;
    this.month = month;

    this.mergeAlloVersionList = [];

    this.retrieveMasterData().subscribe(res => {
      console.log("res > ", res);
      this.mergeAlloVersionList = res[0];
    });
    
  }

  retrieveMasterData(): Observable<any> {
    const optimizationsVersion = this.optimizationsService.getMonthVersion(this.year, this.month);
    return forkJoin([optimizationsVersion]);
  }

  retrieveDataAbility(): Observable<any> {

    //Get List By Version ID
    const abilityPlanRayongList = this.abilityPlanRayongService.getListbyVersionID(this.abilityVersion?.abilityPlanRayongId);
    const abilityPlanKhmList = this.abilityPlanKhmService.getListbyVersionID(this.abilityVersion?.abilityPlanKhmId);
    const abilityPlanRefineryList = this.abilityRefineryService.getListbyVersionID(this.abilityVersion?.abilityRefineryId);
    const abilityPlanPentaneList = this.abilityPentaneService.getListbyVersionID(this.abilityVersion?.abilityPentaneId);

    //Get Version Info
    const abilityRayongVersion = this.abilityPlanRayongService.getVersionByID(this.abilityVersion?.abilityPlanRayongId);
    const abilityPlanKhmVersion = this.abilityPlanKhmService.getVersionByID(this.abilityVersion?.abilityPlanKhmId);
    const abilityPlanRefineryVersion = this.abilityRefineryService.getVersionByID(this.abilityVersion?.abilityRefineryId);
    const abilityPlanPentaneVersion = this.abilityPentaneService.getVersionByID(this.abilityVersion?.abilityPentaneId);

    //Get Merge Allo C2
    const optimizationsC2 = this.optimizationsService.getList(this.year, this.month, this.mergeAlloVersion?.version, 0);
    //Get Merge Allo C3/LPG
    const optimizationsC3Lpg = this.optimizationsService.getListC3Lpg(this.year, this.month, this.mergeAlloVersion?.version, 0);
    //Get Merge Allo NGL
    const optimizationsNGL = this.optimizationsService.getListNgl(this.year, this.month, this.mergeAlloVersion?.version, 0);
    //Get Merge Allo Pentane
    const optimizationsPentane = this.optimizationsService.getListPantane(this.year, this.month, this.mergeAlloVersion?.version, 0);

    return forkJoin([ 
      abilityPlanRayongList, 
      abilityPlanKhmList,
      abilityPlanRefineryList, 
      abilityRayongVersion, 
      abilityPlanKhmVersion, 
      abilityPlanRefineryVersion, 
      optimizationsC2, 
      optimizationsC3Lpg,
      abilityPlanPentaneList,
      abilityPlanPentaneVersion,
      optimizationsPentane,
      optimizationsNGL
    ]);
  }

  getWorkSheet(workbook: Workbook){

    // Sheet Ethane Balance
    this.dataGridEthane.getWorkSheet(workbook, this.listMonth, this.dataListRayong, this.mergeAlloC2List);
    // Sheet CL3LPG Balance
    this.dataGridCl3lpg.getWorkSheet(workbook, this.listMonth, this.dataListRayong, this.dataListKhm, this.dataListRefinery, this.mergeAlloC3LpgList);
    // Sheet NPG Balance
    this.dataGridNgl.getWorkSheet(workbook, this.listMonth, this.dataListRayong, this.dataListKhm, this.dataListRefinery, this.mergeAlloNGLList);
    // Sheet Pentane Balance
    this.dataGridPentane.getWorkSheet(workbook, this.listMonth, this.dataListPentane, this.mergeAlloPentaneList);
    
  }

  onAccept(evevt: any, callback?: any) {

    this.mergeAlloVersion = this.mergeAlloVersionList.find((obj) => {
      return obj.id == this.mergeAlloId;
    });

    console.log('mergeAlloVersion',this.mergeAlloVersion);

    this.abilityVersion.abilityPlanRayongId = this.mergeAlloVersion?.abilityPlanRayongId;
    this.abilityVersion.abilityPlanKhmId = this.mergeAlloVersion?.abilityPlanKhmId;
    this.abilityVersion.abilityRefineryId = this.mergeAlloVersion?.abilityRefineryId;
    this.abilityVersion.abilityPentaneId = this.mergeAlloVersion?.abilityPentaneId;

    this.retrieveDataAbility().subscribe(res => {
      console.log("res DataAbility > ", res);
      this.abilityDataList.abilityPlanRayong = res[0];
      this.abilityDataList.abilityPlanKhm = res[1];
      this.abilityDataList.abilityPlanRefinery = res[2];
      this.abilityVersion.abilityPlanRayong = res[3];
      this.abilityVersion.abilityPlanKhm = res[4];
      this.abilityVersion.abilityPlanRefinery = res[5];
      this.mergeAlloC2List = res[6];
      this.mergeAlloC3LpgList = res[7];
      this.abilityDataList.abilityPlanPentane = res[8];
      this.abilityVersion.abilityPlanPentane = res[9];
      this.mergeAlloPentaneList = res[10];
      this.mergeAlloNGLList = res[11];
      this.setDataAbility();
    });
  }

  setDataAbility() {
    this.dataListRayong = [];
    this.dataListKhm = [];
    const dataAbilityRayong = this.abilityDataList.abilityPlanRayong;
    const dataAbilityKHM = this.abilityDataList.abilityPlanKhm;
    const dataAbilityRefinery = this.abilityDataList.abilityPlanRefinery;

    this.dataListPentane = this.abilityDataList.abilityPlanPentane;

    // console.log('dataAbilityRayong',dataAbilityRayong);

    //Set Month Start
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + this.month + '-01');
    // let dateStart = moment(dataAbilityRayong[0].yearValue + '-' + dataAbilityRayong[0].monthValue + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    dateStart = dateStart.add(1, 'M');
    for (let index = 1; index <= 12; index++) {
      const data: any = {
        year: yearStart,
        month: monthStart,
        dataField: 'M' + monthStart + yearStart,
        MonthName: dateStart.format(this.formatMonthName),
      };
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    // Ability Rayong
    let productHeaderRY = {};

    _.each(dataAbilityRayong, (data,index) => {
      productHeaderRY[data.product] = [];
    });

    _.each(productHeaderRY, (product,key) => {
      let plantHeader = {};
      _.each(dataAbilityRayong, (data,index) => {
        if(key == data.product){
          plantHeader[data.productionPlant] = [];
          _.each(this.listMonth, (item) => {
            let dataList = {};
            _.each(dataAbilityRayong, (ablRY) => {
              if(key == ablRY.product && data.productionPlant == ablRY.productionPlant && ablRY.yearValue == item.year && ablRY.monthValue == item.month){
                // dataList[item.dataField] = ablRY.value;
                plantHeader[data.productionPlant][item.dataField] = ablRY.value;
              }
            });
            // plantHeader[data.productionPlant].push(dataList);
          });
        }
      });

      productHeaderRY[key] = plantHeader;
    });

    this.dataListRayong = productHeaderRY;

    console.log('this.dataListRayong',this.dataListRayong);

    // Ability KHM
    let productHeaderKHM = {};

    _.each(dataAbilityKHM, (data,index) => {
      productHeaderKHM[data.product] = [];
    });

    _.each(productHeaderKHM, (product,key) => {
      let plantHeader = {};
      _.each(dataAbilityKHM, (data,index) => {
        if(key == data.product){
          _.each(this.listMonth, (item) => {
              if(key == data.product && data.yearValue == item.year && data.monthValue == item.month){
                plantHeader[item.dataField] = data.value;
              }
          });
        }
      });

      productHeaderKHM[key] = plantHeader;
    });

    this.dataListKhm = productHeaderKHM;

    console.log('this.dataListKhm',this.dataListKhm);

    // Ability Refinery
    let productHeaderRefinery = {};

    _.each(dataAbilityRefinery, (data,index) => {
      productHeaderRefinery[data.product] = [];
    });

    _.each(productHeaderRefinery, (product,key) => {
      let plantHeader = {};
      _.each(dataAbilityRefinery, (data,index) => {
        if(key == data.product){
          _.each(this.listMonth, (item) => {
              if(key == data.product && data.yearValue == item.year && data.monthValue == item.month){
                plantHeader[item.dataField] = data.value;
              }
          });
        }
      });

      productHeaderRefinery[key] = plantHeader;
    });

    this.dataListRefinery = productHeaderRefinery;

    console.log('this.dataListRefinery',this.dataListRefinery);
    
  }

  displayVersion(item: any) {
    if (item) {
      return `${item.versionName}`;
    } else {
      return '';
    }
  }

}
