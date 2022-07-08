import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-ngl-balance-report',
  templateUrl: './ngl-balance-report.component.html',
  styleUrls: ['./ngl-balance-report.component.css']
})
export class NglBalanceReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  getWorkSheet(workbook: Workbook, listMonth: any, dataListRayong: any, dataListKHM: any, dataListRefinery: any, mergeAlloNGLList: any){

    let worksheet = workbook.addWorksheet('NGL Balance');

    let dateTxt = moment().format('DD-MMM-YY');

    const titleDate = ['DATE :',dateTxt];
    // Add new row
    // let titleDateRow = worksheet.addRow(titleDate);

    // worksheet.addRow(['']);

    const header = [];

    header.push('GSP Production','')
    _.each(listMonth, (data,index) => {
        header.push(data.MonthName);
    });

    //Add Header Row 
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCBC' },
        bgColor: { argb: 'FF0000FF' }
      }
      // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    let dataRowRayong = ['NGL (Km3/Month)'];

    _.each(dataListRayong, (data,index) => {

      if(index == 'NGL'){

        _.each(data, (dataItems,indexItems) => {
          dataRowRayong.push(indexItems);

          _.each(listMonth, (dataMonth,indexMonth) => {
            const findGB = _.find(dataItems, x => {
              return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
            });
            dataRowRayong.push((findGB?.value ? findGB?.value : 0));
          });

          let rowDataRayong = worksheet.addRow(dataRowRayong);
          if(indexItems == 'Total'){
            rowDataRayong.eachCell((cell, number) => {
              cell.font = {
                bold: true
              };
            });
          }
          dataRowRayong = [''];
        });

      }

    });

    let dataRowRayongPerDay = ['NGL (m3/day)','Total GSP RY'];
    _.each(listMonth, (dataMonth,indexMonth) => {
      const findGB = _.find(dataListRayong['NGL'], x => {
        return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
      });
      dataRowRayongPerDay.push((findGB?.value ? findGB?.value : 0));
    });

    let rowDataRayongPerDay = worksheet.addRow(dataRowRayongPerDay);

    rowDataRayongPerDay.eachCell((cell, number) => {
      cell.font = {
        color: {argb: "1E88E5"},
        bold: true
      };
    });

    const headerDemand = [];

    headerDemand.push('Demand','')
    _.each(listMonth, (data,index) => {
      headerDemand.push(data.MonthName);
    });

    //Add Header Row 
    let headerRowDemand = worksheet.addRow(headerDemand);
    headerRowDemand.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCBC' },
        bgColor: { argb: 'FF0000FF' }
      }
      // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    let dataRowRayongDemand = ['NGL (Km3/Month)'];

    // console.log('mergeAlloC3LpgList',mergeAlloC3LpgList)
    // ข้อมูล Demand NGL จาก Merge Allocation
    let nglDemand = _.filter(_.cloneDeep(mergeAlloNGLList), { productionGroup: "dataListDemandOut0" });
    let dataPrductnglDemand = _.groupBy(nglDemand, "production" )

    // console.log('dataPrductnglDemand',dataPrductnglDemand);

    _.each(dataPrductnglDemand, (data,index) => {
      dataRowRayongDemand.push(index);
      _.each(listMonth, (dataMonth,indexMonth) => {

        const findData = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRowRayongDemand.push((findData?.value ? findData?.value : 0));

      });
      let rowData = worksheet.addRow(dataRowRayongDemand);
      dataRowRayongDemand = ['']
    });

    let dataRowRayongPerDayDemand = ['NGL (m3/day)','Total GSP RY'];
    _.each(listMonth, (dataMonth,indexMonth) => {
      const findGB = _.find(dataListRayong['NGL'], x => {
        return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
      });
      dataRowRayongPerDayDemand.push((findGB?.value ? findGB?.value : 0));
    });

    let rowDataRayongPerDayDemand = worksheet.addRow(dataRowRayongPerDayDemand);

    rowDataRayongPerDayDemand.eachCell((cell, number) => {
      cell.font = {
        color: {argb: "1E88E5"},
        bold: true
      };
    });

    worksheet.addRow(['']);

    /// ข้อมูลAbility KHM ของ NGL

    const headerNglHKM = [];

    headerNglHKM.push('GSP KHM Production','')
    _.each(listMonth, (data,index) => {
      headerNglHKM.push(data.MonthName);
    });

    //Add Header Row 
    let headerRowNglHKM = worksheet.addRow(headerNglHKM);
    headerRowNglHKM.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C5E1A5' },
        bgColor: { argb: 'FF0000FF' }
      }
      // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    let dataRowKHMNgl = ['NGL (Km3/Month)'];

    _.each(dataListKHM, (data,index) => {

      if(index == 'NGL'){
          dataRowKHMNgl.push(index);

          _.each(listMonth, (dataMonth,indexMonth) => {
            const findGB = _.find(data, x => {
              return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
            });
            dataRowKHMNgl.push((findGB?.value ? findGB?.value : 0));
          });

          let rowDataKHMNgl = worksheet.addRow(dataRowKHMNgl);
          dataRowKHMNgl = [''];

      }

    });

    const headerNglHKMDemand = [];

    headerNglHKMDemand.push('Demand','')
    _.each(listMonth, (data,index) => {
      headerNglHKMDemand.push(data.MonthName);
    });

    //Add Header Row 
    let headerRowNglHKMDemand = worksheet.addRow(headerNglHKMDemand);
    headerRowNglHKMDemand.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C5E1A5' },
        bgColor: { argb: 'FF0000FF' }
      }
      // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

  }

}
