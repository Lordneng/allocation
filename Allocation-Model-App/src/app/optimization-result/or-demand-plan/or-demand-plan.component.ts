
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { forkJoin, Subscription } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { OrDemandPlantService } from 'src/app/service/or-demand-plan.service';
import { environment } from 'src/environments/environment';
import { OrDemandPlanVersionComponent } from './components/or-demand-plan-version/or-demand-plan-version.component';
import { OrDemandPlanDataGridInputComponent } from './components/or-demand-plan-data-grid-input/or-demand-plan-data-grid-input.component';
import { OrDemandPlanDataGridDemandComponent } from './components/or-demand-plan-data-grid-demand/or-demand-plan-data-grid-demand.component';
import { OrDemandPlanDataGridSourceComponent } from './components/or-demand-plan-data-grid-source/or-demand-plan-data-grid-source.component';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { AuthService } from "../../service/auth.service";
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-or-demand-plan',
  templateUrl: './or-demand-plan.component.html',
  styleUrls: ['./or-demand-plan.component.css']
})
export class OrDemandPlanComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  numberBoxReadOnly = true;
  numberBoxFormat = "#,##0";
  form: FormGroup;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild('dataGridVersion') dataGridVersion: OrDemandPlanVersionComponent;
  @ViewChild('dataGridInput') dataGridInput: OrDemandPlanDataGridInputComponent;
  @ViewChild('dataGridDemand') dataGridDemand: OrDemandPlanDataGridDemandComponent;
  @ViewChild('dataGridSource') dataGridSource: OrDemandPlanDataGridSourceComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  @ViewChild('tabSetSecond') tabSetSecond: TabsetComponent;
  //costHistory
  dataList: any = [];
  accessMenu: any;
  listMonth = [];

  isCollapsedAnimated = false;

  masterData: any = {};
  year: any = '';
  month: any = '';
  yearSearch: any = '';
  version: any = 0;
  versionNew: any = 0;
  versionName: any = ' ';
  date: any;
  dateOld: any;
  dataInfo: any = {};
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;
  txtYear = '';

  apiUrlService = '';
  dataInfoOld: any = {};
  remarkPopupVisible = false;

  popupVisible = false;
  popupFull = true;
  numberBoxDigi = 0;
  formatMonthName = 'MMM-yyyy';

  sidebar: ISidebar;
  subscription: Subscription;
  isHideSaveBtn: boolean = false;

  constructor(private hotkeysService: HotkeysService,
    private router: Router, private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private orDemandPlantService: OrDemandPlantService
    , private authService: AuthService
    , private sidebarService: SidebarService) {
    this.date = moment();
    this.dateOld = this.date;
    this.year = moment().year();
    this.month = moment().month() + 1;
    this.yearSearch = this.year;
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      this.onSave();
      return false;
    }));

    this.hotkeysService.add(new Hotkey('ctrl+shift+s', (event: KeyboardEvent): boolean => {
      this.onSaveAs();
      return false;
    }));

    this.hotkeysService.add(new Hotkey('ctrl+f', (event: KeyboardEvent): boolean => {
      this.onSearch(null);
      return false;
    }));
  }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlService;
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // this.loaderService.show();
    setTimeout(() => {
      this.accessMenuList();
      this.yearChange();
    }, 500);
  }

  accessMenuList() {
    // 1 : Add,Edit, 2 : View Only
    this.authService.menuAll$.subscribe(res => {
      if (res && res.currentMenu) {
        // console.log("res >>>>>>> ", res['currentMenu']);
        console.log("actionMenu > ", res.currentMenu?.actionMenu);
        this.accessMenu = res.currentMenu.actionMenu;
      }
    });
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

  getCellCssClass(date) {
    var cssClass = "";

    return cssClass;
  }

  onSave() {

    if (this.accessMenu !== 1) {
      Swal.fire({
        title: 'Access Denied',
        text: 'ไม่สามารถทำรายการได้ เนื่องจาก ไม่มีสิทธิ์',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
      });

      return false;
    }

    let datasave: any = {};
    datasave = this.dataGridSource.getDataSave();
    datasave.demandPlan = this.dataGridInput.getDataSave();

    let monthVersion = this.month;
    let yearVersion = this.year;

    if (this.dataInfo && this.dataInfo.month != monthVersion && _.toInteger(this.year) === moment().year()) {
      this.dataInfo.id = undefined;
      this.version = 0;
    }

    // let versionName = 'Reference Price เดือน ' + monthVersion + ' rev ' + this.version;//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    // let versionNameNew = 'Reference Price เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0

    let versionName = 'OR Demand Plan ปี ' + yearVersion; //version ที่จะ save
    let versionNameNew = 'OR Demand Plan ปี ' + yearVersion; //version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0

    if (_.toInteger(this.year) != moment().year()) {
      versionName += ' Draft version Rev ' + this.version;;
      versionNameNew += ' Draft version Rev ';
    } else {
      versionName += ' เดือน ' + monthVersion + ' Rev ' + this.version;
      versionNameNew += ' เดือน ' + monthVersion + ' Rev '
    }

    // if (_.toInteger(this.year) > moment().year()) {
    //   monthVersion = 0;
    //   _.each(datasave, (item) => {
    //     item.month = monthVersion;
    //   })
    //   versionName = 'Reference Price ปีล่วงหน้า rev ' + this.version;
    //   versionNameNew = 'Reference Price ปีล่วงหน้า rev ';
    // } else if (_.toInteger(this.year) < moment().year()) {
    //   monthVersion = 13;
    //   _.each(datasave, (item) => {
    //     item.month = monthVersion;
    //   })
    //   versionName = 'Reference Price ปีล่วงหน้า rev ' + this.version;
    //   versionNameNew = 'Reference Price ปีย้อนหลัง rev ';
    // }

    let textConfirm = '';
    let saveNewVersion = false;
    
    this.saveData(datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion);
  }

  onSaveAs() {

    let datasave: any = {};

    datasave = this.dataGridSource.getDataSave();
    datasave.demandPlan = this.dataGridInput.getDataSave();

    let monthVersion = this.month;
    let yearVersion = this.year;
    if (this.dataInfo && this.dataInfo.month != monthVersion && this.dataInfo.year != yearVersion) {
      this.dataInfo.id = undefined;
      this.version = 0;
      this.maxVersion = -1;
    }

    let versionNameNew = 'OR Demand Plan ปี ' + yearVersion; //version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0

    if (_.toInteger(this.year) != moment().year()) {
      versionNameNew += ' Draft version Rev ';
    } else {
      versionNameNew += ' เดือน ' + monthVersion + ' Rev '
    }

    let textConfirm = '';
    let saveNewVersion = false;

    saveNewVersion = true;
    this.versionNew = this.maxVersion + 1;
    versionNameNew += this.versionNew;
    textConfirm += versionNameNew + '<br/>';

    this.saveData(datasave, textConfirm, '', saveNewVersion, versionNameNew, monthVersion);

  }

  saveData(datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion) {
    console.log('datasave', datasave);
    Swal.fire({
      title: '<h3>คุณต้องการบันทึกหรือไม่</h3>',
      icon: 'question',
      html: textConfirm,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: 'red'

    }).then((result) => {
      if (result.isConfirmed) {


        console.log('result', result);
        this.loaderService.show();
        let dataVersionSave: any = [];
        let dataVersion: any = this.dataInfo;
        let dataVersionNew: any = {};

        dataVersion.year = this.year
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = this.version;
        dataVersion.remark = this.dataInfo.remark;

        const dataHistory = this.dataGridVersion.getDataVersion();
        const data = _.find(dataHistory, (item) => {
          return item.isApply === true && item.month === this.month;
        })
        if (!data || (data && data.version === this.version)) {
          dataVersion.isApply = true;
        }

        if (saveNewVersion === true) {
          dataVersionNew.year = this.year
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.isApply = dataVersion.isApply;
          dataVersionNew.remark = dataVersion.remark;
          dataVersionSave.push(dataVersionNew);
          dataVersion.isApply = false;
        }
        if (versionName !== '') {
          dataVersionSave.push(dataVersion);
        }

        _.each(datasave.demandPlan, (item, index) => {
            item.version = this.versionNew === 0 ? this.version : this.versionNew;
        });

        _.each(datasave.demandPlanValue, (item, index) => {
          item.version = this.versionNew === 0 ? this.version : this.versionNew;
        });

        _.each(datasave.demandPlanManual, (item, index) => {
          item.version = this.versionNew === 0 ? this.version : this.versionNew;
        });

        const observable: any[] = [];

        dataVersionSave[0].abilityPlanKhmVersionId = this.dataGridDemand.dataCondition.abilityKHMVersionId;
        dataVersionSave[0].abilityRefineryVersionId = this.dataGridDemand.dataCondition.abilityRefineryVersionId;

        datasave.version = dataVersionSave[0];

        // console.log('datasave ===> ',datasave);
        // return;

        observable.push(this.orDemandPlantService.save(datasave));

        forkJoin(observable).subscribe(res => {
          this.yearChange();

          this.loaderService.hide();
          Swal.fire({
            title: '',
            text: 'บันทึกสำเร็จ',
            icon: 'success',
            showConfirmButton: false,
            // confirmButtonText: 'ปิด'
            timer: 1000
          })
        }, error => {
          Swal.fire({
            title: 'บันทึกไม่สำเร็จ',
            text: error.message,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
            //timer: 1000
          })
        });

      } else {
        console.log('Cancel');
      }
    });
  }

  onYearChange($event) {
    console.log('$event', $event)
    this.year = moment($event.value).format('yyyy');
    this.yearChange();
  }

  yearChange() {

    console.log('this.year',this.year);
    console.log('this.month', this.month);

    let dateStart = moment(this.year + '-' + this.month + '-01');
    this.txtYear = dateStart.format(this.formatMonthName);

    this.dataGridVersion.onYearChange(this.year, this.month, (dataInfo) => {
      console.log('dataInfo',dataInfo);
      this.dataInfo = dataInfo;
      this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      this.maxVersion = this.dataInfo.maxVersion ? this.dataInfo.maxVersion : 0;

      this.dataGridInput.onYearChange(this.year, this.month, this.version, this.maxVersion);
      this.dataGridDemand.onYearChange(this.year, this.month, this.version, this.maxVersion, this.dataInfo);
      this.dataGridSource.onYearChange(this.year, this.month, this.version, this.maxVersion);

      this.tabSet.tabs[0].active = true;
      this.tabSetSecond.tabs[0].active = true;

      if(this.dataInfo?.version >= 0) {
        this.isHideSaveBtn = true;
      }else{
        this.isHideSaveBtn = false;
      }
    })
  }

  onVersionChange($event) {
  }

  onHistoryClick($event) {
    this.tabSet.tabs[0].active = true;
    this.tabSetSecond.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.dataGridInput.onYearChange(this.dataInfo.year, this.dataInfo.month, this.version, this.maxVersion);
    this.dataGridDemand.onYearChange(this.dataInfo.year, this.dataInfo.month, this.version, this.maxVersion, this.dataInfo);
  }

  importExcelClick(event) {
    this.popupVisible = true;
  }

  fullClick = () => {
    this.popupFull = !this.popupFull;
  }

  remarkPopupClick(event) {
    this.dataInfoOld = _.cloneDeep(this.dataInfo);
    this.remarkPopupVisible = true;
  }

  onRemarkPopupSubmit() {
    this.remarkPopupVisible = false;
  }

  onRemarkPopupCancel() {
    this.dataInfo = _.clone(this.dataInfoOld);
    this.remarkPopupVisible = false;
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('M');
    this.dateOld = this.date;
    this.yearChange();
    this.modalRef.hide();
  }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  tabDemandChange($event) {
    this.dataGridDemand.retrieveData(this.dataGridInput.getDataSave());
    this.dataGridDemand.onYearChange(this.year, this.month, this.version, this.maxVersion, this.dataInfo);
    this.dataGridDemand.setVersionSelect();
    this.dataGridDemand.gridRefresh();
  }

  tabORChange($event) {
    const dataTab1 = {
      'getdataList': this.dataGridInput.getdataList()
    };
    const dataTab2 = {
      'getdataListByCar': this.dataGridDemand.getdataListByCar(),
      'getdataListByVessel': this.dataGridDemand.getdataListByVessel(),
      'getdataListTotal': this.dataGridDemand.getdataListTotal(),
    };
    this.dataGridSource.onYearChange(this.year, this.month, this.version, this.maxVersion, dataTab1 , dataTab2);
    this.dataGridSource.gridRefresh();
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
    this.dataGridDemand.retrieveData(this.dataGridInput.getDataSave());
    this.dataGridDemand.gridRefresh();
  }
}
