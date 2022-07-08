import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { OptimizationsService } from '../../service/optimizations.service';
import { EthanePlanningReportService } from '../../service/ethane-planning-report.service'
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-ethane-planning',
  templateUrl: './ethane-planning.component.html',
  styleUrls: ['./ethane-planning.component.css']
})
export class EthanePlanningComponent implements OnInit {

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

  optimizeVersionPlanId: any = '';
  optimizeVersionEstimateId: any = '';
  optimizeMergeAlloVersionPlanList: any = [];
  optimizeMergeAlloVersionEstimateList: any = [];
  optimizePlanVersion: any = {};
  optimizeEstimateVersion: any = '';

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(
    private sidebarService: SidebarService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private optimizationsService: OptimizationsService,
    private ethanePlannigReportService: EthanePlanningReportService,
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
    const orDemandPlanVersionList = this.optimizationsService.getVersion(this.year, false, false);
    return forkJoin([orDemandPlanVersionList]);
  }

  getDataForExportExcel(month: any, year: any, optimizationVersionEstimateId: any, optimizationVersionPlanId: any): Observable<any> {
    const dataExportExcel = this.ethanePlannigReportService.getList(month, year, optimizationVersionEstimateId, optimizationVersionPlanId);
    return forkJoin([dataExportExcel]);
  }

  yearChange() {
    let dateStart = moment(this.year + '-' + this.month + '-01');

    this.retrieveMasterData().subscribe((res) => {
      this.optimizeMergeAlloVersionPlanList = res[0];
      this.optimizeMergeAlloVersionEstimateList = res[0];
    });
  }

  onAcceptOptimizePlan(evevt: any, callback?: any) {
    
    if(this.optimizeVersionPlanId){

      this.optimizePlanVersion = this.optimizeMergeAlloVersionPlanList.find((obj) => {
        return obj.id == this.optimizeVersionPlanId;
      });

      this.yearChange();
    }
  }

  onAcceptOptimizeEstimate(evevt: any, callback?: any) {
    if(this.optimizeVersionEstimateId){

      this.optimizeEstimateVersion = this.optimizeMergeAlloVersionEstimateList.find((obj) => {
        return obj.id == this.optimizeVersionEstimateId;
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
    let titleName = 'แผนการผลิตอีเทน ' + moment(this.date).locale('th').add(543,'y').format('MMMM') + '.xlsx';
    
    this.getDataForExportExcel(this.month, this.year, this.optimizeVersionEstimateId, this.optimizeVersionPlanId).subscribe((res) => {
      const excelData = res[0];

      this.workbook = new Workbook();
      this.workbook.calcProperties.fullCalcOnLoad = true;
      
      this.createWorkSheetMonthly(excelData)

      let monthlyData = this.getDailyMonth();

      for(let index = 0; index < monthlyData.length; index++ ){        
        if(index === 0) {
          this.createDailyWorkSheet(excelData, true, monthlyData[index].Year, monthlyData[index].Month);
        } else {
          this.createDailyWorkSheet(excelData, false, monthlyData[index].Year, monthlyData[index].Month);
        }
      }

      this.workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, titleName);
        this.loaderService.hide();
      });

    })
    
  }

