import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { DxDataGridComponent } from 'devextreme-angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbilityRefineryDataGridComponent } from './component/ability-refinery-data-grid/ability-refinery-data-grid.component';
import { AbilityRefineryHistoryComponent } from './component/ability-refinery-history/ability-refinery-history.component';
import { AbilityRefineryService } from 'src/app/service/ability-refinery.service';
import Swal from 'sweetalert2';
import { forkJoin, Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-ability-refinery',
  templateUrl: './ability-refinery.component.html',
  styleUrls: ['./ability-refinery.component.css']
})
export class AbilityRefineryComponent implements OnInit {

  dataInfo: any = {};
  dataInfoOld: any = {};
  dataList: any = [];
  listMonth = [];
  isCollapsedAnimated = false;
  masterData: any = {};
  year: any = '';
  version: any = 0;
  versionNew: any = 0;
  isNewMonthVersion: boolean = false;
  date: any;
  dateOld: any;
  isTabDataAction = true;
  isTabHistoryAction = false;
  remarkPopupVisible = false;
  maxVersion: any = 0;
  apiUrlService = '';
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = true;
  uploadMode = 'useForm';
  uploadData: any = [];
  month: any = moment().format('MM');
  dateDisplay: any = '';
  messageValidate: string = ''
  activeTab = true;
  numberBoxDigi = 0;

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
  accessMenu: any;
  sidebar: ISidebar;
  subscription: Subscription;
  versionId = '';

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild('abilityRefineryDataGrid') abilityRefineryDataGrid: AbilityRefineryDataGridComponent;
  @ViewChild('abilityRefineryHistory') abilityRefineryHistory: AbilityRefineryHistoryComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;

  constructor(private hotkeysService: HotkeysService,
    private router: Router, private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private AbilityRefineryService: AbilityRefineryService
    , private authService: AuthService
    , private sidebarService: SidebarService
    , private activatedRoute: ActivatedRoute
  ) {
    this.date = moment();
    this.year = moment().format('yyyy');
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
    this.loaderService.show();
    console.log('versionId', this.versionId)
    if (this.versionId) {
      this.AbilityRefineryService.getVersionByID(this.versionId).subscribe((res: any) => {
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

  onYearChange($event) {
    console.log('$event', $event)
    this.year = moment($event.value).format('yyyy');
    this.month = moment($event.value).format('MM');
    this.yearChange();
  }

  async yearChange() {
    setTimeout(() => {
      this.dateDisplay = moment(this.date).format('MMM-yyyy');
    }, 100);

    const lastVersion: any = await this.AbilityRefineryService.getMonthMaxVersion(this.year, this.month);
    if (lastVersion.length === 0) {
      this.isNewMonthVersion = true;
    } else {
      this.isNewMonthVersion = false;
    }

    this.abilityRefineryHistory.onYearChange(this.year, this.month, (dataInfo) => {
      // this.dataInfo = dataInfo;
      // this.version = this.dataInfo ? (this.dataInfo.version ? this.dataInfo.version : 0) : 0;

      if (this.versionId) {
        this.dataInfo = _.find(this.abilityRefineryHistory.masterData.refinery, (item) => {
          return item.version === this.version;
        })
        this.abilityRefineryHistory.setDataInfo(this.dataInfo);

      } else {
        this.dataInfo = dataInfo;
        this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      }


      this.maxVersion = this.abilityRefineryHistory.maxVersion;
      this.abilityRefineryDataGrid.onYearChange(this.year, this.month, (this.dataInfo.version >= 0 ? this.dataInfo.version : -1), this.maxVersion, false);
    })
  }

  onSave() {
    this.numberBoxReadOnly = true;
    let datasave = this.abilityRefineryDataGrid.getDataSave();
    let monthVersion = this.month;
    let validateValue = this.validateData(datasave)

    if (!validateValue) {
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ',
        html: this.messageValidate,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
        //timer: 1000
      })

      return
    }

    this.version = this.version <= 0 ? 1 : this.version;
    let versionName = 'Ability โรงกลั่น เดือน ' + monthVersion + ' rev ' + (this.version - 1);//version ที่จะ save
    let versionNameNew = 'Ability โรงกลั่น เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';
    let saveNewVersion = false;

    if (datasave.dataList && datasave.dataList.length > 0) {
      textConfirm = versionName + '<br/>';
    }

    this.saveData(datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion);
  }

  onSaveAs() {
    this.numberBoxReadOnly = true;
    let datasave = this.abilityRefineryDataGrid.getDataSave();
    let monthVersion = this.month;
    // let validateValue = this.validateData(datasave)

    // if (!validateValue) {
    //   Swal.fire({
    //     title: 'บันทึกไม่สำเร็จ',
    //     html: this.messageValidate,
    //     icon: 'error',
    //     showConfirmButton: true,
    //     confirmButtonText: 'ปิด'
    //     //timer: 1000
    //   })

    //   return
    // }

    let versionNameNew = 'Ability โรงกลั่น เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
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
        this.loaderService.show();
        let dataVersionSave: any = [];
        let dataVersion: any = this.dataInfo;
        let dataVersionNew: any = {};
        let dataList: any = {};

        dataVersion.year = this.year
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = this.version;
        dataVersion.isApply = true;

        if (saveNewVersion === true) {



          dataVersionNew.year = this.year
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.remark = dataVersion.remark;
          dataVersionNew.isApply = true;
          dataVersionSave.push(dataVersionNew);
          dataVersion.isApply = false;
        }
        if (versionName !== '') {
          dataVersionSave.push(dataVersion);
        }
        _.each(datasave.dataList, (item) => {
          item.version = this.versionNew === 0 ? this.version : this.versionNew;
        })
        dataList.data = datasave.dataList;
        dataList.version = dataVersionSave;

        const observable: any[] = [];
        observable.push(this.AbilityRefineryService.save(dataList));

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

  onVersionChange($event) { }

  onHistoryClick($event) {
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.year = this.dataInfo.year ? this.dataInfo.year : 0;
    this.month = this.dataInfo.month ? this.dataInfo.month : 0;
    this.abilityRefineryDataGrid.onYearChange($event.year, $event.month, $event.version, this.maxVersion, true);
  }

  onSelect(data: TabDirective): void {
    if (data.heading === 'Data') {
      this.activeTab = true;
    } else {
      this.activeTab = false;
    }
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

  validateData(data: any) {
    let result: boolean = true;

    _.each(data.dataList, (item) => {
      if (_.isNumber(item.value) === false) {
        result = false;

        this.messageValidate += `กรุณากรอกข้อมูล เดือน ${item.monthValue} ปี ${item.yearValue} </br>`
      }
    })

    return result;
  }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('MM');
    this.dateOld = this.date;

    this.yearChange();
    this.modalRef.hide();
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

}
