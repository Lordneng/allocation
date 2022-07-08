import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, merge, Observable } from 'rxjs';
import { OptimizationsService } from '../../service/optimizations.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { SummaryReportService } from '../../service/summary-report.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  year: any;
  month: any;
  date: any;
  dateOld: any;
  yearSearch: any = '';

  modalRef: BsModalRef;
  sidebar: ISidebar;
  workbook: any = null;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };

  optimizeVersionId: any = '';
  optimizeMergeAlloVersionList: any = [];
  optimizeVersion: any = {};

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(
    private sidebarService: SidebarService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private summaryReportService: SummaryReportService,
    private optimizationsService: OptimizationsService,
  ) { 
      this.date = moment();
      this.dateOld = this.date;
      this.year = moment().year();
      this.month = moment().month() + 1;
      this.yearSearch = this.year;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.yearChange();
    }, 500);
  }

  onYearChange($event) {
    console.log('$event', $event)
    this.year = moment($event.value).format('yyyy');
    this.yearChange();
  }

  retrieveMasterData(): Observable<any> {
    const orDemandPlanVersionList = this.optimizationsService.getMonthVersion(this.year, this.month);
    return forkJoin([orDemandPlanVersionList]);
  }

  yearChange() {
    this.retrieveMasterData().subscribe((res) => {
      this.optimizeMergeAlloVersionList = res[0];
    });
  }

  onAcceptOptimizePlan(evevt: any, callback?: any) {
    
    if(this.optimizeVersionId){

      this.optimizeVersion = this.optimizeMergeAlloVersionList.find((obj) => {
        return obj.id == this.optimizeVersionId;
      });

      this.yearChange();
    }
  }

  menuButtonClick = (
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string
  ) => {
    console.log('ee', e);
    if (e) {
      e.stopPropagation();
    }

  setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems
    );
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getContractData(optimizationVersionId: any): Observable<any> {
    const contractList = this.summaryReportService.getList(optimizationVersionId);
    return forkJoin([contractList]);
  }

  onExportExcel($event: any) {
    this.loaderService.show();
    let titleName = 'Cal_Margin';
    this.workbook = new Workbook();
    this.workbook.calcProperties.fullCalcOnLoad = true;

    this.getContractData(this.optimizeVersionId).subscribe(res => {
      const report = res[0];
      
      this.createSheet(report.year, report.month, _.cloneDeep(report.volumeKT), 'Volume (KT)', 'Volume', 'KT');
      this.createSheet(report.year, report.month, _.cloneDeep(report.revenue), 'Revenue (MB)', 'Revenue', 'MB');    
      this.createSheet(report.year, report.month, _.cloneDeep(report.margin), 'Margin (MB)', 'Margin', 'MB');    
      this.createWavgSheet(report.year, report.month,'Full cost W.avg.', 'Cost w.avg.');
      this.createWavgSheet(report.year, report.month,'Selling Price W.avg.', 'Selling Price w.avg.');

      this.workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, titleName);
        this.loaderService.hide();
      });
    })

  }

  createSheet(year: any, month: any,contractList: any[], sheetName: string, headerTitle: string, unitName: string){
    let worksheet = this.workbook.addWorksheet(sheetName);
    const headerMonth = this.getHeaderMonthly(year, month);
    const alphaHeader = this.getHeaderDataColumn();

    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = headerTitle;
    let row = 2;
    let contracts = _.uniqBy(_.cloneDeep(contractList), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());
    contracts = _.orderBy(contracts, ['productName', 'customerPlantName'], ['asc', 'asc']);
    let indexContract = 0;
    let startRowCalculate = 0;
    let endRowCalculate = 0;

    contracts = _.groupBy(contracts, 'productName');

    for (const contract in contracts) {
      const products = contracts[contract];
      worksheet.getCell(`A${row}`).value = contract;

      if(indexContract === 0){
        worksheet.getCell(`B${row}`).value = ' ';
        worksheet.getCell(`C${row}`).value = ' ';
        worksheet.getCell(`D${row}`).value = ' ';
        for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
          const columnText = alphaHeader[indexMonth];
          worksheet.getCell(`${columnText}${row}`).value = ' ';
        }
      } else {
        worksheet.getCell(`B${row}`).value = ' ';
        worksheet.getCell(`C${row}`).value = ' ';
        worksheet.getCell(`D${row}`).value = ' ';
        for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
          const columnText = alphaHeader[indexMonth];
          worksheet.getCell(`${columnText}${row}`).value = { formula: `=SUM(${columnText}${startRowCalculate}:${columnText}${endRowCalculate})`, date1904: false};;
        }
      }
   
      const rowProductHeader = worksheet.getRow(row);
      rowProductHeader.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFB49' }
        }      
      });
      row = row + 1;
      const mergeRow = row + 1;

      worksheet.mergeCells(`A${row}:A${mergeRow}`);
      worksheet.mergeCells(`B${row}:B${mergeRow}`);
      worksheet.mergeCells(`C${row}:C${mergeRow}`);
      worksheet.mergeCells(`D${row}:D${mergeRow}`);    
      
      worksheet.getCell(`A${row}`).value = 'Unit';
      worksheet.getCell(`B${row}`).value = 'Source';
      worksheet.getCell(`C${row}`).value = 'Demand';
      worksheet.getCell(`D${row}`).value = 'Delivery point';
  
      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        worksheet.getCell(`${columnText}${row}`).value = ' ';
        worksheet.getCell(`${columnText}${mergeRow}`).value = headerMonth[indexMonth].MonthName;
      }  

      const setRowHeader = worksheet.getRow(row);
      setRowHeader.eachCell((cell, number) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DEE2E6' }
        } 
      });

      const monthRowHeader = worksheet.getRow(mergeRow);
      monthRowHeader.eachCell((cell, number) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DEE2E6' }
        } 
      });

      row = row + 2;
      startRowCalculate = row;

      for(let indexProduct = 0; indexProduct < products.length; indexProduct++){
        worksheet.getCell(`A${row}`).value = unitName;
        worksheet.getCell(`B${row}`).value = products[indexProduct].sourceName;
        worksheet.getCell(`C${row}`).value = products[indexProduct].demandName;
        worksheet.getCell(`D${row}`).value = products[indexProduct].deliveryName;

        for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
          const columnText = alphaHeader[indexMonth];
          let valueData = 0;

          let reportData = _.find(contractList, (item) => {
            return item.yearValue == headerMonth[indexMonth].Year &&
            item.monthValue == headerMonth[indexMonth].Month &&
            item.sourceName == products[indexProduct].sourceName &&
            item.demandName == products[indexProduct].demandName &&
            item.deliveryName == products[indexProduct].deliveryName;
          })

          if(reportData){
            valueData = reportData.value ? reportData.value : 0;
          }

          worksheet.getCell(`${columnText}${row}`).value = valueData;
          const productDataRow = worksheet.getRow(row);
          productDataRow.eachCell((cell, number) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          });
        }
        row++;
      }

      endRowCalculate = row - 1;

      indexContract++;
    }
  }

  createWavgSheet(year: any, month: any,sheetName: string, unitName: string){
    const headerMonth = this.getHeaderMonthly(year, month);
    const alphaHeader = this.getHeaderDataColumn();
    let worksheet = this.workbook.addWorksheet(sheetName);
    let columnHeader = [
      'C2 GC',
      'C2 All',
      'C3',
      'LPG',
      'LPG - GCCost w.avg. LPG Petro ($/TON)',
      'Cost w.avg. LPG Domestic ($/TON)',
      'Cost w.avg. LPG Domestic Exclude Import ($/TON)',
      'NGL',
      'C5',
      'All Product'
    ]
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 20;

    for(let row = 1; row <= 10; row++){
      const rowValue = worksheet.getRow(row);
      

      worksheet.getCell(`D${row}`).value = columnHeader[row - 1];
      

      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        worksheet.getCell(`${columnText}${row}`).value = 9;
      }

      if((row >= 1 && row <= 4) || (row >= 8 && row <= 9)){
        worksheet.getCell(`C${row}`).value = unitName;       
        worksheet.getCell(`C${row}`).alignment = { vertical: 'middle', horizontal: 'right' };
        worksheet.getCell(`D${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
        rowValue.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E2EFDA' }
          }
        });
      } else if(row >= 5 && row <= 7){  
        worksheet.getCell(`D${row}`).alignment = { vertical: 'middle', horizontal: 'right' };
        worksheet.getCell(`C${row}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E7E6E6' }
        } ;  
        rowValue.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E7E6E6' }
          }
        }); 
      } else if(row === 10){
        worksheet.getCell(`C${row}`).value = unitName;   
        worksheet.getCell(`C${row}`).alignment = { vertical: 'middle', horizontal: 'right' };    
        worksheet.getCell(`D${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
    }
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('MM');
    this.yearChange();
    this.modalRef.hide();
    this.loaderService.hide();
 }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  getHeaderMonthly(year: any, month: any,){
    const headerList = [];
    let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index <= 12; index++) {
      const monthly = _.cloneDeep(dateStart);
      const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: monthly.add(543,'y').format('MMM-YY') }
      headerList.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    return headerList;
  }

  getHeaderDataColumn(){
    const columnMonth = []
    
    for (var i = 69; i <= 80; i++) {
      const alphaText = String.fromCharCode(i);
      columnMonth.push(alphaText)
    }

    return columnMonth;
  }

}
