import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-pentane',
  templateUrl: './pentane.component.html',
  styleUrls: ['./pentane.component.css']
})
export class PentaneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  getWorkSheet(workbook: Workbook, listMonth: any, dataListPentane: any, mergeAlloPentaneList: any){
    
    let worksheet = workbook.addWorksheet('Pentane Balance');

    let dateTxt = moment().format('DD-MMM-YY');

    const titleDate = ['DATE :',dateTxt];
    // Add new row
    let titleDateRow = worksheet.addRow(titleDate);

    worksheet.addRow(['']);

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

    // Ability Pentane
    const PentaneList = _.groupBy(dataListPentane, 'product');

    // console.log('PentaneList',PentaneList);

    let dataRowPentane = ['Pentane (KT/Month)'];

    _.each(PentaneList, (data,index) => {
      dataRowPentane.push(index);

      _.each(listMonth, (dataMonth,indexMonth) => {
        const findGB = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRowPentane.push((findGB?.value ? findGB?.value : 0));
      });

      let rowDataPentane = worksheet.addRow(dataRowPentane);
      dataRowPentane = [''];
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

    // Merge Allo Pentane
    const MergeAlloPentaneList = _.groupBy(mergeAlloPentaneList, 'production');

    console.log('MergeAlloPentaneList',MergeAlloPentaneList);

    let dataRowMergeAlloPentane = ['Pentane (KT/Month)'];

    _.each(MergeAlloPentaneList, (data,index) => {
      dataRowMergeAlloPentane.push(index);

      _.each(listMonth, (dataMonth,indexMonth) => {
        const findGB = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRowMergeAlloPentane.push((findGB?.value ? findGB?.value : 0));
      });

      let rowDataPentane = worksheet.addRow(dataRowMergeAlloPentane);
      dataRowMergeAlloPentane = [''];
    });

    
  }

}
