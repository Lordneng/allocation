
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
import { forkJoin, Observable, Subscription } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AbilityPlanRayongService } from 'src/app/service/ability-plan-rayong.service';
import { ExcelsService } from 'src/app/service/excels.service';
import { AbilityPlanRayongDataGridComponent } from './component/ability-plan-rayong-data-grid/ability-plan-rayong-data-grid.component';
import { AbilityPlanRayongHistoryComponent } from './component/ability-plan-rayong-history/ability-plan-rayong-history.component';
import { AbilityPlanRayongDataGridImportComponent } from './component/ability-plan-rayong-data-grid-import/ability-plan-rayong-data-grid-import.component';
import { AuthService } from 'src/app/service/auth.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { MasterUnitService } from 'src/app/service/master-unit.service';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { ProductionPlantService } from 'src/app/service/production-plant.service';

@Component({
  selector: 'ability-plan-rayong',
  templateUrl: './ability-plan-rayong.component.html',
  styleUrls: ['./ability-plan-rayong.component.css']
})
export class AbilityPlanRayongComponent implements OnInit {

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
  @ViewChild('abilityPlanRayongDataGrid') abilityPlanRayongDataGrid: AbilityPlanRayongDataGridComponent;
  @ViewChild('abilityPlanRayongDataGridImport') abilityPlanRayongDataGridImport: AbilityPlanRayongDataGridImportComponent;
  @ViewChild('abilityPlanRayongHistory') abilityPlanRayongHistory: AbilityPlanRayongHistoryComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  //costHistory
  dataList: any = [];
  listMonth = [];
  sidebar: ISidebar;
  subscription: Subscription;

  isCollapsedAnimated = false;

  masterData: any = {};
  year: any = '';
  month: any = moment().month() + 1;
  version: any = 0;
  versionNew: any = 0;
  date: any;
  dateOld: any;
  dateDisplay: any = '';
  dataInfo: any = {};
  dataInfoOld: any = {};
  remarkPopupVisible = false;
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;

