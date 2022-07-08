import { ReferencePriceHistoryComponent } from './component/reference-price-history/reference-price-history.component';
import { ReferencePriceDataGridComponent } from './component/reference-price-data-grid/reference-price-data-grid.component';
import { ReferencePriceDataFromSmartPriceComponent } from './component/reference-price-data-from-smart-price/reference-price-data-from-smart-price.component';
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
import { RefPricesService } from 'src/app/service/reference-prices.service';
import { ExcelsService } from 'src/app/service/excels.service';
import { ReferencepriceImportExcelComponent } from './component/reference-price-import-excel/reference-price-import-excel.component';
import { environment } from 'src/environments/environment';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-reference-price',
  templateUrl: './reference-price.component.html',
  styleUrls: ['./reference-price.component.css']
})
export class ReferencePriceComponent implements OnInit {

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
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild('referencePriceDataGrid') referencePriceDataGrid: ReferencePriceDataGridComponent;
  @ViewChild('referencePriceHistory') referencePriceHistory: ReferencePriceHistoryComponent;
  @ViewChild('referencePriceDataFromSmartPrice') referencePriceDataFromSmartPrice: ReferencePriceDataFromSmartPriceComponent;
  @ViewChild('referencepriceImportExcel') referencepriceImportExcel: ReferencepriceImportExcelComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  //costHistory
  dataList: any = [];
  listMonth = [];
  sidebar: ISidebar;
  subscription: Subscription;

  isCollapsedAnimated = false;

  masterData: any = {};
  year: any = 2022;
  month: any = 0;
  monthSave: any = 0;
  version: any = 0;
  versionSave: any = 0;
  versionSaveNew: any = 0;
  versionNew: any = 0;
  versionName: any = ' ';
  versionNameNew: any = ' ';
  date: any;
  dateOld: any;
  dataInfo: any = {};
  dataSave: any = {};
  dataVersion: any = {};
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;

  apiUrlService = '';
  dataInfoOld: any = {};
  remarkPopupVisible = false;

  accessMenu: any;
  popupVisible = false;
  popupFull = true;
  isSave = true;
  numberBoxDigi = 0;
  dateDisplay: string;

