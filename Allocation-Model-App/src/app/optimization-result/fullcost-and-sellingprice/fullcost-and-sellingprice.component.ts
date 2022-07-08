import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { FullCostsService } from './../../service/full-costs.service';
import { FullCostsManualService } from './../../service/full-costs-manual.service';
import { Component, Input, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';
import { DxDataGridComponent, DxSelectBoxComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FullcostDataGridComponent } from './component/fullcost-data-grid/fullcost-data-grid.component';
import { FullcostHistoryComponent } from './component/fullcost-history/fullcost-history.component';
import { SellingpriceDataGridComponent } from './component/sellingprice-data-grid/sellingprice-data-grid.component';
import { environment } from '../../../environments/environment';
import { MarginperunitDataGridComponent } from './component/marginperunit-data-grid/marginperunit-data-grid.component';
import { CostsService } from 'src/app/service/costs.service';
import { AuthService } from 'src/app/service/auth.service';
import { MasterCostProductsTypesService } from 'src/app/service/master-product-cost-types.service';
import { RefPricesService } from 'src/app/service/reference-prices.service';
import { CalMarginService } from 'src/app/service/cal-margin.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { SmartPriceDataGridComponent } from './component/smart-price-data-grid/smart-price-data-grid.component';

@Component({
  selector: 'app-fullcost-and-sellingprice',
  templateUrl: './fullcost-and-sellingprice.component.html',
  styleUrls: ['./fullcost-and-sellingprice.component.css']
})
export class FullcostAndSellingpriceComponent implements OnInit {

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
  @ViewChild('fullCostDataGrid') fullCostDataGrid: FullcostDataGridComponent;
  @ViewChild('sellingPriceDataGrid') sellingPriceDataGrid: SellingpriceDataGridComponent;
  @ViewChild('marginPerInitDataGrid') marginPerInitDataGrid: MarginperunitDataGridComponent;
  @ViewChild('SmartPriceDataGrid') SmartPriceDataGrid: SmartPriceDataGridComponent;
  @ViewChild('fullCostHistory') fullCostHistory: FullcostHistoryComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('costVersionSelectBox', { static: true }) costVersionSelectBox: DxSelectBoxComponent;
  @ViewChild('referencePriceVersionSelectBox', { static: true }) referencePriceVersionSelectBox: DxSelectBoxComponent;
  @ViewChild('costProductTypeSelectBox', { static: true }) costProductTypeSelectBox: DxSelectBoxComponent;
  //costHistory
  dataList: any = [];
  listMonth = [];
  isCollapsedAnimated = false;
  masterData: any = {};
  year: any = '';
  month: any = 1;
  formatMonthName = 'MMM-yyyy';
  version: any = 0;
  date: any;
  dateOld: any;
  dataInfo: any = {};
  dataCondition: any = {};
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;
  costList: any = [];
  costVersionList: any = [];
  referencePriceList: any = [];
  fullCostManualList: any = [];
  sellingPriceManualList: any = [];
  validateResult: any = { isValid: true };
  dateDisplay: any = '';
  sidebar: ISidebar;
  subscription: Subscription;
  isFirstLoad: boolean = true;
  isViewFullCost = true;
  isViewSellingPrice = false;
  isViewMargin = false;
  tiers: any = [
    {
      code: 90,
      name: 'Pentane Tier1 - ROC',
      value: 1

    },
    {
      code: 91,
      name: 'Pentane Tier2 - ROC',
      value: 2

    },
    {
      code: 92,
      name: 'Pentane Tier3 - ROC',
      value: 3
    }
  ];

  accessMenu: any;
  @Input() dynamicColumns: any[] = [];

  fullcostList: any = [];
  sellingPriceList: any = [];
  marginPerUnitList: any = [];
  versionId = '';
  // fullCostGridRefreshSubject: Subject<any> = new Subject();
  // sellingPriceGridRefreshSubject: Subject<any> = new Subject();
  // marginPerUnitGridRefreshSubject: Subject<any> = new Subject();
  constructor(
    private hotkeysService: HotkeysService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private fullCostsManualService: FullCostsManualService,
    private costsService: CostsService,
    private authService: AuthService,
    private masterCostProductsTypesService: MasterCostProductsTypesService,
    private refPricesService: RefPricesService,
    private calMarginService: CalMarginService,
    private sidebarService: SidebarService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.date = moment();
    this.dateOld = this.date;
    this.year = moment().year();
    this.month = moment().month() + 1;
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {

      if (this.accessMenu !== 1) {
        Swal.fire({
          title: 'Access Denied',
          text: 'ไม่สามารถทำรายการได้ เนื่องจาก ไม่มีสิทธิ์',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
        });

        return;
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

        return;
      }

      this.onSaveAs();
      return false;
    }));

  }

  async ngOnInit(): Promise<void> {
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

  registerEvent() {
    this.unregisterEvent();
    setTimeout(() => {
      if (this.costVersionSelectBox && this.costVersionSelectBox.instance) {
        this.costVersionSelectBox.instance.option('onValueChanged', this.onAccept);
      }
      if (this.referencePriceVersionSelectBox && this.referencePriceVersionSelectBox.instance) {
        this.referencePriceVersionSelectBox.instance.option('onValueChanged', this.onAccept);
      }
      if (this.costProductTypeSelectBox && this.costProductTypeSelectBox.instance) {
        this.costProductTypeSelectBox.instance.option('onValueChanged', this.onAccept);
      }
      //
    }, 200);
  }

  unregisterEvent() {

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.loaderService.show();
    console.log('versionId', this.versionId)
    if (this.versionId) {
      this.calMarginService.getVersionById(this.versionId).subscribe((res: any) => {
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

  retrieveMasterData(): Observable<any> {
    const masterCostProductsTypes = this.masterCostProductsTypesService.getList()
    const costsService = this.costsService.getVersion(this.year, -1);
    const refPricesService = this.refPricesService.getVersion(this.year, -1);
    const fullCostManual = this.calMarginService.getFollCostManual(this.month, this.year, this.version);
    const sellingPriceManual = this.calMarginService.getSellingPriceManual(this.month, this.year, this.version);
    return forkJoin([masterCostProductsTypes, costsService, refPricesService, fullCostManual, sellingPriceManual]);
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

  onValidationData() {

    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        return true;
      }
      else {
        this.validateResult.brokenRules[0].validator.focus();
        return false;
      }
    }
  }

  onSave() {

    let dataValidation = this.onValidationData();
    if (!dataValidation) {
      return;
    }

    this.numberBoxReadOnly = true;
    let transectionObj: any = {};
    let arrFullCost = this.fullCostDataGrid.getDataSave(false);
    let arrSellingPrice = this.sellingPriceDataGrid.getDataSave(false);

    let version = (this.version === 0 ? 0 : (this.version - 1));

    transectionObj.costProductTypeId = this.dataCondition.costProductTypeId;
    transectionObj.costVersionId = this.dataCondition.costVersionId;
    transectionObj.referencePriceVersionId = this.dataCondition.referencePriceVersionId;
    transectionObj.year = _.toNumber(this.year);
    transectionObj.month = _.toNumber(this.month);
    transectionObj.version = (this.version === 0 ? 1 : this.version);
    transectionObj.versionName = 'CalMargin($/Ton) ปี ' + this.year + ' เดือน ' + this.month + ' rev ' + version;

    transectionObj.fullCostManuals = arrFullCost;
    transectionObj.sellingPricesManuals = arrSellingPrice;

    console.log("Save transectionObj >> ", transectionObj);
    // return;
    this.onReadySaveData(transectionObj);

  }

  onSaveAs() {

    let dataValidation = this.onValidationData();
    if (!dataValidation) {
      return;
    }

    this.numberBoxReadOnly = true;

    let transectionObj: any = {};
    let arrFullCost = this.fullCostDataGrid.getDataSave(true);
    let arrSellingPrice = this.sellingPriceDataGrid.getDataSave(true);

    let version = (this.version === 0 ? 0 : (this.version - 1) + 1);

    transectionObj.costProductTypeId = this.dataInfo.costProductTypeId;
    transectionObj.costVersionId = this.dataInfo.costVersionId;
    transectionObj.referencePriceVersionId = this.dataInfo.referencePriceVersionId;
    transectionObj.year = _.toNumber(this.year);
    transectionObj.month = _.toNumber(this.month);
    transectionObj.version = (this.version === 0 ? 1 : (this.version + 1));
    transectionObj.versionName = 'CalMargin($/Ton) ปี ' + this.year + ' เดือน ' + this.month + ' rev ' + version;

    transectionObj.fullCostManuals = arrFullCost;
    transectionObj.sellingPricesManuals = arrSellingPrice;

    console.log("Save as transectionObj >> ", transectionObj);
    // return;
    this.onReadySaveData(transectionObj);

  }

  onReadySaveData(transectionObj: any) {

    // if (!transectionObj.fullCostManuals.length && !transectionObj.sellingPricesManuals.length) {
    //   Swal.fire({
    //     title: 'บันทึกไม่สำเร็จ',
    //     text: 'กรุณากรอกข้อมูลก่อน',
    //     icon: 'error',
    //   })

    //   return;
    // }

    this.numberBoxReadOnly = true;
    Swal.fire({
      title: '<h3>คุณต้องการบันทึกหรือไม่</h3>',
      icon: 'question',
      html: transectionObj.versionName,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: 'red'

    }).then((result) => {

      if (result.isConfirmed) {

        const observable: any[] = [];
        observable.push(this.calMarginService.save(transectionObj));

        forkJoin(observable).subscribe(res => {
          this.yearChange();
          Swal.fire({
            title: '',
            text: 'บันทึกสำเร็จ',
            icon: 'success',
          })
        }, error => {
          Swal.fire({
            title: 'บันทึกไม่สำเร็จ',
            text: error.error.message,
            icon: 'error',
          })
        });

      } else {
        console.log('Cancel');
      }

    });

  }

  onYearChange($event) {
    console.log('$event', $event)
    this.month = moment($event.value).month() + 1;
    this.year = moment($event.value).year();
    this.yearChange();
  }

  yearChange() {
    this.loaderService.show();
    setTimeout(() => {
      this.dateDisplay = moment(this.date).format('MMM-yyyy');
    }, 100);

    this.listMonth = []
    let dateStart = moment(this.year + '-' + this.month + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const data: any = {
        year: yearStart,
        month: monthStart,
        monthName: dateStart.format(this.formatMonthName),
      };

      this.listMonth.push(data);
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];

    this.dynamicColumns.push({
      dataField: 'productName',
      code: 'product',
      caption: 'Product',
      // groupIndex: 0,
      // width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'unitName',
      code: 'unit',
      caption: 'Unit',
      // width: 100,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'sourceName',
      code: 'source',
      caption: 'Source',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'demandName',
      code: 'demand',
      caption: 'Demand',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'deliveryName',
      code: 'deliveryPoint',
      caption: 'Delivery Point',
      width: 180,
      fixed: true,
      fixedPosition: 'left',
      cellTemplate: 'formulaTemplate',

    });

    _.each(this.listMonth, (item, index) => {
      this.dynamicColumns.push({
        dataField: 'M' + item.month + item.year,
        code: item.month + item.year,
        monthIndex: index,
        caption: item.monthName,
        dataType: 'number',
        cellTemplate: 'cellTemplate',
      });
    });

    this.fullCostHistory.onYearChange(this.month, this.year, (dataInfo) => {
      console.log("dataInfo :: ", dataInfo);
      // this.dataInfo = dataInfo;
      // this.version = this.dataInfo.version ? this.dataInfo.version : 0;

      if (this.versionId) {
        this.dataInfo = _.find(this.fullCostHistory.masterData.calMarginVersion, (item) => {
          return item.version === this.version;
        })
        this.fullCostHistory.setDataInfo(this.dataInfo);

      } else {
        this.dataInfo = dataInfo;
        this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      }

      this.SmartPriceDataGrid.onYearChange(this.month, this.year);
      this.maxVersion = this.fullCostHistory.maxVersion;
      this.retrieveMasterData().subscribe(res => {
        // console.log("res >>>> ", res);
        this.costList = _.filter(res[0], (i) => {
          return i.name == "GSP Cash Cost ($/Ton)" || i.name == "GSP Full Cost ($/Ton)"
        });

        this.costVersionList = res[1];
        this.referencePriceList = res[2];
        this.fullCostManualList = res[3];
        this.sellingPriceManualList = res[4];
        if (!this.dataInfo.costProductTypeId) {
          this.fullCostDataGrid.clearList();
          this.sellingPriceDataGrid.clearList();
          this.marginPerInitDataGrid.clearList();


          if (this.dataCondition) {
            this.dataInfo.costProductTypeId = this.dataCondition.costProductTypeId;
            this.dataInfo.costVersionId = this.dataCondition.costVersionId;
            this.dataInfo.referencePriceVersionId = this.dataCondition.referencePriceVersionId;
          }

        }

        if (this.dataInfo && this.dataInfo.costProductTypeId) {

          if (this.isFirstLoad) {
            this.dataCondition.costProductTypeId = this.dataInfo.costProductTypeId;
            this.dataCondition.costVersionId = this.dataInfo.costVersionId;
            this.dataCondition.referencePriceVersionId = this.dataInfo.referencePriceVersionId;
          }

          let costProductTypeId = this.dataInfo.costProductTypeId;
          let costVersionId = this.dataInfo.costVersionId;
          let referencePriceVersionId = this.dataInfo.referencePriceVersionId;

          this.calMarginService.getList(this.month, this.year, this.version, costProductTypeId, costVersionId, referencePriceVersionId).subscribe(resp => {
            // console.log("resp >> ", resp);
            this.masterData.calMarginData = resp;
            this.calDataToDataGrid(() => {
              setTimeout(() => {
                this.isFirstLoad = false;
                this.registerEvent();
                console.log(111111)
                this.loaderService.hide();
              }, 100);
            })
          })
        } else {
          this.costList = _.filter(res[0], (i) => {
            return i.name == "GSP Cash Cost ($/Ton)" || i.name == "GSP Full Cost ($/Ton)"
          });

          let data = _.find(this.costVersionList, 'id', 0);
          this.dataCondition.costVersionId = data.id;
          data = _.find(this.referencePriceList, 'id', 0);
          this.dataCondition.referencePriceVersionId = data.id;
          data = _.find(this.costList, 'id', 1);
          this.dataCondition.costProductTypeId = data.id;
          this.onAccept(null);
          this.registerEvent();
        }
      });

    });
  }
  calDataToDataGrid = (callBack) => {
    let productData = _.uniqBy(_.cloneDeep(this.masterData.calMarginData), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());
    this.fullcostList = [];
    this.sellingPriceList = [];
    this.marginPerUnitList = [];
    let objFullCost: any = {}, objSellingPrice: any = {}, objMarginPerUnit: any = {};
    productData = _.orderBy(productData, ['productName', 'customerPlantName'], ['asc', 'asc']);
    _.each(productData, (item) => {
      objFullCost = _.cloneDeep(item);
      objSellingPrice = _.cloneDeep(item);
      objMarginPerUnit = _.cloneDeep(item);
      const data = _.filter(this.masterData.calMarginData, (itemData) => {
        return itemData.productName === item.productName && itemData.customerName === item.customerName && itemData.customerPlantName === item.customerPlantName && itemData.sourceId === item.sourceId && itemData.deliveryId === item.deliveryId && itemData.demandName === item.demandName && itemData.conditionsOfSaleId === item.conditionsOfSaleId
      })
      _.each(this.listMonth, (i) => {
        objFullCost.id = objSellingPrice.id = objMarginPerUnit.id = _.toUpper(uuid());
        const findData = _.find(data, (x) => {
          return x.productName === item.productName && _.toNumber(x.monthValue) === _.toNumber(i.month) && _.toNumber(x.yearValue) === _.toNumber(i.year)
        });

        // find manual
        let manualValue = _.find(_.cloneDeep(this.fullCostManualList), it => {
          return it.product === item.productName
            && it.source === item.sourceName
            && it.deliveryPoint === item.deliveryName
            && it.demand === item.demandName
            && _.toNumber(it.valueMonth) === _.toNumber(i.month)
            && _.toNumber(it.year) === _.toNumber(i.year)
        });

        let fullCostValue = (manualValue ? manualValue.value : (findData && findData['fullCostValue'] ? findData['fullCostValue'] : 0));

        if (manualValue) {
          objFullCost['isManualM' + i.month + i.year] = true;
          objFullCost['calculateM' + i.month + i.year] = (findData && findData['fullCostValue'] ? findData['fullCostValue'] : 0)
        }

        objFullCost['M' + i.month + i.year] = (fullCostValue ? fullCostValue : 0);
        objFullCost['formula'] = (findData && findData['fullcostFormulaText'] ? (findData['fullcostFormulaText'] ? findData['fullcostFormulaText'] : '') : '');


        // find manual  FullCost
        manualValue = _.find(_.cloneDeep(this.sellingPriceManualList), it => {
          return it.product === item.productName
            && it.source === item.sourceName
            && it.deliveryPoint === item.deliveryName
            && it.demand === item.demandName
            && _.toNumber(it.monthValue) === _.toNumber(i.month)
            && _.toNumber(it.year) === _.toNumber(i.year)
        });

        // find manual  Selling Price
        let sellingPriceValue = (manualValue ? manualValue.value : (findData && findData['sellingPriceValue'] ? findData['sellingPriceValue'] : 0));
        objSellingPrice['M' + i.month + i.year] = (sellingPriceValue ? sellingPriceValue : 0);
        if (manualValue) {
          objSellingPrice['isManualM' + i.month + i.year] = true;
          objSellingPrice['calculateM' + i.month + i.year] = (findData && findData['sellingPriceValue'] ? findData['sellingPriceValue'] : 0)
        }
        objSellingPrice['formula'] = (findData && findData['sellingPriceFormulaText'] ? (findData['sellingPriceFormulaText'] ? findData['sellingPriceFormulaText'] : '') : '');

        // MarginPrerUnit = Selling Price - Full Cost
        objMarginPerUnit['M' + i.month + i.year] = sellingPriceValue - fullCostValue;

      });

      this.fullcostList.push(objFullCost);
      this.sellingPriceList.push(objSellingPrice);
      this.marginPerUnitList.push(objMarginPerUnit);
    });
    this.gridOnYearChange().subscribe(() => {
      callBack();
    })
  }
  gridOnYearChange(): Observable<any> {
    // const sellingPrice = this.calMarginService.getList(this.month, this.year, this.version, conditionHeader.costProductTypeId, conditionHeader.costVersionId, conditionHeader.referencePriceVersionId);
    const fullCost = this.fullCostDataGrid.onYearChange(this.year, this.month, this.version, this.fullcostList, this.dynamicColumns, this.listMonth);
    const sellingPrice = this.sellingPriceDataGrid.onYearChange(this.year, this.month, this.version, this.sellingPriceList, this.dynamicColumns, this.listMonth);
    const margin = this.marginPerInitDataGrid.onYearChange(this.year, this.month, this.version, this.marginPerUnitList, this.dynamicColumns, this.listMonth);
    return forkJoin([[fullCost], [sellingPrice], [margin]]);
  }
  onVersionChange($event) { }

  onHistoryClick($event) {
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.loaderService.show();

    this.month = this.dataInfo.month;
    this.date = moment(this.dataInfo.year + '-' + this.dataInfo.month + '-01');
    this.dateDisplay = moment(this.date).format('MMM-yyyy');

    this.fullCostDataGrid.clearList();
    this.sellingPriceDataGrid.clearList();
    this.marginPerInitDataGrid.clearList();

    this.dataCondition.costProductTypeId = null;
    this.dataCondition.costVersionId = null;
    this.dataCondition.referencePriceVersionId = null;

    if (this.dataInfo && this.dataInfo.costProductTypeId) {

      let costProductTypeId = this.dataInfo.costProductTypeId;
      let costVersionId = this.dataInfo.costVersionId;
      let referencePriceVersionId = this.dataInfo.referencePriceVersionId;

      this.dataCondition.costProductTypeId = this.dataInfo.costProductTypeId;
      this.dataCondition.costVersionId = this.dataInfo.costVersionId;
      this.dataCondition.referencePriceVersionId = this.dataInfo.referencePriceVersionId;

      this.calMarginService.getList(this.month, this.year, this.version, costProductTypeId, costVersionId, referencePriceVersionId).subscribe(resp => {
        this.masterData.calMarginData = resp;
        this.calDataToDataGrid(() => {
          setTimeout(() => {
            this.loaderService.hide();
          }, 100);
        })
      })

    }
  }

  tabFullCostChange($event) {
    this.loaderService.show();
    setTimeout(() => {
      this.fullCostDataGrid.gridRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }

  tabSellingChange($event) {
    this.loaderService.show();
    setTimeout(() => {
      this.sellingPriceDataGrid.gridRefresh(() => {
        console.log(111111)
        this.loaderService.hide();
      });
    }, 100);
  }

  tabMarginChange($event) {
    this.loaderService.show();
    setTimeout(() => {
      this.marginPerInitDataGrid.gridRefresh(() => {
        console.log(111111)
        this.loaderService.hide();
      });
    }, 100);

  }

  downloadExcel() {
    let url_allodevapp = environment.apiModel;

    window.setTimeout(function () {
      window.location.href = url_allodevapp + 'static/merge_allocation.xlsx';
    }, 500);

    window.setTimeout(function () {
      window.location.href = url_allodevapp + 'static/balance.xlsx';
    }, 1000);

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
    // this.date = this.dateOld;
    this.modalRef.hide();
  }

  volumeConstrainPrepareData() {
    if (this.masterData.volumeConstrainKtForm) {
      this.masterData.volumeConstrainList = _.cloneDeep(this.masterData.volumeConstrainKtForm)
      _.each(this.masterData.volumeConstrainList, (item) => {
        const data = _.filter(this.masterData.volumeConstrainKt, (itemData) => {
          return itemData.product === item.product && itemData.unit === item.unit
            && itemData.source === item.source
            && itemData.demand === item.demand
        })

        _.each(this.listMonth, (itemMonth) => {
          const dataFormBase = _.find(data, (itemBase) => {
            return itemBase.month === itemMonth.month && itemBase.year === itemMonth.year
          })
          item['isCalculateM' + itemMonth.month] = dataFormBase ? dataFormBase.isCalculate : item.isCalculate
          item['minM' + itemMonth.month] = dataFormBase ? dataFormBase.min : item.min
          item['maxM' + itemMonth.month] = dataFormBase ? dataFormBase.max : item.max
        })
      })
    }
  }

  tankcapPrepareData() {
    // this.month = this.month + 1;
    this.masterData.tankCapDataList = _.orderBy(this.masterData.tankCap, ['rowOrder'], ['asc']);
    // console.log("this.masterData.tankCapDataList :: ", this.masterData.tankCapDataList);
  }

  calMarginNextYeay(month: any, cal: any, dataItem: any) {

    if (month < (_.toNumber(this.month) + 1)) {

      const datasellCostNext = _.find(_.cloneDeep(this.masterData.sellCostNextYear), (it) => {
        return dataItem.product === it.product && dataItem.source === it.source && dataItem.demand === it.demand && dataItem.deliveryPoint === it.deliveryPoint
      });

      const datafullCostNext = _.find(_.cloneDeep(this.masterData.fullCostNextYear), (it) => {
        return dataItem.product === it.product && dataItem.source === it.source && dataItem.demand === it.demand && dataItem.deliveryPoint === it.deliveryPoint
      });

      let isCal = (datasellCostNext['M' + month] ? datasellCostNext['M' + month] : 0) - (datafullCostNext['M' + month] ? datafullCostNext['M' + month] : 0);
      return isCal;

    }
    else {

      return cal;
    }
  }

  displayVersion(item: any) {
    if (item) {
      return `${item.versionName}`;
    } else {
      return '';
    }
  }

  onAccept = ($event: any) => {
    this.loaderService.show();
    // let dataValidation = this.onValidationData();
    // if (!dataValidation) {
    //   return;
    // }
    if (!this.dataCondition.costVersionId || !this.dataCondition.referencePriceVersionId || !this.dataCondition.costProductTypeId) {
      return;
    }

    // this.yearChange();
    this.calMarginService.getList(this.month, this.year, this.version, this.dataCondition.costProductTypeId, this.dataCondition.costVersionId, this.dataCondition.referencePriceVersionId).subscribe(resp => {
      // console.log("resp >> ", resp);
      this.masterData.calMarginData = resp;
      this.calDataToDataGrid(() => {
        setTimeout(() => {
          console.log(111111)
          this.loaderService.hide();
        }, 100);
      })
    });

  }

  onFullCostUpdateData($event) {
    console.log('onFullCostUpdateData >>> ', $event);
    this.marginPerInitDataGrid.onFullCostSellingPriceManualChangeValue('fullCost', $event);
  }

  onSellingPriceUpdateData($event) {
    console.log('onSellingPriceUpdateData >>> ', $event);
    this.marginPerInitDataGrid.onFullCostSellingPriceManualChangeValue('sellingPrice', $event);
  }

}

