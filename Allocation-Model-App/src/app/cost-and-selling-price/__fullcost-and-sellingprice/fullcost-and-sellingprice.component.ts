import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { FullCostsService } from './../../service/full-costs.service';
import { FullCostsManualService } from './../../service/full-costs-manual.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { forkJoin, Observable } from 'rxjs';
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
  @ViewChild('fullCostHistory') fullCostHistory: FullcostHistoryComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  //costHistory
  dataList: any = [];
  listMonth = [];
  isCollapsedAnimated = false;
  masterData: any = {};
  year: any = '';
  month: any = moment().format('M');
  formatMonthName = 'MMM-yyyy';
  version: any = 0;
  date: any;
  dateOld: any;
  dataInfo: any = {};
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;
  costList: any = [];
  costVersionList: any = [];
  referencePriceList: any = [];
  validateResult: any = { isValid: true };
  dateDisplay: any = '';

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

  constructor(
    private hotkeysService: HotkeysService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private fullCostsManualService: FullCostsManualService,
    private costsService: CostsService,
    private authService: AuthService,
    private masterCostProductsTypesService: MasterCostProductsTypesService,
    private refPricesService: RefPricesService,
    private calMarginService: CalMarginService
  ) {
    this.date = moment();
    this.dateOld = this.date;
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
    this.retrieveMasterData().subscribe(res => {
      // console.log("res >>>> ", res);
      this.costList = _.filter(res[0], (i) => {
        return i.name == "GSP Cash Cost ($/Ton)" || i.name == "GSP Full Cost ($/Ton)"
      });

      this.costVersionList = res[1];
      this.referencePriceList = res[2];
    });

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

  retrieveMasterData(): Observable<any> {
    const masterCostProductsTypes = this.masterCostProductsTypesService.getList()
    const costsService = this.costsService.getVersion(this.year, -1);
    const refPricesService = this.refPricesService.getVersion(this.year, -1);
    return forkJoin([masterCostProductsTypes, costsService, refPricesService]);
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
    let arrFullCost = this.fullCostDataGrid.getDataSave();
    let arrSellingPrice = this.sellingPriceDataGrid.getDataSave();

    let version = (this.version === 0 ? 0 : (this.version - 1));

    transectionObj.costProductTypeId = this.dataInfo.costProductTypeId;
    transectionObj.costVersionId = this.dataInfo.costVersionId;
    transectionObj.referencePriceVersionId = this.dataInfo.referencePriceVersionId;
    transectionObj.year = _.toNumber(this.year);
    transectionObj.month = _.toNumber(this.month);
    transectionObj.version = (this.version === 0 ? 1 : this.version);
    transectionObj.versionName = 'CalMargin($/Ton) เดือน ' + this.month + ' rev ' + version;

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
    let arrFullCost = this.fullCostDataGrid.getDataSave();
    let arrSellingPrice = this.sellingPriceDataGrid.getDataSave();

    let version = (this.version === 0 ? 0 : (this.version - 1) + 1);

    transectionObj.costProductTypeId = this.dataInfo.costProductTypeId;
    transectionObj.costVersionId = this.dataInfo.costVersionId;
    transectionObj.referencePriceVersionId = this.dataInfo.referencePriceVersionId;
    transectionObj.year = _.toNumber(this.year);
    transectionObj.month = _.toNumber(this.month);
    transectionObj.version = (this.version === 0 ? 1 : (this.version + 1));
    transectionObj.versionName = 'CalMargin($/Ton) เดือน ' + this.month + ' rev ' + version;

    transectionObj.fullCostManuals = arrFullCost;
    transectionObj.sellingPricesManuals = arrSellingPrice;

    console.log("Save as transectionObj >> ", transectionObj);
    // return;
    this.onReadySaveData(transectionObj);

  }

  onReadySaveData(transectionObj: any) {

    if (!transectionObj.fullCostManuals.length && !transectionObj.sellingPricesManuals.length) {
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ',
        text: 'กรุณากรอกข้อมูลก่อน',
        icon: 'error',
      })

      return;
    }

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
    this.month = moment($event.value).format('M');
    this.year = moment($event.value).format('yyyy');
    this.yearChange();
  }

  yearChange() {

    setTimeout(() => {
      this.dateDisplay = moment(this.date).format('MMM-yyyy');
    }, 100);

    this.fullCostHistory.onYearChange(this.month, this.year, (dataInfo) => {
      console.log("dataInfo :: ", dataInfo);

      this.dataInfo = dataInfo;
      this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      this.maxVersion = this.version;

      if (!this.dataInfo.costProductTypeId) {
        this.fullCostDataGrid.clearList();
        this.sellingPriceDataGrid.clearList();
        this.marginPerInitDataGrid.clearList();
        this.loaderService.hide();
        return;
      }

      if (this.dataInfo && this.dataInfo.costProductTypeId) {

        let costProductTypeId = this.dataInfo.costProductTypeId;
        let costVersionId = this.dataInfo.costVersionId;
        let referencePriceVersionId = this.dataInfo.referencePriceVersionId;

        this.calMarginService.getList(this.month, this.year, this.version, costProductTypeId, costVersionId, referencePriceVersionId).subscribe(resp => {
          this.dataInfo.calMarginData = resp;
          this.fullCostDataGrid.onYearChange(this.year, this.month, this.version, resp);
          this.sellingPriceDataGrid.onYearChange(this.year, this.month, this.version, resp);
          this.marginPerInitDataGrid.onYearChange(this.year, this.month, this.version, resp);
        })
      }
    });
  }

  onVersionChange($event) { }

  onHistoryClick($event) {
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.loaderService.show();
    if (!this.dataInfo.costProductTypeId) {
      this.fullCostDataGrid.clearList();
      this.sellingPriceDataGrid.clearList();
      this.loaderService.hide();
      return;
    }

    if (this.dataInfo && this.dataInfo.costProductTypeId) {

      let costProductTypeId = this.dataInfo.costProductTypeId;
      let costVersionId = this.dataInfo.costVersionId;
      let referencePriceVersionId = this.dataInfo.referencePriceVersionId;

      this.calMarginService.getList(this.month, this.year, this.version, costProductTypeId, costVersionId, referencePriceVersionId).subscribe(resp => {
        this.dataInfo.calMarginData = resp;
        this.fullCostDataGrid.onYearChange(this.year, this.month, this.version, resp);
        this.sellingPriceDataGrid.onYearChange(this.year, this.month, this.version, resp);
        this.marginPerInitDataGrid.onYearChange(this.year, this.month, this.version, resp);
        this.loaderService.hide();
      })

    }
    // this.fullCostDataGrid.onYearChange(this.year, this.month, this.version);
    // this.sellingPriceDataGrid.onYearChange(this.year, this.month, this.version);
    // this.marginPerInitDataGrid.onYearChange(this.year, this.month, this.version);
  }

  tabSellingChange($event) {
    this.sellingPriceDataGrid.gridRefresh();
  }

  tabMarginChange($event) {
    this.marginPerInitDataGrid.gridRefresh();
  }

  onGenFile($event) {

    if (!this.masterData.AbilityMonthly || this.masterData.AbilityMonthly == undefined) {
      Swal.fire({
        title: 'ไม่สารถ Optimization ข้อมูลได้',
        text: 'เนื่องจากไม่พบข้อมูล Ability Plan Rayong',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      });
      return false;
    }

    this.loaderService.show();

    let dataSend: any = {};
    let data: any = {};

    let arrProduct: any = [];
    let arrMonthlyConstrain: any = [];
    let arrMargin: any = [];
    let arrYearlyContract: any = [];
    let arrTank: any = [];
    let arrAbilitysMonthly: any = [];
    let arrAbilitysDaily: any = [];
    let arrFixOptimizeVariable: any = [];
    let arrMarginsPredict: any = [];

    _.each(this.masterData.masterProduct, (item, index) => {
      arrProduct.push({ id: (index + 1), myId: item.id, tank_id: null, product: item.productName });
    })

    _.each(this.masterData.volumeConstrainList, (item, index) => {

      if (item.product == 'C2' || item.product == 'C3' || item.product == 'Pentane') {

        data = {};
        let iDate = [];
        let iMin = [];
        let iMax = [];

        _.each(this.listMonth, (i) => {
          iDate.push(i.year + '-' + (i.month.toString().length == 1 ? "0" + i.month : i.month));
          iMin.push(((index + 1) == 7 && _.toNumber(item['minM' + i.month]) == 0 ? null : _.toNumber(item['minM' + i.month])));
          iMax.push(((index + 1) == 7 && _.toNumber(item['minM' + i.month]) == 0 ? null : _.toNumber(item['maxM' + i.month])));

        })

        const iFindProduct = _.find(_.cloneDeep(arrProduct), { product: item.product })

        data.key = {};
        data.date = iDate;
        data.min = iMin;
        data.max = iMax;
        data.product_id = (iFindProduct ? (item.product == 'C2' ? "1" : "7") : "1");
        data.id = _.toString((index + 1));

        arrMonthlyConstrain.push(data);
      }

    })

    const marginData = this.marginPerInitDataGrid;

    _.each(this.masterData.marginPerUnit, (item, index) => {

      if (item.product == 'C2' || item.product == 'C3' || item.product == 'Pentane') {

        data = {};
        let tmpDate = [];
        let tmpValue = [];

        _.each(this.listMonth, (i) => {
          tmpDate.push(i.year + '-' + (_.toString(i.month).length == 1 ? "0" + i.month : i.month));
          tmpValue.push(item['M' + i.month] ? _.toNumber(item['M' + i.month]) : 0);
        });

        const iFindTier = _.find(_.cloneDeep(this.tiers), { name: item.demand });

        data.key = { product: item.product, source: item.source, demand: item.demand, delivery_point: item.deliveryPoint };
        data.date = tmpDate;
        data.value = tmpValue;
        data.id = _.toString((iFindTier ? iFindTier.code : (index + 1)));

        data.tier = null;
        data.supplement = null;
        data.product_id = item.product == 'C2' ? "1" : "7";
        data.month_constrain_id = item.product == 'Pentane' ? '90' : data.id === '6' ? '4' : data.id;
        data.year_contract_id = (item.product == 'Pentane' ? "20" : (item.demand == ("C2 - SCG") ? "2" : "1"));

        arrMargin.push(data);

      }
    });

    _.each(this.masterData.masterContract, (item, index) => {

      arrYearlyContract.push({
        key: { "customer": item.customer },
        id: (index + 1),
        contract_relation_id: 18,
        start_contract: item.contractStartDate ? moment(item.contractStartDate).format("YYYY-MM-DD") : null,
        ending_contract: item.ending_contract ? moment(item.ending_contract).format("YYYY-MM-DD") : null,
        volume_actual: 1000,
        min: (item.volumePerYearMin ? item.volumePerYearMin : 0),
        max: (item.volumePerYearMax ? item.volumePerYearMax : 0)
      });

    });

    _.each(this.masterData.tankCapDataList, (item, index) => {
      data = {};
      data.key = {};
      let tmpDate = [];
      let tmpValue = [];
      let tmpRemainInventory = [];
      let tmpMin = [];
      let tmpMax = [];

      _.each(marginData.listMonth, (i) => {
        tmpDate.push(this.year + '-' + (_.toString(i.Month).length == 1 ? "0" + i.Month : i.Month));
        tmpValue.push(_.toNumber(item['M' + i.Month]));
        tmpRemainInventory.push(100);
        tmpMin.push(36);
        tmpMax.push(null);
      });

      data.date = tmpDate;
      data.value = tmpValue;
      data.remain_inventory = tmpRemainInventory;
      data.min = tmpMin;
      data.max = tmpMax;
      data.id = item.id;

      arrTank.push(data);

    })

    if (this.masterData.AbilityMonthly.length) {
      // Pentane
      data = {};
      const iFindProduct = _.find(_.cloneDeep(arrProduct), { myId: this.masterData.AbilityMonthly[0].productId });
      data.key = { product: iFindProduct.product, src: this.masterData.AbilityMonthly[0].product };
      let tmpDate = [];
      let tmpValue = [];

      _.each(this.masterData.AbilityMonthly, (item, index) => {
        tmpDate.push(item.yearValue + '-' + (_.toString(item.monthValue).length == 1 ? "0" + item.monthValue : item.monthValue));
        tmpValue.push(_.toNumber(item.value));
      });

      data.date = tmpDate;
      data.volume = tmpValue;
      data.id = "27";
      data.product_id = "7";

      arrAbilitysMonthly.push(data);

      // Ethane
      const product = [
        { productCode: "1", productName: 'Ethane' },
        // { productCode: 2, productName: 'C2' },
        // { productCode: 3, productName: 'C3' },
        // { productCode: 4, productName: 'LPG' },
        // { productCode: 5, productName: 'NGL' }
      ];

      const productionPlant = [
        { code: "1", name: 'GSP I' },
        { code: "2", name: 'GSP II' },
        { code: "3", name: 'GSP III' },
        { code: "5", name: 'GSP V' },
        { code: "6", name: 'GSP VI' },
        { code: "7", name: 'ESP' },
      ];

      if (this.masterData.AbilityPlanRayongDaily) {
        _.each(product, (a, ai) => {
          _.each(productionPlant, (b, bi) => {

            data = {};
            let tmpDate = [];
            let tmpValue = [];

            const tmpDaily = _.filter(_.cloneDeep(this.masterData.AbilityPlanRayongDaily), { product: a.productName, productionPlantRoman: b.name })
            if (tmpDaily.length) {
              _.each(tmpDaily, (x, i) => {
                if (x.date !== tmpDaily[0].date) {
                  tmpDate.push(x.year + '-' + (_.toString(x.month).length == 1 ? "0" + x.month : x.month));
                  tmpValue.push(_.toNumber(x.value));
                }
              });

              data.key = {
                product: a.productName,
                src: b.name
              };

              data.date = arrAbilitysMonthly[0].date;
              data.volume = tmpValue;
              data.id = _.toString((bi + 1));
              data.product_id = a.productCode;

              arrAbilitysMonthly.push(data);

            }
            else {
              const tmpData = _.find(_.cloneDeep(arrAbilitysMonthly), (x) => { return x.key.product === a.productName });
              if (tmpData) {

                data.key = {
                  product: a.productName,
                  src: b.name
                };

                data.date = tmpData.date;
                data.volume = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                data.id = _.toString((bi + 1));
                data.product_id = "1";

                arrAbilitysMonthly.push(data);

              }
            }
          });
        });
      }

      // console.log("arrAbilitysMonthly :: ", arrAbilitysMonthly);
      // return;
    }

    arrProduct = [
      {
        "id": "7",
        "tank_id": null,
        "product": "Pentane"
      },
      {
        "id": "1",
        "tank_id": null,
        "product": "Ethane"
      }
    ];

    arrYearlyContract = [
      {
        "id": "20",
        "key": {
          "customer": "ROC"
        },
        "contract_relation_id": 18,
        "start_contract": "2015-02-20",
        "ending_contract": "2025-02-19",
        "volume_actual": 40,
        "min": 26,
        "max": 87
      },
      {
        "key": {
          "customer": "GC"
        },
        "id": "1",
        "contract_relation_id": 1,
        "start_contract": "2020-01-01",
        "ending_contract": "2030-12-31",
        "volume_actual": null,
        "min": 1900,
        "max": 2500
      },
      {
        "key": {
          "customer": "SCG Chem / MOC"
        },
        "id": "2",
        "contract_relation_id": 2,
        "start_contract": "2020-01-01",
        "ending_contract": "2030-12-31",
        "volume_actual": null,
        "min": 150,
        "max": "null"
      }

    ];
    const C2SCGStandard = 15;
    let startDate = moment();
    // startDate = startDate.add(1, 'M');
    const endDate = moment(startDate).add(11, 'M');
    const fixOptimizeVariableDate = [];
    const fixOptimizeVariableValue = [];
    for (let index = startDate; index <= endDate; index = moment(index).add(1, 'M')) {
      fixOptimizeVariableDate.push(index.format("YYYY-MM"));
      fixOptimizeVariableValue.push(C2SCGStandard * 24 * index.daysInMonth() / 1000);
    }
    arrFixOptimizeVariable = [
      {
        "date": fixOptimizeVariableDate,
        "value": fixOptimizeVariableValue,
        "id": "7",
        "product_id": "1"
      }
    ];

    dataSend.products = arrProduct;
    dataSend.monthly_constrains = arrMonthlyConstrain;
    dataSend.yearly_contracts = arrYearlyContract;
    dataSend.tanks = arrTank;
    dataSend.margins_predict = [];
    dataSend.margins = arrMargin;
    dataSend.abilitys_monthly = arrAbilitysMonthly;
    dataSend.abilitys_daily = arrAbilitysDaily;
    dataSend.fix_variable_daily = [];
    dataSend.fix_optimize_variable = arrFixOptimizeVariable;
    console.log("dataSend :: ", dataSend);
    // return;
    this.fullCostsManualService.sendDataPentane(dataSend).subscribe(res => {
      this.loaderService.hide();
      console.log("sendDataPentane :: ", res);
      this.downloadExcel();
    });

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

  onAccept(evevt: any) {

    let dataValidation = this.onValidationData();
    if (!dataValidation) {
      return;
    }

    this.yearChange();

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

