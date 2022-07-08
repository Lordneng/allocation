import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, merge } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Workbook } from 'exceljs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { OptimizationsService } from 'src/app/service/optimizations.service';
import { AbilityPlanRayongService } from 'src/app/service/ability-plan-rayong.service';
import { AbilityPlanKhmService } from 'src/app/service/ability-plan-khm.service';

@Component({
  selector: 'app-ability-report',
  templateUrl: './ability-report.component.html',
  styleUrls: ['./ability-report.component.css'],
})
export class AbilityReportComponent implements OnInit {

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

  formatMonthName = 'MMM-yyyy';

  constructor(
    private loaderService: NgxSpinnerService,
    private optimizationsService: OptimizationsService,
    private abilityPlanRayongService: AbilityPlanRayongService,
    private abilityPlanKhmService: AbilityPlanKhmService,
  ){};

  ngOnInit(): void {

  }

  retrieveMasterData(): Observable<any> {
    const optimizationsVersion = this.optimizationsService.getMonthVersion(this.year, this.month);
    return forkJoin([optimizationsVersion]);
  }

  retrieveDataAbility(): Observable<any> {

    //Get List By Version ID
    const abilityPlanRayongList = this.abilityPlanRayongService.getListbyVersionID(this.abilityVersion?.abilityPlanRayongId);
    const abilityPlanKhmList = this.abilityPlanKhmService.getListbyVersionID(this.abilityVersion?.abilityPlanKhmId);

    //Get Version Info
    const abilityRayongVersion = this.abilityPlanRayongService.getVersionByID(this.abilityVersion?.abilityPlanRayongId);
    const abilityPlanKhmVersion = this.abilityPlanKhmService.getVersionByID(this.abilityVersion?.abilityPlanKhmId);

    return forkJoin([ abilityPlanRayongList, abilityPlanKhmList, abilityRayongVersion, abilityPlanKhmVersion ]);
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

  onAccept(evevt: any, callback?: any) {

      this.mergeAlloVersion = this.mergeAlloVersionList.find((obj) => {
        return obj.id == this.mergeAlloId;
      });

      console.log('mergeAlloVersion',this.mergeAlloVersion);

      this.abilityVersion.abilityPlanRayongId = this.mergeAlloVersion.abilityPlanRayongId;
      this.abilityVersion.abilityPlanKhmId = this.mergeAlloVersion.abilityPlanKhmId;

      this.retrieveDataAbility().subscribe(res => {
        console.log("res DataAbility > ", res);
        this.abilityDataList.abilityPlanRayong = res[0];
        this.abilityDataList.abilityPlanKhm = res[1];
        this.abilityVersion.abilityPlanRayong = res[2];
        this.abilityVersion.abilityPlanKhm = res[2];
        this.setDataAbility();
      });
  }

  setDataAbility() {
    this.dataListRayong = [];
    this.dataListKhm = [];
    const dataAbilityRayong = this.abilityDataList.abilityPlanRayong;
    const dataAbilityKHM = this.abilityDataList.abilityPlanKhm;

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

    // Ability Rayong
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
    
  }

  displayVersion(item: any) {
    if (item) {
      return `${item.versionName}`;
    } else {
      return '';
    }
  }

  getWorkSheet(workbook: Workbook){
    if(this.dataListRayong && this.dataListKhm){

      let worksheet = workbook.addWorksheet('Ability');

      const title = 'Ability';
      // Add new row
      // let titleRow = worksheet.addRow([title]);

      const header = [];

      header.push('product')
      _.each(this.listMonth, (data,index) => {
          header.push(data.MonthName);
      });

      //Add Header Row 
      let headerRow = worksheet.addRow(header);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEE58' },
          bgColor: { argb: 'FF0000FF' }
        }
        // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    
      _.each(this.dataListRayong, (data,index) => {
        // console.log('dataItem',index);
        let titleProduct = worksheet.addRow([index]);

        const rowNumProduct = titleProduct['_number'];
        worksheet.mergeCells('A'+rowNumProduct+':M'+rowNumProduct);

        titleProduct.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EF9A9A' },
            bgColor: { argb: 'FF0000FF' },
          }
          // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        _.each(this.dataListRayong[index], (dataPlant,indexPlant) => {
          // console.log('item.data',item[data.dataField]);
          const dataItems = [indexPlant];
          
          _.each(this.listMonth, (dataMonth,indexMonth) => {

            const value = this.dataListRayong[index][indexPlant][dataMonth.dataField]

            dataItems.push((value ? value : 0));

          });

          let titleProductPlant = worksheet.addRow(dataItems);

          if(indexPlant == 'Total'){
            titleProductPlant.eachCell((cell, number) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '64FFDA' },
                bgColor: { argb: 'FF0000FF' },
              }
              // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
          }
        });

      });

      const data = [];

      _.each(data, (d,index) => {
        let row = worksheet.addRow(d);
        let rowNum = row['_number'];
        if(rowNum%2 == 1){
          row.eachCell((cell, number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE082' }
            }
          });
        }
      });

      // Remark Ability Rayong
      let rowRemarkRY = worksheet.addRow(['Remark',this.abilityVersion?.abilityPlanRayong?.remark]);

      const rowNumRemarkRY = rowRemarkRY['_number'];
      worksheet.mergeCells('B'+rowNumRemarkRY+':M'+rowNumRemarkRY);

      rowRemarkRY.eachCell((cell, number) => {
        if(number > 0){
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEE58' },
            bgColor: { argb: 'FF0000FF' },
          }
          // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        }
      });

      worksheet.addRow([]);

      //Add Header Row KHM
      let headerRowKHM = worksheet.addRow(header);
      headerRowKHM.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEE58' },
          bgColor: { argb: 'FF0000FF' }
        }
        // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });

      _.each(this.dataListKhm, (data,index) => {

        const dataItems = [index];

        _.each(this.listMonth, (dataMonth,indexMonth) => {
          let value;
          _.each(this.dataListKhm[index], (dataValue,indexPlant) => {
            value = this.dataListKhm[index][dataMonth.dataField]
          });
          dataItems.push((value ? value : 0));
        });

        let rowItem = worksheet.addRow(dataItems);
        
      });

      // Remark Ability KHM
      let rowRemarkKHM = worksheet.addRow(['Remark',this.abilityVersion?.abilityPlanKHM?.remark]);

      const rowNumRemarkKHM = rowRemarkKHM['_number'];
      worksheet.mergeCells('B'+rowNumRemarkKHM+':M'+rowNumRemarkKHM);

      rowRemarkKHM.eachCell((cell, number) => {
        if(number > 0){
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEE58' },
            bgColor: { argb: 'FF0000FF' },
          }
          // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        }
      });

    }else{

    }
  }
}
