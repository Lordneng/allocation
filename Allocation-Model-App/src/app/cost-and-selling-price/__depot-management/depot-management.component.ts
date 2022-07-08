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
import { forkJoin } from 'rxjs';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { DepotManagementMeterService } from 'src/app/service/depot-management.service';
import { DepotManagementDataGridComponent } from './components/depot-management-data-grid/depot-management-data-grid.component';
import { ExcelsService } from 'src/app/service/excels.service';
import { DepotManagementMeterDataGridComponent } from './components/depot-management-meter-data-grid/depot-management-meter-data-grid.component';
import { DepotManagementHistoryComponent } from './components/depot-management-history/depot-management-history.component';
import { DepotManagementImportExcelComponent } from './components/depot-management-import-excel/depot-management-import-excel.component';
import data from 'src/app/constants/menu';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-depot-management',
  templateUrl: './depot-management.component.html',
  styleUrls: ['./depot-management.component.css']
})
export class DepotManagementComponent implements OnInit {

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
  //@ViewChild('depotManagementDataGrid') depotManagementDataGrid: DepotManagementDataGridComponent;
  @ViewChild('depotManagementMeterDataGrid') depotManagementMeterDataGrid: DepotManagementMeterDataGridComponent;
  @ViewChild('depotManagementHistory') depotManagementHistory: DepotManagementHistoryComponent;
  @ViewChild('importExcel') importExcel: DepotManagementImportExcelComponent;
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
  dataInfoOld: any = {};
  remarkPopupVisible = false;
  dateDisplay: any = '';
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;
  activeTab = true;
  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = false;
  uploadMode = 'useForm';
  uploadData: any = [];
  isNewMonthVersion: boolean = false;
  accessMenu: any;

  constructor(private hotkeysService: HotkeysService,
    private router: Router, private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private depotManagementMeterService: DepotManagementMeterService
    , private excelsService: ExcelsService
    , private authService: AuthService
  ) {
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
    this.accessMenuList();
  }

  ngAfterViewInit(): void {
    this.yearChange();
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

    // if(this.isWeekend(date))
    //     cssClass = "weekend";

    // this.holydays.forEach(function(item) {
    //     if(date.getDate() === item[0] && date.getMonth() === item[1]) {
    //         cssClass = "holyday";
    //         return false;
    //     }
    // });

    return cssClass;
  }

  onSave() {
    this.numberBoxReadOnly = true;
    let datasave = this.depotManagementMeterDataGrid.getDataSave();
    let monthVersion = this.month;

    let versionName = 'Depot Constrain ปี ' + this.year + ' เดือน ' + monthVersion + ' rev ' + this.version;//version ที่จะ save
    let versionNameNew = 'Depot Constrain ปี' + this.year + ' เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';
    let saveNewVersion = false;

    if (datasave.dataList && datasave.dataList.length > 0) {
      textConfirm = versionName + '<br/>';
    }

    this.saveData(datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion);
  }

  onSaveAs() {
    this.numberBoxReadOnly = true;
    let datasave = this.depotManagementMeterDataGrid.getDataSave();
    let monthVersion = this.month;

    let versionNameNew = 'Depot Constrain ปี' + this.year + ' เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';
    let saveNewVersion = true;

    if (this.isNewMonthVersion) {
      this.versionNew = 0;
      this.version = 0;
    } else {
      this.versionNew = this.maxVersion + 1;
    }

    versionNameNew += this.versionNew;
    textConfirm += versionNameNew + '<br/>';

    this.saveData(datasave, textConfirm, '', saveNewVersion, versionNameNew, monthVersion);
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
        console.log('dataInfo', this.dataInfo);
        console.log('saveData -> datasave', datasave)
        this.loaderService.show();
        let dataVersionSave: any = [];
        let dataVersion: any = this.dataInfo;
        let dataVersionNew: any = {};
        let dataList: any = {};

        dataVersion.year = this.year
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = this.version;

        if (saveNewVersion === true) {

          _.each(datasave.dataList, (item) => {
            item.version = this.versionNew === 0 ? this.version : this.versionNew;
          })

          _.each(datasave.dataForm, (item) => {
            item.version = this.versionNew === 0 ? this.version : this.versionNew;
          })

          dataVersionNew.year = this.year
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.remark = dataVersion.remark;
          dataVersionNew.filePath = dataVersion.filePath;
          dataVersionNew.fileName = dataVersion.fileName;
          dataVersionSave.push(dataVersionNew);
        }

        if (versionName !== '') {
          dataVersionSave.push(dataVersion);
        }

        dataList.data = datasave.dataList;
        dataList.form = datasave.dataForm;
        dataList.version = dataVersionSave;

        const observable: any[] = [];
        observable.push(this.depotManagementMeterService.save(dataList));

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
    this.year = moment($event.value).year();
    this.month = moment($event.value).month() + 1;
    this.yearChange();
  }

