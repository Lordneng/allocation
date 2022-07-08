import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { forkJoin, Subscription } from 'rxjs';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { VolumeConstrainService } from 'src/app/service/volume-constrain.service';
import { VolumeConstrainDataGridComponent } from './components/volume-constrain-data-grid/volume-constrain-data-grid.component';
import { ExcelsService } from 'src/app/service/excels.service';
import { VolumeConstrainHistoryComponent } from './components/volume-constrain-history/volume-constrain-history.component';
import { VolumeConstrainImportExcelComponent } from './components/volume-constrain-import-excel/volume-constrain-import-excel.component';
import { AuthService } from 'src/app/service/auth.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-volume-constrain',
  templateUrl: './volume-constrain.component.html',
  styleUrls: ['./volume-constrain.component.css']
})
export class VolumeConstrainComponent implements OnInit {
  accessMenu: any;
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
  @ViewChild('volumeConstrainDataGrid') volumeConstrainDataGrid: VolumeConstrainDataGridComponent;
  @ViewChild('volumeConstrainHistory') volumeConstrainHistory: VolumeConstrainHistoryComponent;
  @ViewChild('importExcel') importExcel: VolumeConstrainImportExcelComponent;
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
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;
  dateDisplay: any = '';
  activeTab: boolean = true;
  isNewMonthVersion: boolean = false;
  numberBoxDigi = 0;
  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = false;
  uploadMode = 'useForm';
  uploadData: any = [];
  sidebar: ISidebar;
  subscription: Subscription;
  versionId = '';

