import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { MasterReferencePricesService } from 'src/app/service/master-reference-prices.service';
import { ChoiceWithIndices } from '@flxng/mentions';
import * as moment from 'moment';
import { MasterUnitService } from 'src/app/service/master-unit.service';
import { MasterSourceService } from 'src/app/service/master-source.service';
import { MasterDeliveryPointService } from 'src/app/service/master-delivery-point.service';
import { MasterConditionOfSaleService } from 'src/app/service/master-condition-of-sale.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import Swal from 'sweetalert2';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { MasterSupplierService } from 'src/app/service/master-supplier.service';
import { MasterContractService } from 'src/app/service/master-contract.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserGroupListService } from 'src/app/service/user-group-list.service';
import { SystemModeService } from 'src/app/service/system-mode.service'

interface Formula {
  id: number;
  name: string;
}

@Component({
  selector: 'app-condition-setting',
  templateUrl: './condition-setting.component.html',
  styleUrls: ['./condition-setting.component.css']
})
export class ConditionSettingComponent implements OnInit {

  @Input() dataInfo: any = {};
  dataInfoPopup: any = {};
  selectInfo: any = { typeList: [], typeListID: [1] };
  dataList: any = {};
  dataPoint: any = [];
  @Input() dataPlant: any = [];
  @Input() dataProductGrade: any = {};
  dataType: any = [{ id: 1, dataPoint: [] }];
  dataTest: any = [];
  cel = "";
  isEdit: boolean = false;
  btnPopupSaveText = 'เพิ่มข้อมูล';
  mentionConfig: any = {
    mentions: []
  };

  mentionConfig$ = new BehaviorSubject<any>({});

  masterTier: any = [
    { id: 1, name: 'Tier 1' },
    { id: 2, name: 'Tier 2' },
    { id: 3, name: 'Tier 3' },
    { id: 4, name: 'Tier 4' },
    { id: 5, name: 'Tier 5' },
    { id: 6, name: 'Tier 6' },
    { id: 7, name: 'Tier 7' },
    { id: 8, name: 'Tier 8' },
    { id: 9, name: 'Tier 9' },
    { id: 10, name: 'Tier 10' }
  ]

  itemsss: any = [];
  dataRef: any = [];
  popupFormulaVisible = false;
  dataFormularRefList: any = [];
  dataFormularCostList: any = [];
  itemsFormula: any = [];

  popupVisible = false;
  popupVisibleCel = false;
  popupFull = false;
  isFormulaValidate = false;
  dataMaster: any = {};
  validateResult: any = { isValid: true };
  accessMenu: any;

  isMinVolumeTierNoLimit = true;
  isMaxVolumeTierNoLimit = true;

  tierRequired = false;
  requiredStar: any = '';

  readonlyMin: boolean = false;
  readonlyMax: boolean = false;

  systemMode: any = {
    isUserConfigFormula: false,
    isDigitalConfigFormula: false
  };