  createWorkSheetMonthly(excelData: any ){
    let worksheet = this.workbook.addWorksheet('C2 Monthly');
    
    let titleMainStartDate = moment(this.date).locale('th').add(1,'M').add(543,'y').format('MMM YY');
    let titleMainEndDate = moment(this.date).locale('th').add(544,'y').format('MMM YY');
    const titleMain = 'แผนการผลิตอีเทนของโรงแยกก๊าซ เดือน ' + titleMainStartDate + ' - ' + titleMainEndDate;
    let headerMonth = this.getHeaderMonthly();
    let titleRow = [];

    for(let index = 0; index < headerMonth.length; index++ ){
      titleRow.push(headerMonth[index].MonthName);
    }

    worksheet.addRow([titleMain]);
    let rowLowCo2 = ['Low CO2']
    let rowHighCo2 = ['High CO2']
    
    worksheet.addRow([])
    worksheet.addRow([])
    worksheet.mergeCells('B4:C4');
    const rowHeader = worksheet.getRow(4);
    let indexHeader = 2;
    
    for(let indexTitle = 0; indexTitle < titleRow.length; indexTitle++){
      rowHeader.getCell(indexHeader).value = titleRow[indexTitle];

      if(indexHeader === 2){
        indexHeader = 4;
      }else {
        indexHeader++;
      }   
    }

    rowHeader.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA000' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    for(let rowDataIndex = 0; rowDataIndex < headerMonth.length; rowDataIndex++){
      const month = headerMonth[rowDataIndex];
      let intValue = 0;
      if(rowDataIndex === 0){
        const planLowData = _.find(excelData.monthly.plan, (itemProduct) => {
          return itemProduct.productionPlant === 'Low CO2' && 
          itemProduct.yearValue === month.Year &&
          itemProduct.monthValue === month.Month;
        });

        if(planLowData){
          rowLowCo2.push(planLowData.value)
        } else {
          rowLowCo2.push('0')
        }

        const estimateLowData = _.find(excelData.monthly.estimate, (itemProduct) => {
          return itemProduct.productionPlant === 'Low CO2' && 
          itemProduct.yearValue === month.Year &&
          itemProduct.monthValue === month.Month;
        });

        if(estimateLowData){
          rowLowCo2.push(planLowData.value)
        } else {
          rowLowCo2.push('0')
        }

        const planHighData = _.find(excelData.monthly.plan, (itemProduct) => {
          return itemProduct.productionPlant === 'High CO2' && 
          itemProduct.yearValue === month.Year &&
          itemProduct.monthValue === month.Month;
        });

        if(planHighData){
          rowHighCo2.push(planHighData.value)
        } else {
          rowHighCo2.push('0');
        }

        const estimateHighData = _.find(excelData.monthly.estimate, (itemProduct) => {
          return itemProduct.productionPlant === 'High CO2' && 
          itemProduct.yearValue === month.Year &&
          itemProduct.monthValue === month.Month;
        });

        if(estimateHighData){
          rowHighCo2.push(estimateHighData.value)
        } else {
          rowHighCo2.push('0');
        }

      } else {
        const lowData = _.find(excelData.monthly.month, (itemProduct) => {
          return itemProduct.productionPlant === 'Low CO2' && 
          itemProduct.yearValue === month.Year &&
          itemProduct.monthValue === month.Month;
        });

        if(lowData){
          rowLowCo2.push(lowData.value)
        } else {
          rowLowCo2.push('0')
        }

        const highData = _.find(excelData.monthly.month, (itemProduct) => {
          return itemProduct.productionPlant === 'High CO2' && 
          itemProduct.yearValue === month.Year &&
          itemProduct.monthValue === month.Month;
        });

        if(highData){
          rowHighCo2.push(highData.value)
        } else {
          rowHighCo2.push('0');
        }
      }      
    }
    
