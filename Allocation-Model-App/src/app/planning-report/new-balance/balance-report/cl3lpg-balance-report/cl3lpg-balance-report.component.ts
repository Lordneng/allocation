import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-cl3lpg-balance-report',
  templateUrl: './cl3lpg-balance-report.component.html',
  styleUrls: ['./cl3lpg-balance-report.component.css']
})
export class Cl3lpgBalanceReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  getWorkSheet(workbook: Workbook, listMonth: any, dataListRayong: any, dataListKHM: any, dataListRefinery: any, mergeAlloC3LpgList: any){

    let worksheet = workbook.addWorksheet('C3 LPG Balance');

    let dateTxt = moment().format('DD-MMM-YY');

    const titleDate = ['DATE :',dateTxt];
    // Add new row
    let titleDateRow = worksheet.addRow(titleDate);

    worksheet.addRow(['']);

    const header = [];

    header.push('GSP RY Production','','','')
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

    console.log('dataListRayong',dataListRayong);

    const dataAllSupply = [];
    _.each(dataListRayong, (data,index) => {
      if(index == 'C3/LPG'){
        let dataRow = [index + ' (KT/Month)'];
        _.each(data, (dataGCKT,indexGCKT) => {
          dataRow.push(indexGCKT,'','');
          _.each(listMonth, (dataMonth,indexMonth) => {
              dataRow.push((dataGCKT[dataMonth.dataField] ? dataGCKT[dataMonth.dataField] : 0));
              dataAllSupply[dataMonth.dataField] = ((dataAllSupply[dataMonth.dataField] ? dataAllSupply[dataMonth.dataField] : 0 ) + (dataGCKT[dataMonth.dataField] ? dataGCKT[dataMonth.dataField] : 0));
          });
          let rowData = worksheet.addRow(dataRow);
          dataRow = [''];
          if(indexGCKT == 'Total'){
            rowData.eachCell((cell, number) => {
              cell.font = {
                bold: true
              };
            });
          }
        });
      }
    });

    let dataRowC3TD = ['C3/LPG (KT/Day)','Total','',''];
    _.each(listMonth, (dataMonth,indexMonth) => {

      const daysInMonth = this.daysInMonth(dataMonth.month,dataMonth.year);

      let valueTotal = (dataAllSupply[dataMonth.dataField] ? (dataAllSupply[dataMonth.dataField]) : 0);
      valueTotal = (valueTotal/daysInMonth);

      dataRowC3TD.push(valueTotal);

    });
    let rowDataC3TD = worksheet.addRow(dataRowC3TD);
    rowDataC3TD.eachCell((cell, number) => {
      cell.font = {
        color: {argb: "1976D2"},
        bold: true
      };
    });

    //Data Ability Refinery

    _.each(dataListRefinery, (data,index) => {
      let dataRow = [''];
        dataRow.push(index,'','');
        _.each(listMonth, (dataMonth,indexMonth) => {
            dataRow.push((data[dataMonth.dataField] ? data[dataMonth.dataField] : 0));
            dataAllSupply[dataMonth.dataField] = ((dataAllSupply[dataMonth.dataField] ? dataAllSupply[dataMonth.dataField] : 0 ) + (data[dataMonth.dataField] ? data[dataMonth.dataField] : 0));
        });
        let rowData = worksheet.addRow(dataRow);
    });

    console.log('dataAllSupply',dataAllSupply);
    // Total Supply
    let dataRowTotalSupply = ['Total Supply','','',''];
    _.each(listMonth, (dataMonth,indexMonth) => {

      let valueTotal = (dataAllSupply[dataMonth.dataField] ? (dataAllSupply[dataMonth.dataField]) : 0);
      dataRowTotalSupply.push(valueTotal);

    });
    let titleTotalSupply = worksheet.addRow(dataRowTotalSupply);
    const rowNumTotalSupply = titleTotalSupply['_number'];
    worksheet.mergeCells('A'+rowNumTotalSupply+':D'+rowNumTotalSupply);

    titleTotalSupply.eachCell((cell, number) => {
      cell.font = {
        bold: true
      };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thick' }}
      if(number < 2){
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
      }
    })

    // Demand form Merge Allo

    worksheet.addRow(['']);

    const headerDemand = [];

    headerDemand.push('Demand','','','')
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

    let c3ImportAllo = _.orderBy(_.filter(_.cloneDeep(mergeAlloC3LpgList),{productionGroup: 'dataListC3Import'}),['rowOrder'],['ASC']);
    const c3ImportAlloGroupby = _.groupBy(c3ImportAllo, (item) => {
      return [item['source'], item['demand'], item['deliveryPoint']];
    });

    console.log('c3ImportAlloGroupby',c3ImportAlloGroupby);

    let dataRowC3Import = ['C3 LPG (KT/Month)'];

    _.each(c3ImportAlloGroupby, (data,index) => {
      var nameArr = index.split(',');
      dataRowC3Import.push(nameArr[0]);
      dataRowC3Import.push(nameArr[1]);
      dataRowC3Import.push(nameArr[2]);

      _.each(listMonth, (dataMonth,indexMonth) => {
        const findGB = _.find(data, x => {
          return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
        });
        dataRowC3Import.push((findGB?.value ? findGB?.value : 0));
      });

      let rowDataC3Import = worksheet.addRow(dataRowC3Import);
      dataRowC3Import = [''];
    });

    let NewBalance = _.orderBy(_.filter(_.cloneDeep(mergeAlloC3LpgList),{productionGroup: 'dataListNewBalance'}),['rowOrder'],['ASC']);

    // console.log('NewBalance',NewBalance);

    let demandAllo = _.orderBy(_.filter(_.cloneDeep(mergeAlloC3LpgList),{productionGroup: 'dataListDemand'}),['ASC']);
    const demandAllobyCustomerType = _.groupBy(demandAllo, 'customerType');

    _.each(demandAllobyCustomerType, (data,index) => {
      let dataRow = [index];

      if(index == 'Petro'){
        let dataMergeNewBalance = {
          ...data,
          ...NewBalance
        }

        data = dataMergeNewBalance;
      }

      const dataGroupby = _.groupBy(data, (item) => {
        return [item['source'], item['demand'], item['deliveryPoint']];
      });

      console.log(index,dataGroupby);

      _.each(dataGroupby, (dataGB,indexGB) => {
        var nameArr = indexGB.split(',');
        dataRow.push(nameArr[0]);
        dataRow.push(nameArr[1]);
        dataRow.push(nameArr[2]);
        // console.log('dataGB',dataGB);
        _.each(listMonth, (dataMonth,indexMonth) => {
          const findGB = _.find(dataGB, x => {
            return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
          });
          dataRow.push((findGB?.value ? findGB?.value : 0));
        });

        let rowData = worksheet.addRow(dataRow);
        dataRow = [''];
      });
    });

    
    
  }

  daysInMonth (month, year) {
    return new Date(year, month, 0).getDate()
  }

}