  onToolbarPreparing(e, item) {

    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fas fa-plus",
          onClick: this.addClick.bind(this, item),
        },
      }
    );
  }

  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  constructor(
    private loaderService: NgxSpinnerService,
    private masterReferencePricesService: MasterReferencePricesService,
    private masterCostService: MasterCostsService,
    private unitService: MasterUnitService,
    private masterSourceService: MasterSourceService,
    private masterDeliveryPointService: MasterDeliveryPointService,
    private masterConditionOfSaleService: MasterConditionOfSaleService,
    private productService: MasterProductsService,
    private masterSupplierService: MasterSupplierService,
    private contractService: MasterContractService,
    private authService: AuthService,
    private masterUserGroupListService: UserGroupListService,
    private systemModeService: SystemModeService
  ) {
    this.customMinVolumeTierNoLimitCallback = this.customMinVolumeTierNoLimitCallback.bind(this);
    this.customMaxVolumeTierNoLimitCallback = this.customMaxVolumeTierNoLimitCallback.bind(this);
    this.customSellConditionTierCallback = this.customSellConditionTierCallback.bind(this);
  }

  customMinVolumeTierNoLimitCallback(e) {
    if (this.isMinVolumeTierNoLimit) {
      return e.value >= 0;
    }
    return true;
  }

  customMaxVolumeTierNoLimitCallback(e) {
    if (this.isMaxVolumeTierNoLimit) {
      return e.value >= 0;
    }
    return true;
  }

  customSellConditionTierCallback(e) {
    if (this.tierRequired) {
      return !!e.value;
    }
    return true;
  }


  async ngOnInit(): Promise<void> {
    this.retrieveData();
    await this.accessMenuList();
  }

  ngAfterViewInit(): void { }

  async accessMenuList() {
    let userProfile = await this.authService.getUserProfile();
    this.systemMode = await this.systemModeService.getOne().toPromise();
    if (!this.systemMode) {
      this.systemMode = {
        isUserConfigFormula: false,
        isDigitalConfigFormula: false
      }
    }
    console.log("system mode", this.systemMode);
    let isDigital = false;
    if (userProfile) {
      console.log("userProfile", userProfile);
      let userGroupList = await this.masterUserGroupListService.getListByUserId({ user_id: userProfile?.userId, userGroupName: 'PTT Digital Support' }).toPromise();
      if (userGroupList && this.systemMode?.isDigitalConfigFormula == true) {
        this.systemMode.isUserConfigFormula = true;
      }
    }
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

    const masterFormula = this.masterReferencePricesService.getFormula();
    const masterFormulaCost = this.masterCostService.getFormula();
    const masterUnit = this.unitService.getList();
    const masterSource = this.masterSourceService.getList();
    const masterDeliveryPoint = this.masterDeliveryPointService.getList();
    const masterConditionOfSale = this.masterConditionOfSaleService.getList();
    const masterProduct = this.productService.getList();
    const masterSupplier = this.masterSupplierService.getList();
    const contractCondition = this.contractService.getCondition(this.dataInfo.ID);
    const contractProductGrade = this.contractService.getProductGrade(this.dataInfo.ID);

    return forkJoin([
      masterFormula,
      masterFormulaCost,
      masterUnit,
      masterSource,
      masterDeliveryPoint,
      masterConditionOfSale,
      masterProduct,
      masterSupplier,
      contractCondition,
      contractProductGrade
    ]);
  }

  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe((res) => {
      console.log('data', res);
      if (res) {

        this.dataFormularRefList = res[0];
        this.dataFormularCostList = res[1];
        this.dataMaster.unit = _.orderBy(_.filter(res[2], x => {
          return x.activeStatus == "Active" && _.toLower(x.fullName) === 'ton/month' || _.toLower(x.fullName) === 'ton/year'
        }), ['rowOrder'], ['ASC']);
        this.dataMaster.masterSource = _.orderBy(_.filter(res[3], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);
        this.dataMaster.masterDeliveryPoint = _.orderBy(_.filter(res[4], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);
        this.dataMaster.masterConditionOfSale = _.orderBy(_.filter(res[5], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);
        this.dataMaster.masterProduct = _.filter(res[6], { productShortName: "C3" });
        this.dataMaster.masterSupplier = res[7];

        const dataList = res[8];
        const dataProductGradeList = res[9];
        console.log("dataProductGradeList >> ", dataProductGradeList);
        console.log("dataList >> ", dataList);
        if (dataList) {
          _.each(dataList, (i, n) => {
            if (!this.dataList[i['customerPlantId']]) {
              this.dataList[i['customerPlantId']] = [];
            }

            i['conditionName'] = i['conditionsOfSaleName'];
            i['rowOrder'] = (i['rowOrder'] ? i['rowOrder'] : (n + 1));
            i['deliveryPointName'] = i['deliveryName'];
            i['deliveryPointId'] = i['deliveryId'];
            i['tireMin'] = i['minVolumeTier'];
            i['tireMax'] = i['maxVolumeTier'];
            i['tireUnitId'] = i['unitId'];
            i['tireUnitName'] = i['unitName'];
            i['cal'] = i['sellingPriceFormula'];
            i['conditionId'] = i['conditionsOfSaleId'];
            i['startDate'] = moment(i['startSellingPriceFomulaDate']);
            i['endDate'] = moment(i['endSellingPriceFomulaDate']);
            i['startDateDisplay'] = moment(i['startSellingPriceFomulaDate']).format('DD/MMM/YYYY');
            i['endDateDisplay'] = moment(i['endSellingPriceFomulaDate']).format('DD/MMM/YYYY');

            i['productGradeList'] = [];

            if (dataProductGradeList) {
              const filterGrade = _.orderBy(_.filter(_.cloneDeep(dataProductGradeList), { contractConditionOfSaleId: i['id'], customerPlantId: i['customerPlantId'] }), ['productGradName'], 'ASC');
              _.each(filterGrade, (x) => {

                let dataPrepare = {};
                dataPrepare['id'] = x['productGradId'];
                dataPrepare['productGrade'] = x['productGradName'];
                dataPrepare['name'] = x['productGradName'];

                i['productGradeList'].push(dataPrepare);
              });
            }

            this.dataList[i['customerPlantId']].push(i);

          });

          console.log(" this.dataList >> ", this.dataList);
        }

        this.itemsFormula = _.map(_.cloneDeep(this.dataFormularRefList), 'previous');
        this.itemsFormula = _.concat(
          this.itemsFormula,
          _.map(_.cloneDeep(this.dataFormularRefList), 'current')
        );
        // concat cost formula
        this.itemsFormula = _.concat(
          this.itemsFormula,
          _.map(_.cloneDeep(this.dataFormularCostList), 'current')
        );

        let itemsFormula: any = [];
        for (let index = 0; index < this.itemsFormula.length; index++) {
          itemsFormula.push({
            id: index,
            name: this.itemsFormula[index]
          });
        }
        this.itemsFormula = itemsFormula;

        this.mentionConfig.mentions.push({
          items: this.dataFormularRefList,
          triggerChar: '@',
          labelKey: 'parameterName'
        });
        this.mentionConfig.mentions.push({
          items: this.dataFormularCostList,
          triggerChar: '#',
          labelKey: 'parameterName'
        });
        this.mentionConfig$.next(this.mentionConfig);

      }
      this.loaderService.hide();
    });
  }

  text = '';
  loading = false;
  choices: Formula[] = [];
  mentions: ChoiceWithIndices[] = [];
  async loadChoices(searchTerm: string): Promise<Formula[]> {
    const formulars = await this.getFormulas();

    this.choices = formulars.filter((fm) => {
      const alreadyExists = this.mentions.some((m) => m.choice.name === fm.name);
      return !alreadyExists && fm.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

    return this.choices;
  }

  getChoiceLabel = (user: Formula): string => {
    return `${user.name}`;
  };

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    this.mentions = choices;
    // console.log('mentions:', this.mentions);
    if (this.dataInfoPopup.formula) {
      this.isFormulaValidate = false;
    }
    else {
      this.isFormulaValidate = true;
    }
  }

  onMenuShow(): void {
    // console.log('Menu show!');
  }

  onMenuHide(): void {
    // console.log('Menu hide!');
    this.choices = [];
  }

  copyClick(item, index) {
    this.dataInfoPopup.dataTest.splice(index + 1, 0, _.cloneDeep(item))
  }

  deleteDataTestClick(item, index) {
    this.dataInfoPopup.dataTest.splice(index, 1);
  }

  addClick($event: any) {

    if (this.accessMenu !== 1) {
      Swal.fire({
        title: 'Access Denied',
        text: 'ไม่สามารถทำรายการได้เนื่องจากไม่มีสิทธิ์',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
      });
      return;
    }

    this.isMinVolumeTierNoLimit = true;
    this.isMaxVolumeTierNoLimit = true;
    this.changeRequired(false);

    this.readonlyMin = false;
    this.readonlyMax = false;

    let tabSetActive = 0;
    _.each(this.tabSet.tabs, (it, i) => {
      if (it.active === true) {
        tabSetActive = i;
      }
    });
    // console.log("tabSetActive >> ", tabSetActive);
    let customerPlantId = this.dataPlant[tabSetActive]['id'];
    $event.customerPlantId = customerPlantId;
    $event.startDate = this.dataInfo?.startDate;
    $event.endDate = this.dataInfo?.endDate;

    const infoForm: any = { id: null, customerCode: null, customerName: null, customerShortName: null, plantData: [], isSaleSubCustomer: false, isEdit: false };
    // this.doEdit(infoForm);
    this.dataInfoPopup = _.cloneDeep($event);
    this.isEdit = false;
    this.btnPopupSaveText = 'เพิ่มข้อมูล';
    this.popupVisible = true;
    // console.log("this.dataInfoPopup >> ", this.dataInfoPopup);
  }

  editClick($event: any, data: any, item) {

    data.customerPlantId = item.id;
    this.dataInfoPopup = _.cloneDeep(data);

    const conditionFind = _.find(_.cloneDeep(this.dataMaster.masterConditionOfSale), { id: this.dataInfoPopup.conditionId });

    this.dataInfoPopup.tireUnit = this.dataInfoPopup.tireUnitId;
    this.dataInfoPopup.startDate = this.dataInfoPopup.startDate;
    this.dataInfoPopup.formula = this.dataInfoPopup.cal;
    this.dataInfoPopup.source = this.dataInfoPopup.sourceId;
    this.dataInfoPopup.deliveryPoint = this.dataInfoPopup.deliveryPointId;
    this.dataInfoPopup.product = this.dataInfoPopup.substituedProductId;
    this.dataInfoPopup.supplier = this.dataInfoPopup.supplierId;
    this.dataInfoPopup.conditionCode = _.toInteger(conditionFind['code']);

    this.dataInfoPopup.productGrade = [];
    if (this.dataInfoPopup.productGradeList) {
      _.each(this.dataInfoPopup.productGradeList, (item) => {
        this.dataInfoPopup.productGrade.push(item['id']);
      });
    }

    this.dataInfoPopup.conditionList = { id: this.dataInfoPopup.conditionId, name: this.dataInfoPopup.conditionName };
    this.dataInfoPopup.sourceList = { id: this.dataInfoPopup.sourceId, name: this.dataInfoPopup.sourceName };
    this.dataInfoPopup.deliveryPointList = { id: this.dataInfoPopup.deliveryPointId, name: this.dataInfoPopup.deliveryPointName };
    this.dataInfoPopup.productList = { id: this.dataInfoPopup.substituedProductId, productShortName: this.dataInfoPopup.substituedProductName };
    this.dataInfoPopup.unitList = { id: this.dataInfoPopup.tireUnitId, fullName: this.dataInfoPopup.tireUnitName };

    if (!this.dataInfoPopup.isMinVolumeTierNoLimit) {
      this.onCheckboxChanged({ target: { checked: false } }, 'min');
    }
    else {
      this.onCheckboxChanged({ target: { checked: true } }, 'min');
    }

    if (!this.dataInfoPopup.isMaxVolumeTierNoLimit) {
      this.onCheckboxChanged({ target: { checked: false } }, 'max');
    }
    else {
      this.onCheckboxChanged({ target: { checked: true } }, 'max');
    }

    console.log("editClick >>> ", this.dataInfoPopup);
    this.isEdit = true;
    this.btnPopupSaveText = 'แก้ไขข้อมูล';
    if (item.isCoppy === true) {
      this.isEdit = false;
      this.btnPopupSaveText = 'เพิ่มข้อมูล';
    }
    this.popupVisible = true;
  }

  doEdit(data?: any) {
    console.log("doEdit", data);
  }

  fullClick = () => {
    this.popupFull = !this.popupFull;
  }
  popupSaveClick = () => {

    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {

        if (this.dataInfoPopup.tireMin && this.dataInfoPopup.tireMax) {
          if (_.toNumber(this.dataInfoPopup.tireMin) > _.toNumber(this.dataInfoPopup.tireMax)) {
            Swal.fire({
              title: 'ทำรายการไม่สำเร็จ',
              text: 'Volume (Min) มากกว่า Volume (Max) !!',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'ปิด',
            });

            setTimeout(() => {
              this.loaderService.hide();
              this.tierRequired = false;
            }, 100);

            return;
          }
        }

        if (!this.dataInfoPopup.formula) {
          this.isFormulaValidate = true;
        }
        else {
          this.loaderService.show();
          this.isFormulaValidate = false;
        }

        if (this.checkFormula() == true) {
          console.log("this.isEdit >> ", this.isEdit);
          if (this.isEdit === false) {
            this.addPopupToList();
          }
          else {
            this.editPopupToList();
          }
        } else {
          Swal.fire({
            title: 'ทำรายการไม่สำเร็จ',
            text: 'สูตรไม่สามารถใช้งานได้ กรุณาตรวจสอบ !!',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด',
          });

          setTimeout(() => {
            this.loaderService.hide();
          }, 100);

        }

        this.validateResult.isValid = false;
      } else {
        // console.log("this.validateResult.brokenRules >> ", this.validateResult.brokenRules);
        if (this.dataInfoPopup.conditionId === 8 || this.dataInfoPopup.conditionId === 5) {
          this.validateResult.brokenRules[7].validator.focus();
        }
        else {
          this.validateResult.brokenRules[0].validator.focus();
        }
      }
    }
  }

  onProductGradeValueChanged(event: any) {
    if (event && event.value) {
      this.dataInfoPopup.productGradeList = [];
      if (this.dataInfoPopup.productGrade) {
        _.each(this.dataInfoPopup.productGrade, (x) => {
          const findProductGrade = _.find(_.cloneDeep(this.dataProductGrade), { id: x });
          if (findProductGrade) {
            this.dataInfoPopup.productGradeList.push({ id: findProductGrade.id, name: findProductGrade.productGrade });
          }
        });
      }
    }
  }

  addPopupToList() {

    console.log("this.dataInfoPopup >> ", this.dataInfoPopup);

    if (!this.dataList[this.dataInfoPopup['customerPlantId']]) {
      this.dataList[this.dataInfoPopup['customerPlantId']] = [];
    }

    const validationData = this.validationPopupData();
    // console.log("validationData >> ", validationData);
    if (!validationData) {
      Swal.fire({
        title: 'เพิ่มข้อมูลไม่สำเร็จ',
        text: 'กรุณาตรวจสอบเงื่อนไขขายเนื่องจากมีข้อมูลซ้ำกัน',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      });
      this.loaderService.hide();
      return;
    }

    let rowOrder = (this.dataList[this.dataInfoPopup['customerPlantId']] ? (this.dataList[this.dataInfoPopup['customerPlantId']].length + 1) : 1);

    this.dataList[this.dataInfoPopup['customerPlantId']].push({
      id: _.toUpper(uuid()),
      conditionId: this.dataInfoPopup['conditionList']['id'],
      conditionName: this.dataInfoPopup['conditionList']['name'],
      rowOrder: rowOrder,
      sourceId: this.dataInfoPopup['sourceList']['id'],
      sourceName: this.dataInfoPopup['sourceList']['name'],
      deliveryPointId: this.dataInfoPopup['deliveryPointList']['id'],
      deliveryPointName: this.dataInfoPopup['deliveryPointList']['name'],
      tireType: '',
      tireName: '',
      tireMin: this.dataInfoPopup['tireMin'],
      tireMax: this.dataInfoPopup['tireMax'],
      isMinVolumeTierNoLimit: this.dataInfoPopup['isMinVolumeTierNoLimit'],
      isMaxVolumeTierNoLimit: this.dataInfoPopup['isMaxVolumeTierNoLimit'],
      tireUnitId: this.dataInfoPopup?.unitList?.id,
      tireUnitName: this.dataInfoPopup?.unitList?.fullName,
      cal: this.dataInfoPopup['formula'],
      startDate: this.dataInfoPopup['startDate'],
      endDate: this.dataInfoPopup['endDate'],
      startDateDisplay: moment(this.dataInfoPopup['startDate']).format('DD/MMM/YYYY'),
      endDateDisplay: moment(this.dataInfoPopup['endDate']).format('DD/MMM/YYYY'),
      substituedProductId: (this.dataInfoPopup['productList'] ? this.dataInfoPopup['productList']['id'] : null),
      substituedProductName: (this.dataInfoPopup['productList'] ? this.dataInfoPopup['productList']['productShortName'] : null),
      substituedRate: (this.dataInfoPopup['substituedRate'] ? this.dataInfoPopup['substituedRate'] : null),
      supplierId: (this.dataInfoPopup['supplierList'] ? this.dataInfoPopup['supplierList']['id'] : null),
      supplierName: (this.dataInfoPopup['supplierList'] ? this.dataInfoPopup['supplierList']['fullName'] : null),
      productGradeList: this.dataInfoPopup['productGradeList'],
      customerPlantId: this.dataInfoPopup['customerPlantId'],
      demandName: this.dataInfoPopup['demandName'],
      tierNo: this.dataInfoPopup['tierNo'],
    });

    console.log("this.dataList >> ", this.dataList);
    this.popupVisible = false;
    setTimeout(() => {
      this.loaderService.hide();
    }, 100);
  }

  editPopupToList() {
    // console.log("this.dataInfoPopup >> ", this.dataInfoPopup);
    const validationData = this.validationPopupData();
    // console.log("validationData >> ", validationData);

    if (!validationData) {
      Swal.fire({
        title: 'แก้ไขข้อมูลไม่สำเร็จ',
        text: 'กรุณาตรวจสอบเงื่อนไขขายเนื่องจากมีข้อมูลซ้ำกัน',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      });
      this.loaderService.hide();
      return;
    }

    const editData = _.find(this.dataList[this.dataInfoPopup['customerPlantId']], { id: this.dataInfoPopup['id'] });
    console.log("editData>> ", editData);
    // console.log("this.dataInfoPopup >> ", this.dataInfoPopup);
    if (editData) {
      editData.conditionId = this.dataInfoPopup['conditionList']['id'];
      editData.conditionName = this.dataInfoPopup['conditionList']['name'];
      editData.sourceId = this.dataInfoPopup['sourceList']['id'];
      editData.sourceName = this.dataInfoPopup['sourceList']['name'];
      editData.deliveryPointId = this.dataInfoPopup['deliveryPointList']['id'];
      editData.deliveryPointName = this.dataInfoPopup['deliveryPointList']['name'];
      editData.tireMin = this.dataInfoPopup['tireMin'];
      editData.tireMax = this.dataInfoPopup['tireMax'];
      editData.isMinVolumeTierNoLimit = this.dataInfoPopup['isMinVolumeTierNoLimit'];
      editData.isMaxVolumeTierNoLimit = this.dataInfoPopup['isMaxVolumeTierNoLimit'];
      editData.tireUnitId = this.dataInfoPopup?.unitList?.id;
      editData.tireUnitName = this.dataInfoPopup?.unitList?.fullName;
      editData.cal = this.dataInfoPopup['formula'];
      editData.startDate = this.dataInfoPopup['startDate'];
      editData.endDate = this.dataInfoPopup['endDate'];
      editData.startDateDisplay = moment(this.dataInfoPopup['startDate']).format('DD/MMM/YYYY');
      editData.endDateDisplay = moment(this.dataInfoPopup['endDate']).format('DD/MMM/YYYY');
      editData.substituedProductId = (this.dataInfoPopup['productList'] ? this.dataInfoPopup['productList']['id'] : null);
      editData.substituedProductName = (this.dataInfoPopup['productList'] ? this.dataInfoPopup['productList']['productShortName'] : null);
      editData.substituedRate = (this.dataInfoPopup['substituedRate'] ? this.dataInfoPopup['substituedRate'] : null);
      editData.supplierId = (this.dataInfoPopup['supplierList'] ? this.dataInfoPopup['supplierList']['id'] : null);
      editData.supplierName = (this.dataInfoPopup['supplierList'] ? this.dataInfoPopup['supplierList']['fullName'] : null);
      editData.productGradeList = this.dataInfoPopup['productGradeList'];
      editData.customerPlantId = this.dataInfoPopup['customerPlantId'];
      editData.demandName = this.dataInfoPopup['demandName'];
      editData.tierNo = this.dataInfoPopup['tierNo'];

      this.popupVisible = false;
    }
    // console.log("this.dataList >> ", this.dataList);
    setTimeout(() => {
      this.loaderService.hide();
    }, 100);
  }

  validationPopupData() {

    let validationResult: boolean = true;
    let currentPopupData = this.dataInfoPopup;
    let filterData = _.find(_.cloneDeep(this.dataList[this.dataInfoPopup['customerPlantId']]), item => {
      return _.toUpper(item.conditionId) === _.toUpper(currentPopupData.conditionId)
        && _.toUpper(item.sourceId) === _.toUpper(currentPopupData['sourceList']['id'])
        && _.toUpper(item.deliveryPointId) === _.toUpper(currentPopupData['deliveryPointList']['id'])
        && _.toUpper(item.id) !== _.toUpper(currentPopupData['id'])
        && item.tierNo === currentPopupData.tierNo;
    });

    // console.log("filterData >>> ", filterData);
    let filterDate = null;
    if (filterData) {
      filterDate = _.find(_.cloneDeep(this.dataList[this.dataInfoPopup['customerPlantId']]), item => {
        return moment(currentPopupData['endDate']) <= moment(item['endDate'])
          || moment(currentPopupData['startDate']) < moment(item['startDate'])
          && moment(currentPopupData['endDate']) >= moment(item['endDate'])
          || moment(currentPopupData['startDate']) >= moment(item['startDate'])
          && moment(currentPopupData['startDate']) <= moment(item['endDate'])
      });
    }

    // console.log("filterDate >> ", filterDate);
    if (filterDate) {
      validationResult = false
    }

    return validationResult;
  }

  checkFormula() {
    let formular = this.dataInfoPopup.formula;

    console.log("this.dataFormularCostList >> ", this.dataFormularCostList);

    _.each(this.dataFormularCostList, (item) => {
      formular = _.replace(formular, new RegExp('#' + item.parameterName, "g"), Math.floor(Math.random() * 100))
    })

    _.each(this.dataFormularRefList, (item) => {
      formular = _.replace(formular, new RegExp('@' + item.parameterName, "g"), Math.floor(Math.random() * 100))
    })
    try {
      eval(formular);
      console.log('ผลลัพธ์', eval(formular));
      return true;

    } catch (e) {
      if (e instanceof SyntaxError) {
        return false;
      }
    }
  }

  getDataSave() {
    return this.dataList;
  }

  popupCancelClick = () => {
    this.dataInfo.formula = null;
    this.popupVisible = false;
    this.popupVisibleCel = false;
    this.changeRequired(false);

    const findOldData = _.find(this.dataList[this.dataInfoPopup['customerPlantId']], { id: this.dataInfoPopup['id'] });
    if (!findOldData?.isMinVolumeTierNoLimit) {
      this.onCheckboxChanged({ target: { checked: false } }, 'min');
    }
    else {
      this.onCheckboxChanged({ target: { checked: true } }, 'min');
    }

    if (!findOldData?.isMaxVolumeTierNoLimit) {
      this.onCheckboxChanged({ target: { checked: false } }, 'max');
    }
    else {
      this.onCheckboxChanged({ target: { checked: true } }, 'max');
    }

  }

  popupCelClick = () => {
    this.popupVisibleCel = false;

  }
  popupCelCancelClick = () => {
    this.popupVisibleCel = false;
  }

  showInfo(item) {
    this.popupVisibleCel = true;
    this.cel = item;
  }

  showFormulaInfo() {
    this.popupFormulaVisible = true;
  }

  popupFormulaCancelClick = () => {
    this.popupFormulaVisible = false;
  }

  onHidingFormulaClick() {
    this.popupFormulaVisible = false;
  }

  async getFormulas(): Promise<Formula[]> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loading = false;
        resolve(this.itemsFormula);
      }, 600);
    });
  }

  onSaleConditionChanged(event: any) {
    this.changeRequired(false);
    if (this.dataInfoPopup.conditionList) {
      this.dataInfoPopup.conditionCode = _.toInteger(this.dataInfoPopup.conditionList['code']);
      if (this.dataInfoPopup?.conditionList?.name === 'Tier') {
        this.changeRequired(true);
      }
    }
  }

  changeRequired(condition: boolean) {

    if (condition) {
      this.tierRequired = true;
      this.isMinVolumeTierNoLimit = true;
      this.isMaxVolumeTierNoLimit = true;
      this.requiredStar = '&nbsp;*';
    }
    else {
      this.requiredStar = '';
      this.tierRequired = false;
      this.isMinVolumeTierNoLimit = false;
      this.isMaxVolumeTierNoLimit = false;
    }

  }

  deleteClick(itemData: any) {
    console.log("itemData >>", itemData);
    if (itemData) {
      Swal.fire({
        title: '<h3>คุณต้องการลบข้อมูลหรือไม่</h3>',
        icon: 'warning',
        // html: 'Customer : ' + itemData.customerName + '<br>Source : ' + itemData.name,
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        cancelButtonColor: 'red'

      }).then((result) => {
        if (result.isConfirmed) {
          _.remove(this.dataList[itemData['customerPlantId']], { id: itemData['id'] });
        }
      });
    }
  }

  itemClick(event: any, data: any) {
    console.log("data >> ", data);
    if (event.itemData.text === 'Delete') {
      this.deleteClick(data);
    }
    else if (event.itemData.text === 'Copy') {
      let newData = _.cloneDeep(data);
      newData['id'] = uuid();
      // newData['startDate'] = null;
      // newData['endDate'] = null;
      this.editClick(event, newData, { id: newData['customerPlantId'], isCoppy: true });
    }
  }

  onCheckboxChanged(event: any, action: string) {

    if (event?.target?.checked === true) {
      if (action === 'min') {
        this.dataInfoPopup.tireMin = null;
        this.isMinVolumeTierNoLimit = false;
        this.readonlyMin = true;
      }
      else {
        this.dataInfoPopup.tireMax = null;
        this.isMaxVolumeTierNoLimit = false;
        this.readonlyMax = true;
      }
    }
    else {
      if (action === 'min') {
        this.isMinVolumeTierNoLimit = true;
        this.readonlyMin = false;
      }
      else {
        this.isMaxVolumeTierNoLimit = true;
        this.readonlyMax = false;
      }
    }
  }

  // isMinVolumeTierNoLimitChange(event: any) {
  //   if (event.value > -1 && this.dataInfoPopup?.conditionList?.name === 'Tier') {
  //     this.isMinVolumeTierNoLimit = false;
  //     this.readonlyMin = false;
  //   }
  // }

}
