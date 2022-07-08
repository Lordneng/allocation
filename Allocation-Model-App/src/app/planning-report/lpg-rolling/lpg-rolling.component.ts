import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { OptimizationsService } from '../../service/optimizations.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { LpgRollingReportService } from '../../service/lpg-rolling-report.service';

@Component({
  selector: 'app-lpg-rolling',
  templateUrl: './lpg-rolling.component.html',
  styleUrls: ['./lpg-rolling.component.css']
})
export class LpgRollingComponent implements OnInit {

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
    private lpgRollingservice: LpgRollingReportService,
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

  onExportExcel($event: any) {
    this.loaderService.show();
    let sheetName = 'lpg plan rolling'
    this.workbook = new Workbook();
    this.workbook.calcProperties.fullCalcOnLoad = true;

    this.getContractData().subscribe(res => {
      const report = res[0];
      
      this.createFirstSheet(report);
      this.createSecondSheet();

      this.workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, sheetName);
        this.loaderService.hide();
      });
    })

    // this.createSecondSheet();

    // this.workbook.xlsx.writeBuffer().then((data) => {
    //   let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   fs.saveAs(blob, sheetName);
    //   this.loaderService.hide();
    // });

  }

  getContractData(): Observable<any> {
    const contractList = this.lpgRollingservice.getList(this.optimizeVersionId);
    return forkJoin([contractList]);
  }

  createFirstSheet(report: any){
    const headerMonth = this.getHeaderMonthly();
    const alphaHeader = this.getHeaderDataColumn();
    let titleName = 'demand supply balance';
    let worksheet = this.workbook.addWorksheet(titleName);
    let row = 3;
    let dateExport = 'As of ' + moment().format('DD MMM YYYY');
    let columnSupply = [dateExport,
      'Total Supply (KT)',
      'Supply',
      'GSP RY',
      'GSP 1',
      'GSP 2',
      'GSP 3',
      'GSP 4',
      'GSP 5',
      'GSP 6',
      'IRPC',
      'GC (เฉพาะส่วนที่ส่งให้ GSP)',
      'SPRC',
      'PTTEP',
      'C3 Import Cargo Split to SCG',
      'C3 Import reversed pipeline to SCG',
      'C3 Import reversed pipeline to GC',
      'Import Cargo to MT'
    ]
    let columnDemand = [
      'Total Demand (KT)',
      'Demand',
      'Petrochem Demand (Feedstock)',
      '   Matra7 Feedstock  (GC, SCG)',
      '   Non-Matra7 Feedstock (HMC,PTTAC)',
      'Domestic Demand'
    ]

    let columnClosing = [
      'C3/LPG Closing Inventory (KT)',
      'C3 Closing Inventory (KT)',
      'LPG Closing Inventory (KT)'
    ]

    for(let supplyIndex = 0; supplyIndex < columnSupply.length; supplyIndex++){
      worksheet.mergeCells(`B${row}:D${row}`);
      worksheet.getCell(`B${row}`).value = columnSupply[supplyIndex];

      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        if(supplyIndex === 0){
          worksheet.getCell(`${columnText}${row}`).value = headerMonth[indexMonth].MonthName;
        } else if(supplyIndex === 2){
          worksheet.getCell(`${columnText}${row}`).value = ' ';
        } else {
          worksheet.getCell(`${columnText}${row}`).value = 0;
        }
      }

      if(row === 3) {
        const rowProductHeader = worksheet.getRow(row);
          rowProductHeader.eachCell((cell, number) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
      } else if(row === 4) {
        const rowProductHeader = worksheet.getRow(row);
            rowProductHeader.eachCell((cell, number) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFB49' }                
              }
              cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          });
      } else if(row === 5) {
        const rowSupplyHeaderData = worksheet.getRow(row);
        rowSupplyHeaderData.eachCell((cell, number) => {
              cell.border = { left: { style: 'thin' }, right: { style: 'thin' } }
          });
      } else if(row >= 6 && row <= 16) {
        worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
        const rowSupplyData = worksheet.getRow(row);
        rowSupplyData.eachCell((cell, number) => {
              cell.border = { left: { style: 'thin' }, right: { style: 'thin' } }
          });
      } else if(row === 17) {
        worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`B${row}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'BAF5F9' }                
        }
        const rowSupplyData = worksheet.getRow(row);
        rowSupplyData.eachCell((cell, number) => {
            cell.border = {top: { style: 'thin' } , left: { style: 'thin' }, right: { style: 'thin' } }
          });
      } 
      else if(row >= 18 && row <= 20) {
        worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`B${row}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'BAF5F9' }                
        }

        const rowSupplyData = worksheet.getRow(row);
        rowSupplyData.eachCell((cell, number) => {
            cell.border = { left: { style: 'thin' }, right: { style: 'thin' } }
          });
      } 

      row++;
    }
    

    for(let demandIndex = 0; demandIndex < columnDemand.length; demandIndex++){
      worksheet.mergeCells(`B${row}:D${row}`);
      worksheet.getCell(`B${row}`).value = columnDemand[demandIndex];

      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        if(demandIndex === 1){
          worksheet.getCell(`${columnText}${row}`).value = ' ';
        } else {
          worksheet.getCell(`${columnText}${row}`).value = 0;
        }
      }

      if(row === 21)  {
        const rowTotalDemandData = worksheet.getRow(row);
        rowTotalDemandData.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFB49' }                
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
      } else if(row === 22) {
        const rowDemandData = worksheet.getRow(row);
        rowDemandData.eachCell((cell, number) => {
              cell.border = { left: { style: 'thin' }, right: { style: 'thin' } }
          });
      } else if(row >= 23 && row <= 25) {
        
        const rowSupplyData = worksheet.getRow(row);
        rowSupplyData.eachCell((cell, number) => {
              cell.border = { left: { style: 'thin' }, right: { style: 'thin' } }
          });
      } else if(row === 26) {
        const rowDomesticHeader = worksheet.getRow(row);
        rowDomesticHeader.eachCell((cell, number) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
      }

      row++;
    }
    
    worksheet.getCell(`B${row}`).value = 'Source';
    worksheet.getCell(`C${row}`).value = 'Demand';
    worksheet.getCell(`D${row}`).value = 'Delivery point';

    for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
      const columnText = alphaHeader[indexMonth];
      worksheet.getCell(`${columnText}${row}`).value = headerMonth[indexMonth].MonthName;
    }

    if(row === 27) {
      const rowDomesticHeader = worksheet.getRow(row);
      rowDomesticHeader.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    }

    row++;

    let contracts = _.uniqBy(_.cloneDeep(report.domesticDemand), v => [v.source, v.demand, v.deliveryPoint].join());
    contracts = _.orderBy(contracts, ['source', 'demand'], ['asc', 'asc']);

    for(let indexProduct = 0; indexProduct < contracts.length; indexProduct++){
      worksheet.getCell(`B${row}`).value = contracts[indexProduct].source;
      worksheet.getCell(`C${row}`).value = contracts[indexProduct].demand;
      worksheet.getCell(`D${row}`).value = contracts[indexProduct].deliveryPoint;

      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        let valueData = 0;

          let reportData = _.find(report.domesticDemand, (item) => {
            return item.yearValue == headerMonth[indexMonth].Year &&
            item.monthValue == headerMonth[indexMonth].Month &&
            item.source == contracts[indexProduct].source &&
            item.demand == contracts[indexProduct].demand &&
            item.deliveryPoint == contracts[indexProduct].deliveryPoint;
          })

          if(reportData){
            valueData = reportData.value ? reportData.value : 0;
          }
        worksheet.getCell(`${columnText}${row}`).value = valueData;
      }
      const rowDomesticData = worksheet.getRow(row);
      rowDomesticData.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });

      row++;
    }

    for(let closingIndex = 0; closingIndex < columnClosing.length; closingIndex++){
      worksheet.mergeCells(`B${row}:D${row}`);
      worksheet.getCell(`B${row}`).value = columnClosing[closingIndex];

      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        worksheet.getCell(`${columnText}${row}`).value = 6;
      }

      const rowClosingData = worksheet.getRow(row);
      rowClosingData.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFB49' }                
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });

      row++;
    }
    worksheet.getCell(`B${row}`).value = report.rayongRemark;

    row++;
    worksheet.getCell(`B${row}`).value = report.khmRemark;

  }

  createSecondSheet(){
    const headerMonth = this.getHeaderMonthly();
    const alphaHeader = this.getHeaderDataColumn();
    let titleName = 'seperate';
    let worksheet = this.workbook.addWorksheet(titleName);
    let row = 2;
    let m7 = [
      'C3/LPG (KT)',
      'Total C3/LPG to PTTGC',
      'Total C3 to SCG',
      'C3 - GC',
      'LPG - GC',
      'C3 - SCG',
      'Sub C3 - MOC',
      'LPG - ROC',
      'LPG - MOC',
      'LPG - SCG'
    ]
    let nonM7 = [
      'C3 - HMC',
      'C3 - PTTAC',
      'C3 - PTTAC (SPOT)'
    ]

    let m7Import = [
      'C3 Import Cargo Split - SCG',
      'C3 Import Cargo Split - MOC',
      'C3 Import reversed pipeline - SCG',
      'C3 Import reversed pipeline - MOC',
      'C3 Import reversed pipeline - GC'
    ]

    worksheet.getColumn('B').width = 30;
    worksheet.mergeCells(`A2:B2`);
    worksheet.mergeCells(`A3:A11`);
    worksheet.mergeCells(`A12:A14`);

    
    worksheet.getCell(`A3`).value = 'M.7';
    worksheet.getCell(`A3`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`A12`).value = 'Non M.7';
    worksheet.getCell(`A12`).alignment = { vertical: 'middle', horizontal: 'center' };

    for(let m7Index = 0; m7Index < m7.length; m7Index++){     
      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        if(m7Index === 0){
          worksheet.getCell(`A${row}`).value =  m7[m7Index];
          worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };   
          worksheet.getCell(`${columnText}${row}`).value = headerMonth[indexMonth].MonthName;
          worksheet.getCell(`${columnText}${row}`).alignment = { vertical: 'middle', horizontal: 'center' };  
        } else {
          worksheet.getCell(`B${row}`).value = m7[m7Index]
          worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };  
          worksheet.getCell(`${columnText}${row}`).value = 8;
        }
      }  

      row++;
    }

    for(let nonM7Index = 0; nonM7Index < nonM7.length; nonM7Index++){     
      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        worksheet.getCell(`B${row}`).value = nonM7[nonM7Index];
        worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };   
        worksheet.getCell(`${columnText}${row}`).value = 8;
      }  

      row++;
    }

    worksheet.mergeCells(`A${row}:B${row}`);

    for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
      const columnText = alphaHeader[indexMonth];
      worksheet.getCell(`${columnText}${row}`).value = headerMonth[indexMonth].MonthName;
      worksheet.getCell(`${columnText}${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
    } 

    row++;

    for(let m7ImportIndex = 0; m7ImportIndex < m7Import.length; m7ImportIndex++){     
      for(let indexMonth = 0; indexMonth < headerMonth.length; indexMonth++){
        const columnText = alphaHeader[indexMonth];
        worksheet.getCell(`A${row}`).value = 'M.7';
        worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };  
        worksheet.getCell(`B${row}`).value = m7Import[m7ImportIndex];
        worksheet.getCell(`B${row}`).alignment = { vertical: 'middle', horizontal: 'center' };  
        worksheet.getCell(`${columnText}${row}`).value = 8;
      }  

      row++;
    }
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).year();
    this.month = moment(this.date).month() + 1;
    this.yearChange();
    this.modalRef.hide();
    this.loaderService.hide();
    
 }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  getHeaderMonthly(){
    const headerList = [];
    let dateStart = moment(this.date);
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const monthly = _.cloneDeep(dateStart);
      const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: monthly.format('MMM-YY') }
      headerList.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    return headerList;
  }

  getHeaderDataColumn(){
    const columnMonth = []
    
    for (var i = 67; i <= 81; i++) {
      const alphaText = String.fromCharCode(i);
      columnMonth.push(alphaText)
    }

    return columnMonth;
  }
}