  apiUrlService = '';
  popupVisible = false;
  popupFull = true;
  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = true;
  uploadMode = 'useForm';
  uploadData: any = [];
  accessMenu: any;
  numberBoxDigi = 0;
  formatMonthName = 'MMM-yyyy';
  dynamicColumns: any[] = [];
  refineryCellTemplate = 'refineryCellTemplate';
  cellTemplate = 'cellTemplate';
  versionId = '';
  constructor(private hotkeysService: HotkeysService,
    private router: Router
    , private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private abilityPlanRayong: AbilityPlanRayongService
    , private excelsService: ExcelsService
    , private authService: AuthService
    , private sidebarService: SidebarService
    , private masterUnitService: MasterUnitService
    , private masterProductService: MasterProductsService
    , private productionPlant: ProductionPlantService
    , private activatedRoute: ActivatedRoute) {
    this.date = moment();
    this.year = moment().year();
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
      this.abilityPlanRayong.getVersionByID(this.versionId).subscribe((res: any) => {
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

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getCellCssClass(date) {
    var cssClass = "";
    return cssClass;
  }

  onSave() {

    this.numberBoxReadOnly = true;
    let dataSaveGrid = this.abilityPlanRayongDataGrid.getDataSave();
    let dataSaveGridImport = this.abilityPlanRayongDataGridImport.getDataSave();
    // console.log('dataSaveGrid', dataSaveGrid);
    // console.log('dataSaveGridImport', dataSaveGridImport);
    // console.log('dataList ---------->>>>>', dataSaveGrid.dataList);
    // return;
    let monthVersion = _.toNumber(this.month);
    let versionMonth = monthVersion;
    let versionNumber = this.version;

    let versionName = 'Ability Plan (Rayong) เดือน ' + versionMonth + ' rev ' + versionNumber; // version ที่จะ save

    let textConfirm = '';
    let saveNewVersion = false;
    this.versionNew = 0;
    // datasave.dataList = dataSaveGrid.dataList;
    // datasave.dataForm = dataSaveGrid.dataForm;
    // datasave.monthNow = dataSaveGridImport.monthNow;
    // datasave.p1 = dataSaveGridImport.p1;
    // datasave.p2 = dataSaveGridImport.p2;
    // datasave.p3 = dataSaveGridImport.p3;
    // datasave.p4 = dataSaveGridImport.p4;
    // datasave.p5 = dataSaveGridImport.p5;
    // datasave.p6 = dataSaveGridImport.p6;
    // datasave.p7 = dataSaveGridImport.p7;
    // datasave.p8 = dataSaveGridImport.p8;
    // datasave.p9 = dataSaveGridImport.p9;
    // datasave.p10 = dataSaveGridImport.p10;
    // datasave.p11 = dataSaveGridImport.p11;
    // datasave.p12 = dataSaveGridImport.p12;
    textConfirm = versionName + '<br/>';
    this.saveData(dataSaveGridImport, dataSaveGrid, textConfirm, versionName, saveNewVersion, '', monthVersion);

  }

  onSaveAs() {
    this.numberBoxReadOnly = true;
    let versionNumberName = 0;
    let dataSaveGrid = this.abilityPlanRayongDataGrid.getDataSave(true);
    let dataSaveGridImport = this.abilityPlanRayongDataGridImport.getDataSave();
    let version = this.abilityPlanRayongHistory.getMaxVersion(this.month, this.year);

    // if (!version) {
    //   versionNumberName = 0;
    // }
    // else {
      versionNumberName = (version >= 0 ? (version + 1) : 0);
    // }

    console.log("versionNumberName >> ", versionNumberName);
    // return;
    let monthVersion = _.toNumber(this.month);
    let versionMonth = monthVersion;
    let versionNumber = this.version;
    // if (_.toInteger(this.year) > moment().year()) {
    //   monthVersion = 0;
    // } else if (_.toInteger(this.year) < moment().year()) {
    //   monthVersion = 13;
    // }

    // versionMonth = (monthVersion == 13 ? 1 : monthVersion);
    // versionNumber = (monthVersion == 13 ? 0 : this.version);

    let versionNameNew = 'Ability Plan (Rayong) เดือน ' + versionMonth + ' rev '; // version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';
    let saveNewVersion = false;

    saveNewVersion = true;
    this.versionNew = this.maxVersion + 1;
    versionNameNew += versionNumberName.toString();
    textConfirm += versionNameNew + '<br/>';

    // datasave.dataList = dataSaveGrid.dataList;
    // datasave.dataForm = dataSaveGrid.dataForm;
    // datasave.monthNow = dataSaveGridImport.monthNow;
    // datasave.p1 = dataSaveGridImport.p1;
    // datasave.p2 = dataSaveGridImport.p2;
    // datasave.p3 = dataSaveGridImport.p3;
    // datasave.p4 = dataSaveGridImport.p4;
    // datasave.p5 = dataSaveGridImport.p5;
    // datasave.p6 = dataSaveGridImport.p6;
    // datasave.p7 = dataSaveGridImport.p7;
    // datasave.p8 = dataSaveGridImport.p8;
    // datasave.p9 = dataSaveGridImport.p9;
    // datasave.p10 = dataSaveGridImport.p10;
    // datasave.p11 = dataSaveGridImport.p11;
    // datasave.p12 = dataSaveGridImport.p12;

    this.saveData(dataSaveGridImport, dataSaveGrid, textConfirm, '', saveNewVersion, versionNameNew, monthVersion);

    // if (datasave.dataManual && datasave.dataManual.length > 0) {
    // }
    // else {
    //   Swal.fire({
    //     title: 'ไม่สามารถบันทึกได้',
    //     text: 'เนื่องจากไม่มีการแก้ไขข้อมูลแบบ Manual',
    //     icon: 'error',
    //     showConfirmButton: true,
    //     confirmButtonText: 'ปิด'
    //     //timer: 1000
    //   })
    // }
  }

  saveData(datasaveImport, datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion) {
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
        console.log('saveData -> datasave', datasaveImport)
        this.loaderService.show();
        let dataVersionSave: any = [];
        let dataVersion: any = this.dataInfo;
        let dataVersionNew: any = {};

        dataVersion.year = this.year
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = this.version;
        dataVersion.isApply = true;

        _.each(datasaveImport, (item) => {
          item.version = this.versionNew === 0 ? this.version : this.versionNew;
        })

        if (saveNewVersion === true) {

          dataVersionNew.year = this.year
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.isApply = true;
          dataVersionNew.remark = this.dataInfo.remark;
          dataVersionSave.push(dataVersionNew);
          dataVersion.isApply = false;
        }
        if (versionName !== '') {
          dataVersionSave.push(dataVersion);
        }

        const observable: any[] = [];
        datasave.dataDaily = datasaveImport;
        datasave.dataVersion = dataVersionSave;
        // console.log("datasave >> ", datasave);
        // return;
        observable.push(this.abilityPlanRayong.save(datasave));

        forkJoin(observable).subscribe(res => {

          this.loaderService.hide();
          Swal.fire({
            title: '',
            text: 'บันทึกสำเร็จ',
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          }).then((resp) => {
            setTimeout(() => {
              this.isImport = false;
              this.yearChange();
            }, 500);
          })

        }, error => {
          Swal.fire({
            title: 'บันทึกไม่สำเร็จ',
            text: error.message,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          })
        });

      } else {
        console.log('Cancel');
      }
    });
  }