  constructor(private hotkeysService: HotkeysService,
    private router: Router, private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private refPricesService: RefPricesService
    , private excelsService: ExcelsService
    , private authService: AuthService
    , private sidebarService: SidebarService) {
    this.date = moment();
    this.dateOld = this.date;
    this.year = moment().year();
    this.month = moment().month() + 1;
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
    this.loaderService.show();
    this.apiUrlService = environment.apiUrlService;

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

  ngAfterViewInit(): void {
    this.loaderService.show();
    setTimeout(() => {
      this.yearChange();
    }, 500);
  }

  accessMenuList() {
    // 1 : Add,Edit, 2 : View Only
    this.authService.menuAll$.subscribe(res => {
      if (res && res.currentMenu) {
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

  // onSave() {
  //   //this.accessMenu == 1
  //   if (this.accessMenu == 1) {
  //     this.getDataSaveAll();

  //     let yearVersion = _.toInteger(this.year);
  //     let yearNow = moment().year();

  //     if (yearVersion > yearNow) {
  //       this.saveDataFuture(false);
  //     } else if (yearVersion < yearNow) {
  //       this.saveDataLast(false);
  //     } else {
  //       this.saveDataNow(false);
  //     }
  //     this.saveData();
  //   } else {
  //     Swal.fire({
  //       title: 'Access Denied',
  //       text: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจาก ไม่มีสิทธิ์',
  //       icon: 'error',
  //       showConfirmButton: true,
  //       confirmButtonText: 'ปิด',
  //       //timer: 1000
  //     });
  //   }
  //   // let datasave = this.referencePriceDataGrid.getDataSave();
  //   // let monthVersion = this.month;
  //   // let yearVersion = this.year;

  //   // if (this.dataInfo && this.dataInfo.month != monthVersion && _.toInteger(this.year) === moment().year()) {
  //   //   this.dataInfo.id = undefined;
  //   //   this.version = 0;
  //   // }

  //   // // let versionName = 'Reference Price เดือน ' + monthVersion + ' rev ' + this.version;//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
  //   // // let versionNameNew = 'Reference Price เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0

  //   // let versionName = 'Reference Price ปี ' + yearVersion; //version ที่จะ save
  //   // let versionNameNew = 'Reference Price ปี ' + yearVersion; //version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0

  //   // if(_.toInteger(this.year) != moment().year()){
  //   //   versionName += ' Draft version Rev ' + this.version;;
  //   //   versionNameNew += ' Draft version Rev ';
  //   // }else{
  //   //   versionName += ' เดือน ' + monthVersion + ' Rev ' + this.version;
  //   //   versionNameNew += ' เดือน ' + monthVersion + ' Rev '
  //   // }

  //   // // if (_.toInteger(this.year) > moment().year()) {
  //   // //   monthVersion = 0;
  //   // //   _.each(datasave, (item) => {
  //   // //     item.month = monthVersion;
  //   // //   })
  //   // //   versionName = 'Reference Price ปีล่วงหน้า rev ' + this.version;
  //   // //   versionNameNew = 'Reference Price ปีล่วงหน้า rev ';
  //   // // } else if (_.toInteger(this.year) < moment().year()) {
  //   // //   monthVersion = 13;
  //   // //   _.each(datasave, (item) => {
  //   // //     item.month = monthVersion;
  //   // //   })
  //   // //   versionName = 'Reference Price ปีล่วงหน้า rev ' + this.version;
  //   // //   versionNameNew = 'Reference Price ปีย้อนหลัง rev ';
  //   // // }

  //   // let textConfirm = '';
  //   // let saveNewVersion = false;

  //   // if (datasave.dataList && datasave.dataList.length > 0) {
  //   //   textConfirm = versionName + '<br/>';
  //   // }

  //   // if (datasave.dataManual && datasave.dataManual.length > 0) {
  //   //   if (this.version === 0) {
  //   //     saveNewVersion = true;
  //   //     this.versionNew = this.maxVersion + 1;
  //   //     versionNameNew += this.versionNew;
  //   //     textConfirm += versionNameNew + '<br/>';
  //   //   }

  //   // }
  //   // this.saveData(datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion);
  // }

  // // onSaveAs() {
  // //   let datasave = this.referencePriceDataGrid.getDataSave();
  // //   let monthVersion = this.month;
  // //   let yearVersion = this.year;
  // //   if (this.dataInfo && this.dataInfo.month != monthVersion && this.dataInfo.year != yearVersion) {
  // //     this.dataInfo.id = undefined;
  // //     this.version = 0;
  // //     this.maxVersion = -1;
  // //   }

  // //   // let versionNameNew = 'Reference Price เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
  // //   // if (_.toInteger(this.year) > moment().year()) {
  // //   //   monthVersion = 0;
  // //   //   _.each(datasave, (item) => {
  // //   //     item.month = monthVersion;
  // //   //   })
  // //   //   versionNameNew = 'Reference Price ปีล่วงหน้า rev ';
  // //   // } else if (_.toInteger(this.year) < moment().year()) {
  // //   //   monthVersion = 13;

  // //   //   _.each(datasave, (item) => {
  // //   //     item.month = monthVersion;
  // //   //   })
  // //   //   versionNameNew = 'Reference Price ปีย้อนหลัง rev ';
  // //   // }

  // //   let versionNameNew = 'Reference Price ปี ' + yearVersion; //version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0

  // //   if (_.toInteger(this.year) != moment().year()) {
  // //     versionNameNew += ' Draft version Rev ';
  // //   } else {
  // //     versionNameNew += ' เดือน ' + monthVersion + ' Rev '
  // //   }

  // //   let textConfirm = '';
  // //   let saveNewVersion = false;

  // //   if (datasave.dataManual && datasave.dataManual.length > 0) {
  // //     saveNewVersion = true;
  // //     this.versionNew = this.maxVersion + 1;
  // //     versionNameNew += this.versionNew;
  // //     textConfirm += versionNameNew + '<br/>';

  // //     this.saveData(datasave, textConfirm, '', saveNewVersion, versionNameNew, monthVersion);
  // //   }
  // //   else {
  // //     Swal.fire({
  // //       title: 'ไม่สามารถบันทึกได้',
  // //       text: 'เนื่องจากไม่มีการแก้ไขข้อมูลแบบ Manual',
  // //       icon: 'error',
  // //       showConfirmButton: true,
  // //       confirmButtonText: 'ปิด'
  // //       //timer: 1000
  // //     })
  // //   }
  // // }
  // onSaveAs() {
  //   //this.accessMenu == 1
  //   if (this.accessMenu) {
  //     this.getDataSaveAll();
  //     let yearVersion = _.toInteger(this.year);
  //     let yearNow = moment().year();

  //     if (yearVersion > yearNow) {
  //       this.saveDataFuture(true);
  //       if (this.checkDataManual() === true) {

  //         this.saveData(
  //         );
  //       } else {
  //         Swal.fire({
  //           title: 'ไม่สามารถบันทึกได้',
  //           text: 'เนื่องจากไม่มีการแก้ไขข้อมูลแบบ Manual',
  //           icon: 'error',
  //           showConfirmButton: true,
  //           confirmButtonText: 'ปิด',
  //           //timer: 1000
  //         });
  //       }
  //     } else if (yearVersion < yearNow) {
  //       this.saveDataLast(true);
  //       this.saveData(
  //       );
  //     } else {
  //       this.saveDataNow(true);
  //       if (this.checkDataManual() === true) {

  //         this.saveData(
  //         );
  //       } else {
  //         Swal.fire({
  //           title: 'ไม่สามารถบันทึกได้',
  //           text: 'เนื่องจากไม่มีการแก้ไขข้อมูลแบบ Manual',
  //           icon: 'error',
  //           showConfirmButton: true,
  //           confirmButtonText: 'ปิด',
  //           //timer: 1000
  //         });
  //       }
  //     }


  //   } else {
  //     Swal.fire({
  //       title: 'Access Denied',
  //       text: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจาก ไม่มีสิทธิ์',
  //       icon: 'error',
  //       showConfirmButton: true,
  //       confirmButtonText: 'ปิด',
  //       //timer: 1000
  //     });
  //   }
  // }
  getDataSaveAll() {
    this.dataSave = this.referencePriceDataGrid.getDataSave();
    this.monthSave = this.month;
    this.dataVersion = this.referencePriceHistory.getDataVersion();
  }
  saveDataLast(isSaveAs) {
    // กรณีบันทึกข้อมูลย้อนหลังเช่นปัจจุบันอยู่ที่ 2022 แต่ๆไปบันทึกข้อมูล 2021
    // column month = 13 เสมอ ส่วน version จะบวกไปเรื่อย
    this.monthSave = 13;
    this.versionName = 'Reference Price ปี ' + this.year + ' Back version Rev 0';
    this.versionSave = this.version;

    if (this.checkDataManual() === true) {
      if (isSaveAs === true) {
        this.getMaxVerionSave();
      } else {
        this.versionSaveNew = 1;
      }
      this.versionNameNew = 'Reference Price ปี ' + this.year + ' Back version Rev ' + (this.versionSaveNew);
    }



  }

  saveDataFuture(isSaveAs) {
    // กรณีบันทึกข้อมูลล่วงหน้าเช่นปัจจุบันอยู่ที่ 2022 แต่ๆไปบันทึกข้อมูล 2023
    // column month = 0 เสมอ ส่วน version จะบวกไปเรื่อย
    this.monthSave = 0;
    // this.versionName = 'Reference Price ปี ' + this.year + ' Draft version Rev 0';
    this.versionName = 'Reference Price ปี ' + this.year + ' เดือน ' + this.month + ' Rev 0';
    this.versionSave = this.version;

    if (this.checkDataManual() === true) {
      if (isSaveAs === true) {
        this.getMaxVerionSave();
      } else {
        this.versionSaveNew = 1;
      }
      // this.versionNameNew = 'Reference Price ปี ' + this.year + ' Draft version Rev ' + (this.versionSaveNew);
      this.versionNameNew = 'Reference Price ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSaveNew);
    }

  }

  saveDataNow(isSaveAs) {
    // กรณีบันทึกข้อมูลล่วงหน้าเช่นปัจจุบันอยู่ที่ 2022 แต่ๆไปบันทึกข้อมูล 2023
    // column month = 0 เสมอ ส่วน version จะบวกไปเรื่อย
    this.monthSave = this.month;
    this.versionName = 'Reference Price ปี ' + this.year + ' เดือน ' + this.monthSave + ' Rev 0';
    this.versionSave = this.version;

    if (this.checkDataManual() === true) {
      if (isSaveAs === true) {
        this.getMaxVerionSave();
      } else {
        this.versionSaveNew = 1;
      }
      this.versionNameNew = 'Reference Price ปี ' + this.year + ' เดือน ' + this.monthSave + ' Rev ' + (this.versionSaveNew);
    }

  }
  getMaxVerionSave() {
    const dataMaxVersion = _.filter(this.dataVersion, (item) => {
      return item.month === this.monthSave
    });
    if (dataMaxVersion.length > 0) {
      this.versionSaveNew = _.max(_.map(dataMaxVersion, 'version'));
      this.versionSaveNew += 1;
    } else {
      this.versionSaveNew = 1;
    }
  }

  checkDataManual() {
    if (this.dataSave.dataManual && this.dataSave.dataManual.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  // saveData() {
  //   let textConfirmSave = this.versionName;
  //   if (this.checkDataManual() === true) {
  //     textConfirmSave += '<br/>' + this.versionNameNew;
  //   }

  //   Swal.fire({
  //     title: '<h3>คุณต้องการบันทึกหรือไม่</h3>',
  //     icon: 'question',
  //     html: textConfirmSave,
  //     showCancelButton: true,
  //     confirmButtonText: 'ยืนยัน',
  //     cancelButtonText: 'ยกเลิก',
  //     cancelButtonColor: 'red',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.loaderService.show();
  //       let dataVersionSave: any = [];
  //       let dataVersion0: any = _.cloneDeep(this.dataInfo);
  //       let dataVersionNew: any = _.cloneDeep(this.dataInfo);

  //       dataVersion0.id = undefined;
  //       dataVersion0.year = this.year;
  //       dataVersion0.month = this.monthSave;
  //       dataVersion0.versionName = this.versionName;
  //       dataVersion0.remark = this.dataInfo.remark;
  //       dataVersion0.version = 0;

  //       _.each(this.dataSave.dataList, (item) => {
  //         item.month = this.monthSave;
  //         item.year = this.year;
  //       })
  //       if (this.checkDataManual() === true) {
  //         _.each(this.dataSave.dataManual, (item) => {
  //           item.month = this.monthSave;
  //           item.year = this.year;
  //           item.version = this.versionSaveNew > 0 ? this.versionSaveNew : this.versionSave;
  //         })

  //         dataVersionNew.id = undefined;
  //         dataVersionNew.year = this.year;
  //         dataVersionNew.month = this.monthSave;
  //         dataVersionNew.versionName = this.versionNameNew;
  //         dataVersionNew.version = this.versionSaveNew > 0 ? this.versionSaveNew : this.versionSave;
  //         dataVersionNew.remark = this.dataInfo.remark;
  //         dataVersionSave.push(dataVersionNew);
  //       }

  //       dataVersionSave.push(dataVersion0);
  //       let dataToDatabase: any = {};
  //       dataToDatabase.referencePrice = this.dataSave.dataList;
  //       dataToDatabase.manual = this.dataSave.dataManual;
  //       dataToDatabase.version = dataVersionSave;

  //       const observable: any[] = [];
  //       observable.push(this.refPricesService.save(dataToDatabase));

  //       forkJoin(observable).subscribe(
  //         (res) => {
  //           Swal.fire({
  //             title: '',
  //             text: 'บันทึกสำเร็จ',
  //             icon: 'success',
  //             showConfirmButton: false,
  //             // confirmButtonText: 'ปิด'
  //             timer: 1000,
  //           });
  //           this.yearChange();

  //           this.loaderService.hide();

  //         },
  //         (error) => {
  //           Swal.fire({
  //             title: 'บันทึกไม่สำเร็จ',
  //             text: error.message,
  //             icon: 'error',
  //             showConfirmButton: true,
  //             confirmButtonText: 'ปิด',
  //             //timer: 1000
  //           });
  //         }
  //       );
  //     } else {
  //       console.log('Cancel');
  //     }
  //   });
  // }

  yearChange() {
    this.versionSave = 0;
    this.versionSaveNew = 0;
    let yearVersion = _.toInteger(this.year);
    let yearNow = moment().year();

    if (yearVersion > yearNow) {
      this.month = 0;
    } else if (yearVersion < yearNow) {
      this.month = 13;
    } else {
      this.month = moment().month() + 1;
    }

    this.dateDisplay = moment(this.date).format('MMM-yyyy');
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('MM');

    this.referencePriceHistory.onYearChange(this.year, this.month, (dataInfo) => {
      this.dataInfo = dataInfo;
      this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      this.maxVersion = this.dataInfo.maxVersion ? this.dataInfo.maxVersion : 0;
      this.versionName = this.dataInfo.versionName;
      this.referencePriceDataGrid.onYearChange(this.year, this.month, this.version, this.maxVersion);
      this.referencePriceDataFromSmartPrice.onYearChange(this.year);

      if (_.toInteger(this.year) < moment().year() && this.month !== 13) {
        this.isSave = false;
      }
    })
  }

  onHistoryClick($event) {
    // console.log('$event >> ', $event);
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    // update at 2022/04/07 select month in version tab //
    this.month = this.dataInfo.month;
    this.date = moment(this.dataInfo.year + '-' + this.dataInfo.month + '-01');
    this.dateDisplay = moment(this.date).format('MMM-yyyy');
    // update at 2022/04/07 select month in version tab //
    this.referencePriceDataGrid.onYearChange(this.dataInfo.year, this.dataInfo.month, this.version, this.maxVersion);
    // if (_.toInteger(this.year) < moment().year() && this.dataInfo.month !== 13) {
    //   this.isSave = false;
    // } else {
    //   this.isSave = true;
    // }
  }

  onEventImport($event) {

    const importYear = moment(this.referencepriceImportExcel.date).year();

    if (_.toNumber(this.year) === _.toNumber(importYear)) {
      this.tabSet.tabs[0].active = true;
      this.referencePriceDataGrid.setData($event, this.month);
      this.popupVisible = false;
      Swal.fire({
        title: '',
        html: 'Import Excel สำเร็จ'
        , icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      })
    }
    else {

      this.year = importYear;

      if (_.toInteger(this.year) > moment().year()) {
        this.month = 0;
      } else if (_.toInteger(this.year) < moment().year()) {
        this.month = 13;
      } else {
        this.month = moment().month() + 1;
      }

      this.referencePriceHistory.onYearChange(importYear, this.month, (dataInfo) => {
        this.dataInfo = dataInfo;
        this.version = this.dataInfo.version ? this.dataInfo.version : 0;
        this.maxVersion = this.dataInfo.maxVersion ? this.dataInfo.maxVersion : 0;
        this.referencePriceDataGrid.onYearChange(this.year, this.month, this.version, this.maxVersion, $event, (res) => {
          this.tabSet.tabs[0].active = true;
          this.popupVisible = false;
          Swal.fire({
            title: '',
            html: 'Import Excel สำเร็จ'
            , icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          })
        });
        this.referencePriceDataFromSmartPrice.onYearChange(this.year);
      });
    }

    // this.dataInfo = $event;
    // this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    // this.costDataGrid.onYearChange(this.year, this.version, this.maxVersion);
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
    this.year = moment(this.date).year();
    this.dateOld = this.date;
    this.yearChange();
    this.modalRef.hide();
  }

  searchCancelClick() {
    // this.date = this.dateOld;
    this.modalRef.hide();
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  //เปลี่ยนวิธี save ใหม่
  onSave() {
    this.numberBoxReadOnly = true;
    let datasave = this.referencePriceDataGrid.getDataSave();
    let monthVersion = this.month;

    let saveNewVersion = false;

    this.version = this.version <= 0 ? 1 : this.version;
    let versionName = 'Reference Price ปี ' + this.year + ' เดือน ' + monthVersion + ' rev ' + (this.version - 1);//version ที่จะ save
    let versionNameNew = 'Reference Price ปี ' + this.year + ' เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';

    if (datasave.dataList && datasave.dataList.length > 0) {
      textConfirm = versionName + '<br/>';
    }

    this.saveData(datasave, textConfirm, versionName, saveNewVersion, versionNameNew, monthVersion);
  }

  onSaveAs() {
    this.numberBoxReadOnly = true;
    let datasave = this.referencePriceDataGrid.getDataSave();
    let monthVersion = this.month;


    // if (_.toInteger(this.year) > moment().year()) {
    //   monthVersion = 0;
    // } else if (_.toInteger(this.year) < moment().year()) {
    //   monthVersion = 13;
    // }
    let versionNameNew = 'Reference Price ปี ' + this.year + ' เดือน ' + monthVersion + ' rev ';//version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = '';
    let saveNewVersion = true;
    const refPricesVersion = this.referencePriceHistory.masterData.refPricesVersion;
    const data = _.find(refPricesVersion, (item) => {
      return item.year === this.year && item.month === this.month;
    })
    if (data) {
      this.versionNew = 1;
      this.version = 1;
    } else {
      this.versionNew = this.maxVersion + 1;
    }

    versionNameNew += (this.versionNew - 1);
    textConfirm += versionNameNew + '<br/>';

    this.saveData(datasave, textConfirm, '', saveNewVersion, versionNameNew, monthVersion);

    // if (datasave.dataManual && datasave.dataManual.length > 0) {
    //   saveNewVersion = true;

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

        if (_.toInteger(dataVersion.month) !== _.toInteger(monthVersion)) {
          dataVersion.id = undefined;
        }
        dataVersion.year = this.year
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = this.version;
        dataVersion.isApply = true;

        if (saveNewVersion === true) {
          dataVersionNew = dataVersion;
          dataVersionNew.year = this.year
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.isApply = true;
          dataVersionNew.remark = dataVersion.remark;
          dataVersionSave.push(dataVersionNew);
          dataVersion.isApply = false;
        }

        if (versionName !== '') {
          dataVersionSave.push(dataVersion);
        }
        _.each(datasave.dataList, (item) => {
          item.year = this.year
          item.month = monthVersion;
          item.version = this.versionNew === 0 ? this.version : this.versionNew;
        })

        _.each(datasave.dataManual, (item) => {
          item.year = this.year
          item.month = monthVersion;
          item.version = this.versionNew === 0 ? this.version : this.versionNew;
        })
          ; let dataToDatabase: any = {};
        dataToDatabase.referencePrice = datasave.dataList;
        dataToDatabase.referencePriceManual = datasave.dataManual;
        dataToDatabase.referencePriceVersion = dataVersionSave;

        const observable: any[] = [];
        observable.push(this.refPricesService.save(dataToDatabase));

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
  onSmartPriceForecastClick(data) {
    this.tabSet.tabs[0].active = true;
    this.referencePriceDataGrid.setDataFormSmartPrice(data);

  }
}
