import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-ethane-balance-report',
  templateUrl: './ethane-balance-report.component.html',
  styleUrls: ['./ethane-balance-report.component.css']
})
export class EthaneBalanceReportComponent implements OnInit {

  listProduct: any = ['GSP1','GSP2','GSP3','GSP5','ESP','GSP6','Total'];

  constructor() { }

  ngOnInit(): void {
    
  }

  getWorkSheet(workbook: Workbook, listMonth: any, dataListRayong: any, mergeAlloC2List: any){

    if(dataListRayong && listMonth && mergeAlloC2List){

      let worksheet = workbook.addWorksheet('Ethane Balance');

      const title = 'Ethane Balance';
      // Add new row
      // let titleRow = worksheet.addRow([title]);

      const header = [];

      header.push('')
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

      const dataTotal = [];
      _.each(this.listProduct, (product) => {
        const dataRow = [product];
        _.each(listMonth, (dataMonth,indexMonth) => {
          let sumAmount = 0;
          _.each(dataListRayong, (dataProduct,index) => {
            _.each(dataListRayong[index], (dataPlant,indexPlant) => {
              // console.log('indexPlant',indexPlant);
              if(indexPlant == product){
                sumAmount += (dataPlant[dataMonth.dataField] ? dataPlant[dataMonth.dataField] : 0);
              }
            });
          });

          dataRow.push(sumAmount);
        });

        let rowData = worksheet.addRow(dataRow);

        if(product == 'Total'){
          rowData.eachCell((cell, number) => {
            cell.font = {
              bold: true
            };
          });
        }

        dataTotal.push(dataRow);
      });

      // console.log('dataTotal',dataTotal);

      const dataRowTotal: any = ["Total"];

      _.each(listMonth, (dataMonth,indexMonth) => {

        let sumAmountTotal = 0;

        _.each(dataTotal, (data,Index) => {
          sumAmountTotal += data[(indexMonth+1)];
        });

        const daysInMonth = this.daysInMonth(dataMonth.month,dataMonth.year);

        // console.log(dataMonth.year + '-' + dataMonth.month, daysInMonth);

        dataRowTotal.push((sumAmountTotal*1000)/daysInMonth);
      });

      let rowDataTotal = worksheet.addRow(dataRowTotal);

      rowDataTotal.eachCell((cell, number) => {
        cell.font = {
          color: {argb: "1565C0"},
          bold: true
        };
      });


      //Add Header Row 
      let headerRowAllo = worksheet.addRow(header);
      headerRowAllo.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCBC' },
          bgColor: { argb: 'FF0000FF' }
        }
        // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });

      // ข้อมูล Demand C2 ของ GC จาก Merge Allocation ในหน่วย KT
      let GCKT = _.filter(_.cloneDeep(mergeAlloC2List), { productionGroup: "dataListGC", 'unit': "KT"});
      let dataPrductGCKT = _.groupBy(GCKT, "production" )

      // console.log('GCKT',GCKT);
      // console.log('dataPrductGCKT',dataPrductGCKT);

      let dataAllDemand = [];

      _.each(dataPrductGCKT, (data,index) => {
        const dataRow = [index];
        _.each(listMonth, (dataMonth,indexMonth) => {

          const findData = _.find(data, x => {
            return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
          });
          dataRow.push((findData?.value ? findData?.value : 0));

          // _.each(data, (dataGCKT,indexGCKT) => {
          //   if(dataGCKT.yearValue == dataMonth.year && dataGCKT.monthValue == dataMonth.month && dataGCKT.production == index){
          //     dataRow.push(dataGCKT.value);
          //   }
          // });
        });
        let rowData = worksheet.addRow(dataRow);
        dataAllDemand.push(dataRow);
      });

      // ข้อมูล Demand C2 ของ SCG จาก Merge Allocation ในหน่วย KT
      let SCGKT = _.filter(_.cloneDeep(mergeAlloC2List), { productionGroup: "dataListSCG", 'unit': "KT"});
      let dataPrductSCGKT = _.groupBy(SCGKT, "production" )

      _.each(dataPrductSCGKT, (data,index) => {
        const dataRow = [index];
        _.each(listMonth, (dataMonth,indexMonth) => {

          const findData = _.find(data, x => {
            return x.monthValue == dataMonth.month && x.yearValue == dataMonth.year
          });
          dataRow.push((findData?.value ? findData?.value : 0));
          

          // _.each(data, (dataGCKT,indexGCKT) => {
          //   if(dataGCKT.yearValue == dataMonth.year && dataGCKT.monthValue == dataMonth.month && dataGCKT.production == index){
          //     dataRow.push(dataGCKT.value);
          //   }
          // });
        });
        let rowData = worksheet.addRow(dataRow);
        dataAllDemand.push(dataRow);
      });

      // console.log('dataAllDemand',dataAllDemand);

      const dataRowTotalDemand: any = ["Total"];

      _.each(listMonth, (dataMonth,indexMonth) => {

        let sumTotal = 0;

        _.each(dataAllDemand, (data,Index) => {
          sumTotal += (data[(indexMonth+1)] ? data[(indexMonth+1)] : 0);
        });

        dataRowTotalDemand.push(sumTotal);
      });

      let rowDataTotalDemand = worksheet.addRow(dataRowTotalDemand);

      rowDataTotalDemand.eachCell((cell, number) => {
        cell.font = {
          bold: true
        };
      });

      const dataRowTotalFM: any = ["Total"];

      _.each(listMonth, (dataMonth,indexMonth) => {

        let sumTotal = 0;

        _.each(dataAllDemand, (data,Index) => {
          sumTotal += (data[(indexMonth+1)] ? data[(indexMonth+1)] : 0);
        });

        const daysInMonth = this.daysInMonth(dataMonth.month,dataMonth.year);

        // console.log(dataMonth.year + '-' + dataMonth.month, daysInMonth);

        dataRowTotalFM.push((sumTotal*1000)/daysInMonth);
      });

      let rowDataTotalFM = worksheet.addRow(dataRowTotalFM);

      rowDataTotalFM.eachCell((cell, number) => {
        cell.font = {
          color: {argb: "1565C0"},
          bold: true
        };
      });

      const dataRowTotalBalance: any = [""];

      _.each(listMonth, (dataMonth,indexMonth) => {

        let sumTotalSupply = 0;
        let sumTotalDemand = 0;

        _.each(dataTotal, (data,Index) => {
          sumTotalSupply += (data[(indexMonth+1)] ? data[(indexMonth+1)] : 0);
        });

        _.each(dataAllDemand, (data,Index) => {
          sumTotalDemand += (data[(indexMonth+1)] ? data[(indexMonth+1)] : 0);
        });

        const daysInMonth = this.daysInMonth(dataMonth.month,dataMonth.year);

        dataRowTotalBalance.push(((sumTotalSupply*1000)/daysInMonth)-((sumTotalDemand*1000)/daysInMonth));
      });

      let rowDataTotalBalance = worksheet.addRow(dataRowTotalBalance);

      rowDataTotalBalance.eachCell((cell, number) => {
        cell.font = {
          color: {argb: "D32F2F"},
          bold: true
        };
      });

    }else{

    }
    
  }

  daysInMonth (month, year) {
    return new Date(year, month, 0).getDate()
  }

}
