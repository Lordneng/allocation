import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { forkJoin, Observable } from 'rxjs';
import { AbilityRefineryService } from 'src/app/service/ability-refinery.service';
import { AbilityPlanKhmService } from 'src/app/service/ability-plan-khm.service';
import { GlobalVariableService } from 'src/app/service/global-variable.service';

@Component({
  selector: 'app-ability-report-inform',
  templateUrl: './ability-report.component.html',
  styleUrls: ['./ability-report.component.css'],
})
export class AbilityReportInformComponent implements OnInit {

  dynamicColumns: any[] = [];
  cellTemplate = 'cellTemplate';
  m7version: any;
  listMonth = [];
  dataSupplier: any = [];
  dataList: any = [];
  dataListImport: any = [];

  dataTable1 = ["GSP RY","GSP KHM", "GC", "SPRC", "PTTEP(LKB)", "IRPC", "Total"];
  dataTable2 = ["All Import"];

  formatMonthName = 'MMM-yyyy';
  year: any = '2021';
  inform_ability_total:any = [];
  @Input() numberBoxDigi = 0;
  @Input() month: any = 1;

  @ViewChild('dataGridAbility', { static: false }) dataGridAbility: DxDataGridComponent;

  constructor(
    private loaderService: NgxSpinnerService,
    private abilityRefineryService: AbilityRefineryService,
    private abilityPlanKhmService: AbilityPlanKhmService,
    private globalVariableService: GlobalVariableService,
  ) { }

  onToolbarPreparing(e){  
    e.toolbarOptions.visible = false;  
  }  

  ngOnInit(): void {

  }

  onYearChange(
    year: any,
    month: any,
    m7version: any,
    callback?: any
  ) {

    console.log('this tab 1');
    console.log('year',year);
    console.log('month',month);
    console.log('m7version',m7version);

    this.loaderService.show();
    this.m7version = m7version;
    this.month = month;
    this.year = year;
    this.dataList = [];
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + this.month + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    dateStart = dateStart.add(1, 'M');
    for (let index = 1; index <= 12; index++) {
      const data: any = {
        year: yearStart,
        month: monthStart,
        MonthName: dateStart.format(this.formatMonthName),
        visible: true,
      };
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'ability',
      code: 'ability',
      caption: 'LPG Availability (KT)',
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left',
    });
    _.each(this.listMonth, (item) => {
      this.dynamicColumns.push({
        dataField: 'M' + item.month + item.year,
        code: item.month + item.year,
        caption: item.MonthName,
        cellTemplate: this.cellTemplate
      });
    });

    this.retrieveDataSupplier().subscribe((res) => {
      console.log('Res Data Supplier :: ', res);
      this.dataSupplier.abilityRefinery = res[0];
      this.dataSupplier.abilityKHM = res[1];
      this.dataSupplier.globalVariable = res[2];
      this.dataSupplier.abilityPlanKhmVersion = res[3];
      this.dataSupplier.abilityRefineryVersion = res[4];
      this.setDataAbility();
      if (callback) {
        callback();
      }
    });