  yearChange(isImport = false, calback?) {
    setTimeout(() => {
      this.dateDisplay = moment(this.date).format('MMM-yyyy');
    }, 100);

    this.dateDisplay = moment(this.date).format('MMM-yyyy');
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('MM');

    this.abilityPlanRayongHistory.onYearChange(this.year, this.month, async (dataInfo) => {

      if (this.versionId) {
        this.dataInfo = _.find(this.abilityPlanRayongHistory.masterData.version, (item) => {
          return item.version === this.version;
        })
        this.abilityPlanRayongHistory.setDataInfo(this.dataInfo);

      } else {
        this.dataInfo = dataInfo;
        this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      }
      this.maxVersion = this.abilityPlanRayongHistory.maxVersion;
      this.listMonth = [];

      let dateStart = moment(this.year + '-' + this.month + '-01');
      let monthStart = dateStart.month();
      let yearStart = dateStart.year();

      for (let index = 1; index <= 13; index++) {
        this.listMonth.push({
          Year: yearStart,
          Month: monthStart + 1,
          MonthName: dateStart.format(this.formatMonthName),
        });
        dateStart = dateStart.add(1, 'M');
        monthStart = dateStart.month();
        yearStart = dateStart.year();
      }

      this.dynamicColumns = [];
      this.dynamicColumns.push({
        dataField: 'product',
        code: 'product',
        caption: 'Product',
        groupIndex: 0,
        fixed: true,
        fixedPosition: 'left',
        allowSorting: false,
        cellTemplate: this.refineryCellTemplate,
      });

      this.dynamicColumns.push({
        dataField: 'productionPlant',
        code: 'productionPlant',
        caption: 'Production Plant',
        fixed: true,
        allowSorting: false,
        fixedPosition: 'left',
      });

      _.each(this.listMonth, (item, index) => {
        this.dynamicColumns.push({
          dataField: 'M' + item.Month + item.Year,
          name: 'formulaM' + item.Month + item.Year,
          code: index,
          caption: item.MonthName,
          dataType: 'number',
          allowSorting: false,
          cellTemplate: this.cellTemplate,
        });

      });

      this.retrieveMasterData().subscribe(async (res) => {
        this.masterData.masterProducts = res[0];
        this.masterData.masterUnit = res[1];
        this.masterData.productionPlant = res[2];
        this.masterData.abilityDaily = res[3];
        this.masterData.abilityList = res[4];
        this.masterData.abilityPlanRayong = res[4];

        await this.abilityPlanRayongDataGrid.onYearChange(this.dynamicColumns, this.listMonth, this.masterData, this.year, this.month, this.version, this.maxVersion, false, false);
        await this.abilityPlanRayongDataGridImport.onYearChange(this.masterData, this.year, this.month, this.version, this.maxVersion, false, false);

      });

      if (calback) {
        calback();
      }
    })
  }

  retrieveMasterData(): Observable<any> {
    const masterProducts = this.masterProductService.getList();
    const masterUnit = this.masterUnitService.getList();
    const productionPlant = this.productionPlant.getList();
    const abilityDaily = this.abilityPlanRayong.getDaily(this.year, this.month, this.version);
    const abilityList = this.abilityPlanRayong.getList(this.year, this.month, this.version);
    return forkJoin([masterProducts, masterUnit, productionPlant, abilityDaily, abilityList]);
  }

  onVersionChange($event) { }