  async yearChange() {
    setTimeout(() => {
      this.dateDisplay = moment(this.date).format('MMM-yyyy');
    }, 100);

    const lastVersion: any = await this.depotManagementMeterService.getMonthMaxVersion(this.year, this.month);
    if (lastVersion.length === 0) {
      this.isNewMonthVersion = true;
    } else {
      this.isNewMonthVersion = false;
    }

    this.depotManagementHistory.onYearChange(this.year, this.month, dataInfo => {
      this.dataInfo = dataInfo;
      this.version = this.dataInfo && this.dataInfo.version ? this.dataInfo.version : 0;
      this.maxVersion = this.dataInfo && this.dataInfo.maxVersion ? this.dataInfo.maxVersion : 0;
      this.depotManagementMeterDataGrid.onYearChange(this.year, this.month, (this.dataInfo && this.dataInfo.version ? this.dataInfo.version : -1), this.maxVersion, false);
    })
  }

  onFileUploadValueChanged($event: any) {
    this.isImport = true;
  }

  onImportExcel(event) {
    this.loaderService.show();
    // ใช้ test ก่อน
    // this.DepotManagementDataGrid.setData(null);
    if (this.uploadFile && this.uploadFile.length === 1) {
      const formData = new FormData();
      formData.append('file', this.uploadFile[0]);
      console.log('data', this.uploadFile);
      this.excelsService.uploadVolumeConstrainKT(formData).subscribe((res: any) => {
        if (res && res.body && res.body.errCode !== '404') {
          this.dataInfo.filePath = res.body.path;
          this.dataInfo.fileName = res.body.fileName;

          let month = moment().month();
          month += 2;
          // set ข้อมลตั้งแต่ เดือนปัจจุบัน +1
          if (this.tabSet.tabs[0].active == true) {
            //this.depotManagementDataGrid.setData(res.body.data);
          }
          else if (this.tabSet.tabs[1].active == true) {
            this.depotManagementMeterDataGrid.setData(res.body.data);
          }

          this.uploadFile = [];
        } else if (res.body) {
          this.loaderService.hide();
          Swal.fire({
            title: 'ไม่สามารถ Import Excel ได้',
            text: res.body.errDesc,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          })
        }
      })
    } else {

      this.loaderService.hide();
      Swal.fire({
        title: 'จำนวนไฟล์ในการ upload',
        text: 'ไฟล์ในการ upload  ต้องมี 1 ไฟล์เท่านั้นกรุณาลบไฟล์ที่ไม่เกี่ยวข้อง',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      })
    }
  }

  onHistoryClick($event) {
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.year = this.dataInfo.year ? this.dataInfo.year : 0;
    this.month = this.dataInfo.month ? this.dataInfo.month : 0;
    this.depotManagementMeterDataGrid.onYearChange(this.year, this.month, this.version, this.maxVersion, true);
  }

  tabFirstChange($event) {
    //this.depotManagementDataGrid.gridRefresh();
  }

  tabSecondChange($event) {
    this.depotManagementMeterDataGrid.gridRefresh();
  }

  onEventImport($event) {
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event.dataInfo;
    //this.depotManagementDataGrid.setData($event.data.KT);
    this.depotManagementMeterDataGrid.setData($event.data.Meter);
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

  onSelect(data: TabDirective): void {
    if (data.heading === 'Data') {
      this.activeTab = true;
    } else {
      this.activeTab = false;
    }
  }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
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
}