    this.loaderService.hide();
  }

  retrieveDataSupplier(): Observable<any> {

    let abilityRefineryVersionList: any = [];

    if(this.m7version?.abilityRefineryVersionId){
      const refineryParam = {
        month: this.month,
        year: this.year,
        version: this.m7version?.abilityRefineryVersionId,
        supplier: ["PTTGC's Jetty", 'SPRC', 'GC', 'PTTEP(LKB)'],
      };
      abilityRefineryVersionList = this.abilityRefineryService.getSupplier(refineryParam);
    }

    let abilityKHMVersionList: any = [];

    if(this.m7version?.abilityPlanKhmVersionId){
      const planKhmParam = {
        month: this.month,
        year: this.year,
        version: this.m7version?.abilityPlanKhmVersionId,
        supplier: ['LPG'],
      };
      abilityKHMVersionList = this.abilityPlanKhmService.getSupplier(planKhmParam);
    }

    const globalVariable = this.globalVariableService.getList();

    const abilityPlanKhmVersion = this.abilityPlanKhmService.getVersionByID(this.m7version?.abilityPlanKhmVersionId);
    const abilityRefineryVersion = this.abilityRefineryService.getVersionByID(this.m7version?.abilityRefineryVersionId);

    return forkJoin([abilityRefineryVersionList, abilityKHMVersionList, globalVariable, abilityPlanKhmVersion, abilityRefineryVersion]);
  }

  setDataAbility() {
    this.dataList = [];
    this.dataListImport = [];
    const dataAbilityRefinery = this.dataSupplier.abilityRefinery;
    const dataAbilityKHM = this.dataSupplier.abilityKHM;

    this.inform_ability_total = this.dataSupplier.globalVariable.find((obj) => {
      return obj.variable == "inform_ability_total";
    });

    // Table 1
    _.each(this.dataTable1, (data,index) => {
      const dataList = { id: index, ability: data };
      _.each(this.listMonth, (item) => {
        if (data == 'GSP KHM') {
          const findDataKHM = dataAbilityKHM.find((obj) => {
            return obj.monthValue === item.month && obj.yearValue === item.year;
          });

          if (findDataKHM) {
            dataList['M' + item.month + item.year] = findDataKHM.value;
          } else {
            dataList['M' + item.month + item.year] = 0;
          }

        } else if (data == 'Total') {

          dataList['M' + item.month + item.year] = eval(this.inform_ability_total.value);

        } else if ((data == 'GSP RY')) {

          const findDataKHM = dataAbilityKHM.find((obj) => {
            return obj.monthValue === item.month && obj.yearValue === item.year;
          });

          const findDataRefinery = dataAbilityRefinery.find((obj) => {
            return obj.monthValue === item.month && obj.yearValue === item.year;
          });

          const sumDataRefinery = dataAbilityRefinery.filter(obj =>obj.monthValue === item.month && obj.yearValue === item.year)
                        .reduce((sum, current) => sum + current.value, 0);

          dataList['M' + item.month + item.year] = (eval(this.inform_ability_total.value) - sumDataRefinery - findDataKHM.value);

        } else {
          const findDataRefinery = dataAbilityRefinery.find((obj) => {
            return obj.monthValue === item.month && obj.yearValue === item.year && obj.supplier == data;
          });

          if (findDataRefinery) {
            dataList['M' + item.month + item.year] = findDataRefinery.value;
          } else {
            dataList['M' + item.month + item.year] = 0;
          }

        }
      });

      this.dataList.push(dataList);

    });

    // Table 2
    _.each(this.dataTable2, (data,index) => {
      const dataList = { id: index, ability: data };
      _.each(this.listMonth, (item) => {

        const findDataRefinery = dataAbilityRefinery.find((obj) => {
          return obj.monthValue === item.month && obj.yearValue === item.year && obj.supplier == 'PTTEP(LKB)';
        });

        // const findListInput = this.dataInput.find((obj) => {
        //   return obj.monthValue === item.month && obj.yearValue === item.year;
        // });

        if (findDataRefinery) {
          if (data == 'BRP') {

            dataList['M' + item.month + item.year] = findDataRefinery.value;

          } else {
            dataList['M' + item.month + item.year] = findDataRefinery.value;
          }

        } else {

          if (data == 'BRP') {

            dataList['M' + item.month + item.year] = 0;

          } else {
            dataList['M' + item.month + item.year] = 0;
          }

        }

      });

      this.dataListImport.push(dataList);

    });

    this.loaderService.hide;
  }

  getDataList(){
    let dataListRes: any = [];

    dataListRes.table1 = {
      header: this.dynamicColumns,
      items: this.dataList
    }
    dataListRes.table2 = {
        header: this.dynamicColumns,
        items: this.dataListImport
    }

    return dataListRes;
  }

  gridRefresh() {
    if (this.dataGridAbility && this.dataGridAbility.instance) {
      this.dataGridAbility.instance.state(null);
    }
  }

  onRowPrepared(e) {  

    // console.log('onRowPrepared',e);
    
    if (e.rowType == 'data' && e.dataIndex%2 == 0) {  
      // e.rowElement.style.fontWeight = "bolder";
      e.rowElement.style.backgroundColor = '#FFFDE7';
    }

    if (e.rowType == 'data' && e.data.ability == 'Total') {  
      e.rowElement.style.fontWeight = "bolder";
    }

  }

  onCellPrepared(e) {

    if (e.rowType == 'data' && e.column.code == 'ability') {  
      e.cellElement.style.fontWeight = "bolder";
    } 

  }
}