  async onHistoryClick($event) {

    this.loaderService.show();
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.year = this.dataInfo.year ? this.dataInfo.year : 0;
    this.month = this.dataInfo.month ? this.dataInfo.month : 0;

    this.date = moment(this.dataInfo.year + '-' + this.dataInfo.month + '-01');
    this.dateDisplay = moment(this.date).format('MMM-yyyy');

    this.listMonth = [];

    let dateStart = moment(this.year + '-' + this.month + '-01');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();

    for (let index = 1; index <= 13; index++) {
      this.listMonth.push({
        Year: yearStart,
        Month: monthStart + 1,
        MonthName: dateStart.format(this.formatMonthName),
      });
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'product',
      code: 'product',
      caption: 'Product',
      groupIndex: 0,
      fixed: true,
      fixedPosition: 'left',
      allowSorting: false,
      cellTemplate: this.refineryCellTemplate,
    });

    this.dynamicColumns.push({
      dataField: 'productionPlant',
      code: 'productionPlant',
      caption: 'Production Plant',
      fixed: true,
      allowSorting: false,
      fixedPosition: 'left',
    });

    _.each(this.listMonth, (item, index) => {
      this.dynamicColumns.push({
        dataField: 'M' + item.Month + item.Year,
        name: 'formulaM' + item.Month + item.Year,
        code: index,
        caption: item.MonthName,
        dataType: 'number',
        allowSorting: false,
        cellTemplate: this.cellTemplate,
      });

    });

    this.retrieveMasterData().subscribe(async (res) => {

      this.masterData.masterProducts = res[0];
      this.masterData.masterUnit = res[1];
      this.masterData.productionPlant = res[2];
      this.masterData.abilityDaily = res[3];
      this.masterData.abilityList = res[4];
      this.masterData.abilityPlanRayong = res[4];

      await this.abilityPlanRayongDataGrid.onYearChange(this.dynamicColumns, this.listMonth, this.masterData, this.year, this.month, this.version, this.maxVersion, true, false);
      await this.abilityPlanRayongDataGridImport.onYearChange(this.masterData, this.year, this.month, this.version, this.maxVersion, true, false);

    });

  }

  onEventImport($event) {
    // this.tabSet.tabs[0].active = true;
    // this.abilityPlanRayongDataGrid.setData($event);
    this.tabSet.tabs[0].active = true;
    // this.abilityPlanRayongDataGrid.setData($event);
    if ($event.monthNow && $event.monthNow.length > 0) {
      this.date = moment($event.monthNow[0].createDate);
      this.year = this.date.year();//กำหนดเดือนปีของข้อมูลจากการ import excel
      this.month = this.date.month() + 1;
      this.isImport = true;
      this.yearChange(true, () => {
        setTimeout(() => {
          const dataSum = this.abilityPlanRayongDataGridImport.setData($event);
          this.abilityPlanRayongDataGrid.setData(dataSum, this.isImport);
          this.dataInfo.remark = $event.remark;
          this.dataInfo.fileName = $event.fileName;
          this.dataInfo.filePath = $event.path;
          this.popupVisible = false;
          this.loaderService.hide();
          Swal.fire({
            title: '',
            text: 'Import Excel สำเร็จ'
            , icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          })
        }, 1000);
      });
    }
  }

  searchCancelClick() {
    // this.date = this.dateOld;
    this.modalRef.hide();
  }

  importExcelClick(event) {
    this.popupVisible = true;
  }

  fullClick = () => {
    this.popupFull = !this.popupFull;
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).year();
    this.month = moment(this.date).month() + 1;
    this.dateOld = this.date;

    this.yearChange();
    this.modalRef.hide();
  }

  onGenFile($event) {
    // let abilityPlanRayongDataGrid = this.abilityPlanRayongDataGrid.getDataSave();
    // console.log('abilityPlanRayongDataGrid', abilityPlanRayongDataGrid);
    // let dataSend: any = {};
    // let dataCost = [];
    // let dataSellPrice = [];

    // let data: any = {};
    // data.product = item.product;
    // data.unit = item.unit;
    // data.source = item.source;
    // data.demand = item.demand;
    // data.deliveryPoint = item.deliveryPoint;

    // const _string = '_';
    // _.each(abilityPlanRayongDataGrid, (item) => {
    //   if (item.value) {
    //     data = {};
    //     data.key = item.product + _string + _.padStart(item.month, 2, '0') + _string + item.year;
    //     data.value = item.value
    //     dataCost.push(data);
    //   }

    // })

    // dataSend.abilityPlanRayong = dataCost
    // console.log('dataSend', dataSend);
  }

  tabDailyClick() {
    this.abilityPlanRayongDataGridImport.gridRefresh();
  }

  onEventDataMonthDaily(data) {
    this.abilityPlanRayongDataGrid.setData(data, this.isImport);
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
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