    let sheetRowLowCo2 = worksheet.addRow(rowLowCo2);
    sheetRowLowCo2.eachCell((cell, number) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    let sheetRowHighCo2 = worksheet.addRow(rowHighCo2);
    sheetRowHighCo2.eachCell((cell, number) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    const columnMonth = []
    worksheet.getCell('A7').value = 'Total';
    
    for (var i = 66; i <= 79; i++) {
      const alphaText = String.fromCharCode(i);
      const columnAlpha = alphaText + '7'
      worksheet.getCell(columnAlpha).value = { formula: `SUM(${alphaText}5:${alphaText}6)`, date1904: false};
      columnMonth.push(alphaText)
    }

    let sheetTotolRow = worksheet.getRow(7);
    sheetTotolRow.eachCell((cell, number) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.getCell('A8').value = 'Ton/hr.';
    let indexTonHr = 2;
    
    for(let rowTonHrIndex = 0; rowTonHrIndex < headerMonth.length; rowTonHrIndex++){
      const monthTon = headerMonth[rowTonHrIndex];    
      const monthTonHr = moment(monthTon.Year + '-' + monthTon.Month + '-01');
      const totalDay = monthTonHr.daysInMonth();

      if(rowTonHrIndex === 0){
        const columnPlan = columnMonth[0]
        const columnEstimate = columnMonth[1];
        worksheet.getCell(`${columnPlan}8`).value = { formula: `=(${columnPlan}7/${totalDay}6/24)`, date1904: false};
        worksheet.getCell(`${columnEstimate}8`).value = { formula: `=(${columnEstimate}7/${totalDay}/24)`, date1904: false};
      } else {
        const columnTonMonth = columnMonth[indexTonHr]
        worksheet.getCell(`${columnTonMonth}8`).value = { formula: `=(${columnTonMonth}7/${totalDay}/24)`, date1904: false};
        indexTonHr++;
      }
    }

    let sheetTonHrRow = worksheet.getRow(8);
    sheetTonHrRow.eachCell((cell, number) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.getCell('A10').value = excelData.monthly.remark;
  }

  createDailyWorkSheet(excelData: any, isEstimateMonth: any, year: any, month: any){

    let sheetName: string = "";
    let monthData = moment(year + '-' + month + '-01');
    let row = 3;
    const montyName: string = moment(year + '-' + month + '-01').format("MMM YY");
    const totalDay: number = moment(year + '-' + month + '-01').daysInMonth();


    if(isEstimateMonth){
      sheetName = "C2 Daily Est." + montyName
    } else {
      sheetName = "C2 Daily_" + montyName
    }


    let worksheet = this.workbook.addWorksheet(sheetName);

    worksheet.getCell('B2').value = 'Low CO2';
    worksheet.getCell('C2').value = 'High CO2';
    worksheet.getCell('D2').value = 'Total';
    worksheet.getCell('E2').value = 'Ton/Hr.';

    let sheetHeaderRow = worksheet.getRow(2);
    sheetHeaderRow.eachCell((cell, number) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    for(let dateOfMonth: number = 1; dateOfMonth <= totalDay; dateOfMonth++) {

      const lowData = _.find(excelData.daily, (itemProduct) => {
          return itemProduct.productionPlant === 'low CO2' && 
          moment(itemProduct.date).format('YYYY-MM-DD') === monthData.format('YYYY-MM-DD')
        });

      const highData = _.find(excelData.daily, (itemProduct) => {
          return itemProduct.productionPlant === 'High CO2' && 
          moment(itemProduct.date).format('YYYY-MM-DD') === monthData.format('YYYY-MM-DD')
        });

      worksheet.getCell(`A${row}`).value = monthData.format('DD-MMM');

      if(lowData){
        worksheet.getCell(`B${row}`).value = lowData['value'];
      } else {
        worksheet.getCell(`B${row}`).value = 0;
      }

      if(highData){
        worksheet.getCell(`C${row}`).value = highData['value'];
      } else {
        worksheet.getCell(`C${row}`).value = 0;
      }

      worksheet.getCell(`D${row}`).value = { formula: `=(B${row}+C${row})`, date1904: false};
      worksheet.getCell(`E${row}`).value = { formula: `=(D${row}/24)`, date1904: false};

      let sheetDataRow = worksheet.getRow(row);
      sheetDataRow.eachCell((cell, number) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });

      monthData = monthData.add(1, 'd');
      row++;
    }

    let lastRow = row;
    row = row - 1 ;
    worksheet.getCell(`B${lastRow}`).value = { formula: `=SUM(B3:B${row})`, date1904: false};
    worksheet.getCell(`C${lastRow}`).value = { formula: `=SUM(C3:C${row})`, date1904: false};
    worksheet.getCell(`D${lastRow}`).value = { formula: `=SUM(D3:D${row})`, date1904: false};
    worksheet.getCell(`E${lastRow}`).value = { formula: `=AVERAGE(E3:E${row})`, date1904: false};

    let sheetTotalRow = worksheet.getRow(lastRow);
      sheetTotalRow.eachCell((cell, number) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('MM');
    //this.yearChange();
    this.modalRef.hide();
    this.loaderService.hide();
    
 }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  getDailyMonth(){ 
    const dailyMonth = [];
    let dateStart = moment(this.date);
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();

    for (let index = 1; index <= 4; index++) {
      const monthly = _.cloneDeep(dateStart);
      const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: monthly.format('MMM YY'), date: monthly }
      dailyMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    return dailyMonth;
  }

  getHeaderMonthly(){
    const headerList = [];
    let dateStart = moment(this.date);
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const monthly = _.cloneDeep(dateStart);
      const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: monthly.locale('th').add(543,'y').format('MMMM YYYY') }
      headerList.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    return headerList;
  }
}