  constructor(private hotkeysService: HotkeysService,
    private router: Router, private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private volumeConstrainService: VolumeConstrainService
    , private excelsService: ExcelsService
    , private authService: AuthService
    , private sidebarService: SidebarService
    , private activatedRoute: ActivatedRoute) {
    this.date = moment();
    this.year = moment().year();
    this.month = moment().month() + 1;
    this.dateOld = this.date;
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      this.onSave();
      return false;
    }));

    this.hotkeysService.add(new Hotkey('ctrl+shift+s', (event: KeyboardEvent): boolean => {
      this.onSaveAs();
      return false;
    }));
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.versionId) {
        this.versionId = params.versionId;
      }
    });
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
    console.log('versionId', this.versionId)
    if (this.versionId) {
      this.volumeConstrainService.getVersionById(this.versionId).subscribe((res: any) => {
        if (res) {
          this.date = moment(res.year + '-' + _.padStart(res.month, 2, '0') + '-01')
          this.year = res.year;
          this.month = res.month;
          this.version = res.version;
          this.yearChange();
        }
      })
    } else {
      setTimeout(() => {
        this.yearChange();
      }, 100);

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

  accessMenuList() {
    // 1 : Add,Edit, 2 : View Only
    this.authService.menuAll$.subscribe(res => {
      console.log('res contract', res);
      if (res && res.currentMenu) {
        // console.log("res >>>>>>> ", res['currentMenu']);
        console.log("actionMenu > ", res.currentMenu?.actionMenu);
        this.accessMenu = res['currentMenu']['actionMenu'];
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
    let datasave = this.volumeConstrainDataGrid.getDataSave();
    let monthVersion = this.month;

    // (this.dataInfo.version) ? this.version = this.dataInfo.version : this.version = 1 ;

    let versionName = (this.dataInfo.versionName) ? this.dataInfo.versionName : 'Volume Constrain ปี ' + this.year + ' เดือน ' + monthVersion + ' rev 0';//version ที่จะ save
    let textConfirm = '';
    let saveNewVersion = false;

    if (datasave.data && datasave.data.length > 0) {
      textConfirm = versionName + '<br/>';
    }

    //console.log('this.version',this.version);

    this.saveData(datasave, textConfirm, versionName, saveNewVersion, null, monthVersion);
  }

  onSaveAs() {
    this.numberBoxReadOnly = true;
    let datasave = this.volumeConstrainDataGrid.getDataSave();
    let monthVersion = this.month;

    let versionNameNew = 'Volume Constrain ปี ' + this.year + ' เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';
    let saveNewVersion = true;

    if (this.isNewMonthVersion) {
      this.versionNew = 1;
      this.version = 1;
    } else {
      this.versionNew = this.maxVersion + 1;
    }

    versionNameNew += (this.versionNew - 1);
    textConfirm += versionNameNew + '<br/>';

    //console.log('this.versionNew',this.versionNew);

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
        console.log('saveData -> datasave', datasave)

        // return;
        this.loaderService.show();
        let dataVersionSave: any = [];
        let dataVersion: any = this.dataInfo;
        let dataVersionNew: any = {};

        if (_.toInteger(dataVersion.month) !== _.toInteger(monthVersion)) {
          dataVersion.id = undefined;
        }
        dataVersion.year = this.year
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = this.version;
        dataVersion.isApply = true;

        _.each(datasave.data, (item, index) => {
          item.version = dataVersion.version;
        })

        // _.each(datasave.dataForm, (item, index) => {
        //   item.version = dataVersion.version;
        // })

        if (saveNewVersion === true) {

          _.each(datasave.data, (item) => {
            item.version = this.versionNew;
          })

          // _.each(datasave.dataForm, (item) => {
          //   item.version = this.versionNew;
          // })

          dataVersionNew.year = this.year
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.remark = dataVersion.remark;
          dataVersionSave.push(dataVersionNew);
        }

        if (versionName !== '') {
          dataVersionSave.push(dataVersion);
        }

        console.log('dataVersion', dataVersion);

        const observable: any[] = [];
        observable.push(this.volumeConstrainService.create({
          volumeConstrain: datasave.data,
          volumeConstrainForm: datasave.dataForm,
          volumeConstrainVersion: dataVersionSave[0]
        }));

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

  async yearChange() {
    setTimeout(() => {
      this.dateDisplay = moment(this.date).format('MMM-yyyy');
    }, 100);

    const lastVersion: any = await this.volumeConstrainService.getMonthMaxVersion(this.year, this.month);
    if (lastVersion.length === 0) {
      this.isNewMonthVersion = true;
    } else {
      this.isNewMonthVersion = false;
    }

    this.volumeConstrainHistory.onYearChange(this.year, this.month, (dataInfo) => {
      console.log('dataInfo ====> ', dataInfo);
      // this.dataInfo = dataInfo
      // this.version = (this.dataInfo.version) ? this.dataInfo.version : 1;
      // this.maxVersion = this.dataInfo.version
      if (this.versionId) {
        this.dataInfo = _.find(this.volumeConstrainHistory.masterData.version, (item) => {
          return item.version === this.version;
        })
        this.volumeConstrainHistory.setDataInfo(this.dataInfo);

      } else {
        this.dataInfo = dataInfo;
        this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      }
      this.maxVersion = this.volumeConstrainHistory.maxVersion;

      this.volumeConstrainDataGrid.onYearChange(this.year, this.month, this.version, this.maxVersion, false);
    });
    // this.volumeConstrainService.getVersion(this.year, this.month).subscribe((res: any) => {
    //   if (res && res.length > 0) {
    //     this.dataInfo = res[0];
    //     //this.importExcel.dataInfo = this.dataInfo;
    //   }
    // });

    if (this.tabSet.tabs[0].active == true) {
    }
    else if (this.tabSet.tabs[1].active == true) {
    }
  }
  onVersionChange($event) {

  }

  remarkPopupClick(event) {
    this.dataInfoOld = _.cloneDeep(this.dataInfo);
    this.remarkPopupVisible = true;
  }

  onFileUploadValueChanged($event: any) {
    this.isImport = true;
  }

  onImportExcel(event) {
    this.loaderService.show();
    // ใช้ test ก่อน
    // this.volumeConstrainDataGrid.setData(null);
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
            this.volumeConstrainDataGrid.setData(res.body.data);
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
    console.log('History =========> ', $event);
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 1;
    this.year = this.dataInfo.year ? this.dataInfo.year : 0;
    this.month = this.dataInfo.month ? this.dataInfo.month : 0;
    this.volumeConstrainDataGrid.onYearChange(this.year, this.month, this.version, this.maxVersion, true);
  }

  tabFirstChange($event) {
    this.volumeConstrainDataGrid.gridRefresh();
  }
  onEventImport($event) {
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event.dataInfo;
    this.volumeConstrainDataGrid.setData($event.data.KT);
    // this.dataInfo = $event;
    // this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    // this.costDataGrid.onYearChange(this.year, this.version, this.maxVersion);
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).year();
    this.month = moment(this.date).month() + 1;
    this.dateOld = this.date;
    this.yearChange();
    this.modalRef.hide();
  }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  onSelect(data: TabDirective): void {
    if (data.heading === 'Data') {
      this.activeTab = true;
    } else {
      this.activeTab = false;
    }
  }

  importExcelClick(event) {
    //this.popupVisible = true;
  }

  onRemarkPopupSubmit() {
    this.remarkPopupVisible = false;
  }

  onRemarkPopupCancel() {
    this.dataInfo = _.clone(this.dataInfoOld);
    this.remarkPopupVisible = false;
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

}
