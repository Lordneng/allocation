import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
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
import { LRByLegalMeterDataGridComponent } from './components/lr-by-legal-meter-data-grid/lr-by-legal-meter-data-grid.component';
import { LRByLegalHistoryComponent } from './components/lr-by-legal-history/lr-by-legal-history.component';
import { LRByLegalService } from 'src/app/service/lr-by-legal.service';
import { AuthService } from 'src/app/service/auth.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-lr-by-legal',
  templateUrl: './lr-by-legal.component.html',
  styleUrls: ['./lr-by-legal.component.css']
})
export class LRByLegalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  numberBoxReadOnly = true;
  numberBoxFormat = "#,##0";
  configDrop = {
    url: 'https://httpbin.org/post',
    thumbnailWidth: 160,
    // tslint:disable-next-line: max-line-length
    previewTemplate: '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>'
  };
  form: FormGroup;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild('lrByLegalMeterDataGrid') LRByLegalMeterDataGrid: LRByLegalMeterDataGridComponent;
  @ViewChild('lrBylegalHistory') LRByLegalHistory: LRByLegalHistoryComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  //costHistory
  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;
  dateOld: any;

  masterData: any = {};
  year: any = '';
  month: any = '';
  version: any = 0;
  versionNew: any = 0;
  date: any;
  dataInfo: any = {};
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;

  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = false;
  uploadMode = 'useForm';
  uploadData: any = [];
  messageValidate: string = '';
  dateDisplay: any = '';
  icanSave = true;
  accessMenu: any;
  numberBoxDigi = 0;
  sidebar: ISidebar;
  subscription: Subscription;

  constructor(
    private hotkeysService: HotkeysService
    , private router: Router
    , private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private lrbylegalService: LRByLegalService
    , private authService: AuthService
    , private sidebarService: SidebarService) {
    this.date = moment();
    this.year = moment().format('yyyy');
    this.month = moment().format('MM');
    this.dateOld = this.date;
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {

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

      this.onSave();
      return false;
    }));

    this.hotkeysService.add(new Hotkey('ctrl+shift+s', (event: KeyboardEvent): boolean => {

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

      this.onSaveAs();
      return false;
    }));
  }

  ngOnInit(): void {

    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );

    this.accessMenuList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.loaderService.show();
    setTimeout(() => {
      this.yearChange();
    }, 500);
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

  onUploadError(event): void {
    console.log(event);
  }

  onUploadSuccess(event): void {
    console.log(event);
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getCellCssClass(date) {
    var cssClass = "";
    return cssClass;
  }

  onSave() {

    this.LRByLegalMeterDataGrid.setView();
    let monthVersion = (_.toNumber(this.month) ? _.toNumber(this.month) : 1);
    let versionMonth = monthVersion;
    let versionNumber = (this.version ? this.version : 0);
    if (_.toInteger(this.year) > moment().year()) {
      monthVersion = 1;
    } else if (_.toInteger(this.year) < moment().year()) {
      monthVersion = 13;
    }

    // console.log("datainfo", this.dataInfo);
    if (_.toInteger(this.year) > _.toInteger(this.dataInfo['year'])) {
      this.maxVersion = 0;
      versionNumber = 0;
    }

    // versionMonth = (monthVersion == 13 ? 1 : monthVersion);
    versionMonth = monthVersion;
    versionNumber = (monthVersion == 13 ? 0 : (this.version ? this.version : 0));

    let versionName = 'LR By Legal ปี ' + this.year + ' เดือน ' + versionMonth + ' rev ' + versionNumber; // version ที่จะ save

    let textConfirm = '';
    let saveNewVersion = false;
    this.versionNew = 0;
    textConfirm = versionName + '<br/>';

    let dataSave = this.LRByLegalMeterDataGrid.getDataSave(versionNumber, monthVersion);
    this.saveData(dataSave, textConfirm, versionName, saveNewVersion, '', monthVersion);

  }

  onSaveAs() {

    this.numberBoxReadOnly = true;
    let datasave: any = {};
    let monthVersion = (_.toNumber(this.month) ? _.toNumber(this.month) : 1);
    let versionMonth = monthVersion;
    let versionNumber = this.version;
    if (_.toInteger(this.year) > moment().year()) {
      monthVersion = 1;
    } else if (_.toInteger(this.year) < moment().year()) {
      monthVersion = 13;
    }

    if (_.toInteger(this.year) > _.toInteger(this.dataInfo['year'])) {
      this.maxVersion = -1;
      versionNumber = 0;
    }

    // versionMonth = (monthVersion == 13 ? 1 : monthVersion);
    versionMonth = versionMonth;
    versionNumber = (monthVersion == 13 ? 0 : this.version);

    let versionNameNew = 'LR By Legal ปี ' + this.year + ' เดือน ' + versionMonth + ' rev '; // version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';
    let saveNewVersion = false;

    saveNewVersion = true;
    this.versionNew = this.maxVersion + 1;
    versionNameNew += this.versionNew;
    textConfirm += versionNameNew + '<br/>';

    let dataSave = this.LRByLegalMeterDataGrid.getDataSave(this.versionNew, monthVersion);
    if (dataSave.dataForm.length === 0) {
      Swal.fire({
        title: 'แจ้งเตือน !',
        text: 'กรุณาตรวจสอบข้อมูล',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      })

      return;
    }

    this.saveData(dataSave, textConfirm, '', saveNewVersion, versionNameNew, monthVersion);

  }

  saveData(datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion) {
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
        console.log('saveData -> datasave', datasave);
        console.log("monthVersion >> ", monthVersion);
        // return;
        this.loaderService.show();
        let dataVersionSave: any = [];
        let dataVersion: any = this.dataInfo;
        let dataVersionNew: any = {};
        //dataVersion.remark = dataVersion.remark ? dataVersion.remark.replace(/\n/g, "<br />") : "";
        dataVersion.year = this.year
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = (this.version ? this.version : 0);
        dataVersion.versionForm = (this.version ? this.version : 0);
        dataVersion.isApply = true;

        if (saveNewVersion === true) {
          dataVersionNew.year = this.year
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.isApply = true;
          dataVersionNew.remark = this.dataInfo.remark;
          dataVersion.versionForm = this.versionNew;
          dataVersionSave.push(dataVersionNew);
          dataVersion.isApply = false;
        }
        if (versionName !== '') {
          dataVersionSave.push(dataVersion);
        }

        console.log("dataKT :: ", datasave.dataKT);
        console.log("dataForm :: ", datasave.dataForm);
        console.log("version :: ", dataVersionSave);

        // return;
        const checkData = this.checkDataZero(datasave.dataKT);
        // console.log("checkData >> ", checkData);
        if (!checkData) {
          this.loaderService.hide();
          Swal.fire({
            title: 'บันทึกไม่สำเร็จ',
            html: this.messageValidate,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          })
          return;
        }

        const observable: any[] = [];

        observable.push(this.lrbylegalService.create({
          legalData: datasave.dataKT,
          legalFormData: datasave.dataForm,
          legalVersionData: dataVersionSave
        }));

        forkJoin(observable).subscribe(res => {
          this.loaderService.hide();
          Swal.fire({
            title: '',
            text: 'บันทึกสำเร็จ',
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
            // timer: 1000
          }).then((resp) => {
            this.yearChange();
          })
        }, (error) => {
          console.log("error :: ", error);
          Swal.fire({
            title: 'บันทึกไม่สำเร็จ',
            text: error.error.message,
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

  checkDataZero(data: any) {

    let result: boolean = true;
    _.each(data, (item, index) => {
      if (item.value === 0 || !item.value) {
        result = false;
        this.messageValidate += `กรุณากรอกข้อมูล ${item.source} เดือน ${item.monthValue} ปี ${item.year} </br>`
      }
    });

    return result;

  }

  onYearChange($event) {
    // console.log('$event', $event)
    this.loaderService.show();
    this.year = moment($event.value).format('yyyy');
    this.month = moment($event.value).format('MM');
    this.yearChange();
  }

  yearChange() {

    setTimeout(() => {
      this.dateDisplay = moment(this.date).format('MMM-yyyy');
      this.icanSave = true;
      if (moment(this.date).format('01-MM-yyyy') < moment().format('01-MM-yyyy')) {
        this.icanSave = false;
      }
    }, 100);

    this.LRByLegalHistory.onYearChange(this.year, this.month, (dataInfo) => {
      // console.log("this.dataInfo :: ", dataInfo);
      this.dataInfo = dataInfo
      this.version = this.dataInfo && this.dataInfo.version ? this.dataInfo.version : 0;
      this.maxVersion = this.dataInfo && this.dataInfo.maxVersion ? this.dataInfo.maxVersion : 0;
      this.loaderService.hide();
      this.LRByLegalMeterDataGrid.onYearChange(this.year, this.month, (this.dataInfo.version === undefined ? -1 : this.version), this.maxVersion, false);

    });

  }

  onVersionChange($event) { }

  onFileUploadValueChanged($event: any) {
    this.isImport = true;
  }

  onHistoryClick($event) {

    console.log('$event',$event);

    this.dataList = [];
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.year = this.dataInfo.year ? this.dataInfo.year : 0;
    this.month = this.dataInfo.month ? this.dataInfo.month : 0;
    // console.log("this.maxVersion >> ", this.maxVersion);
    // this.maxVersion = this.dataInfo.version;
    // this.LRByLegalHistory.onYearChange(
    //   this.year,
    //   this.month,
    //   this.version,
    //   this.maxVersion
    // );
    this.LRByLegalMeterDataGrid.onYearChange(this.year, this.month, this.version, this.maxVersion, true);
  }

  tabFirstChange($event) {
    //this.volumeConstrainDataGrid.gridRefresh();
  }

  tabSecondChange($event) {
    this.LRByLegalMeterDataGrid.gridRefresh();
  }

  onEventImport($event) {
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event.dataInfo;
    //this.volumeConstrainDataGrid.setData($event.data.KT);
    this.LRByLegalMeterDataGrid.setData($event.data.Meter);
    // this.dataInfo = $event;
    // this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    // this.costDataGrid.onYearChange(this.year, this.version, this.maxVersion);
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('MM');
    this.dateOld = this.date;

    this.yearChange();
    this.modalRef.hide();
  }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }
}
