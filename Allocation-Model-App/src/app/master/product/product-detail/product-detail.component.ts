import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { MasterSourceService } from 'src/app/service/master-source.service';
import { MasterDeliveryPointService } from 'src/app/service/master-delivery-point.service';
import { MasterReferencePricesService } from 'src/app/service/master-reference-prices.service';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { BehaviorSubject, forkJoin, observable, Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DxDataGridComponent,
  DxValidationGroupComponent,
} from 'devextreme-angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChoiceWithIndices } from '@flxng/mentions';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth.service';
import { UserGroupListService } from 'src/app/service/user-group-list.service';
import { SystemModeService } from 'src/app/service/system-mode.service';

// interface User {
//   id: number;
//   name: string;
// }

interface Formula {
  id: number;
  name: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})

export class ProductDetailComponent implements OnInit {
  dataInfo: any = {};
  dataInfograde: any = {};
  olddataInfograde: any = {};
  dataProduct: any = {};
  rowgradeEdit: any = 0;
  dataListProductFormular: any = [];
  dataGradeList: any = [];
  dataSourceList: any = [];
  dataDeliveryPointList: any = [];
  dataParameterRefPrice: any = [];
  dataParameterCost: any = [];
  popupVisible = false;
  popupgradeVisible = false;
  popupFormulaVisible = false;
  validateResult: any = { isValid: true };
  productId = uuid();
  dataRef: any = [];
  itemsFormula: any = [];
  isFormulaValidate = false;
  mentionConfig: any = {
    mentions: [
      // {
      //   items: ['Noah', 'Liam', 'Mason', 'Jacob'],
      //   triggerChar: '@',
      // },
      // {
      //   items: ['Cost1', 'Cost2', 'Cost3', 'Cost4'],
      //   triggerChar: '#',
      // },
    ],
  };
  mentionConfig$ = new BehaviorSubject<any>({});
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'fas fa-sync-alt',
          //  onClick: this.retrieveData.bind(this),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'fas fa-plus',
          onClick: this.addClick.bind(this),
        },
      }
    );
  }

  onToolbargradePreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'fas fa-sync-alt',
          //  onClick: this.retrieveData.bind(this),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'fas fa-plus',
          onClick: this.addgradeClick.bind(this),
        },
      }
    );
  }

  popupFull = false;
  accessMenu: any;
  sidebar: ISidebar;
  subscription: Subscription;
  systemMode: any = {
    isUserConfigFormula: false,
    isDigitalConfigFormula: false
  };

  @ViewChild('targetGroup', { static: true })
  validationGroup: DxValidationGroupComponent;
  @ViewChild('targetGroupGrade', { static: true })
  validationGroupGrade: DxValidationGroupComponent;
  @ViewChild('targetGroupProduct', { static: true })
  validationGroupProduct: DxValidationGroupComponent;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;

  constructor(
    private loaderService: NgxSpinnerService,
    private dataService: MasterProductsService,
    private activatedRoute: ActivatedRoute,
    private dataSourceService: MasterSourceService,
    private dataDeliveryPointService: MasterDeliveryPointService,
    private masterReferencePricesService: MasterReferencePricesService,
    private masterCostService: MasterCostsService,
    private router: Router,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private masterUserGroupListService: UserGroupListService,
    private systemModeService: SystemModeService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log('params', params);
      if (params.id) {
        this.productId = params.id;
      }
    });
    this.retrieveData();

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

  onReorderListAssessor = ($event: any) => {
    const visibleRows = $event.component.getVisibleRows();
    const toIndex = _.indexOf(
      this.dataListProductFormular,
      visibleRows[$event.toIndex].data
    );
    const fromIndex = _.indexOf(this.dataListProductFormular, $event.itemData);
    this.dataListProductFormular.splice(fromIndex, 1);
    this.dataListProductFormular.splice(toIndex, 0, $event.itemData);

    setTimeout(() => {
      // reorder
      _.each(this.dataListProductFormular, (item: any, index) => {
        if (item.rowOrder !== index + 1) {
          item.type = 'update';
        }
        item.rowOrder = index + 1;
      });
      // this.saveData(this.dataList);
      if (this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    }, 100);
  };

  retrieveListData() { }

  retrieveMasterData(): Observable<any> {
    const masterProduct = this.dataService.getOne(this.productId);
    const masterGrade = this.dataService.getGrade(this.productId);
    const masterSource = this.dataSourceService.getList();
    const masterDeliveryPoint = this.dataDeliveryPointService.getList();
    const masterFormula = this.masterReferencePricesService.getFormula();
    const masterFormulaCost = this.masterCostService.getFormula();
    const msaterFormulaList = this.dataService.getFormulaList(this.productId);
    return forkJoin([
      masterProduct,
      masterGrade,
      masterSource,
      masterDeliveryPoint,
      masterFormula,
      masterFormulaCost,
      msaterFormulaList,
    ]);
  }

  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe((res) => {
      console.log('data', res);
      if (res[0]) {
        this.dataProduct = res[0];
        this.dataProduct.isEdit = true;
      } else {
        this.dataProduct.isEdit = false;
        this.dataProduct.id = this.productId;
      }
      this.dataGradeList = res[1];
      this.dataSourceList = res[2];
      this.dataDeliveryPointList = res[3];
      this.dataParameterRefPrice = res[4];
      this.dataParameterCost = res[5];

      if (this.dataProduct.productGrade) {
        this.dataGradeList = this.dataProduct.productGrade;
      }

      if (res[6]) {
        this.dataListProductFormular = res[6];
        this.getNameFormulaList();
      }

      this.loaderService.hide();

      // this.itemsFormula = _.map(_.cloneDeep(this.dataFormularList), 'previous');
      // this.itemsFormula = _.concat(
      //   this.itemsFormula,
      //   _.map(_.cloneDeep(this.dataFormularList), 'current')
      // );

      // // concat cost formula
      // this.itemsFormula = _.concat(
      //   this.itemsFormula,
      //   _.map(_.cloneDeep(this.dataFormularCostList), 'current')
      // );

      // let itemsFormula: any = [];
      // for (let index = 0; index < this.itemsFormula.length; index++) {
      //   // this.itemsFormula[index] = _.replace(this.itemsFormula[index], '@', '');
      //   itemsFormula.push({
      //     id: index,
      //     name: this.itemsFormula[index]
      //   });
      // }

      // // console.log("itemsFormula :: >>  ", itemsFormula);
      // this.itemsFormula = itemsFormula;

      // console.log('this.itemsFormula', this.itemsFormula);

      this.mentionConfig.mentions.push({
        items: this.dataParameterRefPrice,
        triggerChar: '@',
        labelKey: 'parameterName'
      });
      this.mentionConfig.mentions.push({
        items: this.dataParameterCost,
        triggerChar: '#',
        labelKey: 'parameterName'
      });
      this.mentionConfig$.next(this.mentionConfig);
    });
    this.loaderService.hide();
  }

  getNameFormulaList() {
    for (let index = 0; index < this.dataListProductFormular.length; index++) {
      let productGrade = _.find(_.cloneDeep(this.dataGradeList), {
        id: this.dataListProductFormular[index].productGradeId,
      });
      let source = _.find(_.cloneDeep(this.dataSourceList), {
        id: this.dataListProductFormular[index].sourceId,
      });
      let deliveryPoint = _.find(_.cloneDeep(this.dataDeliveryPointList), {
        id: this.dataListProductFormular[index].deliveryPointId,
      });
      if (productGrade) {
        this.dataListProductFormular[index].productGrade =
          productGrade.productGrade;
      }
      if (source) {

        this.dataListProductFormular[index].source = source.name;
      }
      if (deliveryPoint) {

        this.dataListProductFormular[index].deliveryPoint = deliveryPoint.name;
      }
    }
  }

  gradeAddClick() {
    let id = uuid();
    this.dataGradeList.push({
      id: id,
      productId: this.productId,
      productGrade: null,
    });
  }

  gradeChange(event, data) {
    console.log('item', data);
    _.replace(this.dataGradeList, (item) => {
      return item.id == data.id;
    });
  }

  deletegradeClick(event, data) {

    if (this.accessMenu !== 1) {
      Swal.fire({
        title: 'Access Denied',
        text: 'ไม่สามารถทำรายการได้เนื่องจากไม่มีสิทธิ์',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
      });

      return false;
    }

    _.remove(this.dataGradeList, (item) => {
      return item.id == data.id;
    });
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

      return false;
    }

    const infoForm: any = {
      id: uuid(),
      name: null,
      rowOrder: 0,
      isEdit: false,
    };
    this.doEdit(infoForm);
  }

  stateGridGrade() {
    if (this.dataGradeList && this.dataGradeList.instance) {
      setTimeout(() => {
        this.dataGradeList.instance.state(null);
      }, 200);
    }
  }

  addgradeClick($event: any) {

    if (this.accessMenu !== 1) {
      Swal.fire({
        title: 'Access Denied',
        text: 'ไม่สามารถทำรายการได้เนื่องจากไม่มีสิทธิ์',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
      });

      return false;
    }

    const infoForm: any = {
      id: uuid(),
      name: null,
      rowOrder: 0,
      productId: this.productId,
      isEdit: false,
    };
    this.doEditgrade(infoForm);
  }

  doEdit(data?: any) {
    console.log('doEdit', data);
    this.popupVisible = true;
    this.dataInfo = data;
  }

  doEditgrade(data?: any) {
    console.log('doEdit', data);
    this.popupgradeVisible = true;
    this.dataInfograde = data;
    this.olddataInfograde = _.cloneDeep(this.dataInfograde);
  }

  showFormulaInfo() {
    this.popupFormulaVisible = true;
  }

  editClick($event: any, itemData: any) {
    if ($event && itemData) {
      itemData.isEdit = true;
      this.doEdit(itemData);
    }
  }

  editgradeClick($event: any, itemData: any, row: any) {
    if ($event && itemData) {
      this.rowgradeEdit = row;
      itemData.isEdit = true;
      this.doEditgrade(itemData);
    }
  }

  popupCancelClick = () => {
    this.dataInfo = {};
    this.popupVisible = false;
    //  this.retrieveData();
  };

  popupgradeCancelClick = () => {
    this.dataGradeList[this.rowgradeEdit] = _.cloneDeep(this.olddataInfograde);
    this.dataInfograde = _.clone(this.olddataInfograde);
    this.popupgradeVisible = false;
    //  this.retrieveData();
  };

  popupFormulaCancelClick = () => {
    this.popupFormulaVisible = false;
  };

  onHidingClick() {
    this.dataInfo = {};
    this.popupVisible = false;
    //  this.retrieveData();
  }

  onHidinggradeClick() {
    this.dataInfo = {};
    this.popupgradeVisible = false;
    //  this.retrieveData();
  }

  onHidingFormulaClick() {
    this.popupFormulaVisible = false;
  }

  SaveClick = () => {
    this.loaderService.show();
    if (this.validationGroupProduct && this.validationGroupProduct.instance) {
      this.validateResult = this.validationGroupProduct.instance.validate();

      if (this.validateResult.isValid) {
        this.saveData();
      } else {
        this.validateResult.brokenRules[0].validator.focus();
        this.loaderService.hide();
      }
    }
  };
  // validateData() {
  //   const dataEmpty = _.find(this.dataGradeList, (item) => {
  //     return !item.productGrade
  //   });
  //   if (dataEmpty) {

  //     Swal.fire({
  //       title: 'บันทึกไม่สำเร็จ',
  //       text: "เกรดผลิตภัณฑ์ ห้ามเป็นค่าว่าง",
  //       icon: 'error',
  //       showConfirmButton: true,
  //       confirmButtonText: 'ปิด',
  //       //timer: 1000
  //     });
  //     return false;
  //   }
  //   return true;
  // }
  saveData() {
    const observable: any[] = [];
    const resData: any = {};

    resData.product = {};
    resData.grades = [];
    resData.formulas = [];

    resData.product = this.dataProduct;
    resData.grades = this.dataGradeList;
    resData.formulas = this.dataListProductFormular;

    console.log('resData', resData);
    console.log('Json resData', JSON.stringify(resData));
    // return;

    // Insert
    if (this.dataProduct.isEdit) {
      observable.push(this.dataService.update(resData));
    }
    // update
    else {
      observable.push(this.dataService.create(resData));
    }

    forkJoin(observable).subscribe(
      (res) => {
        this.loaderService.hide();
        Swal.fire({
          title: '',
          text: 'บันทึกสำเร็จ',
          icon: 'success',
          showConfirmButton: false,
          // confirmButtonText: 'ปิด'
          timer: 1000,
        });

        this.router.navigate(['master', 'product'])
        //this.retrieveData();
      },
      (error) => {
        // console.log("error >>> ", error);
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: error.error.message,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
          //timer: 1000
        });
      }
    );
  }

  popupSaveClick = () => {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      //console.log("this.validateResult >> ", this.validateResult);
      if (this.validateResult.isValid) {
        if (!this.dataInfo.fullcostFormula) {
          this.isFormulaValidate = true;
          Swal.fire({
            title: 'ทำรายการไม่สำเร็จ',
            text: 'กรุณาระบุ Formula !',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด',
          });
          return;
        }
        else {
          this.isFormulaValidate = false;
        }

        if (this.checkFormula() == true) {
          this.confirmPopupData();
          this.popupVisible = false;
          this.validateResult.isValid = false;
        } else {
          Swal.fire({
            title: 'ทำรายการไม่สำเร็จ',
            text: 'สูตรไม่สามารถใช้งานได้ กรุณาตรวจสอบ !!',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด',
          });
        }
      } else {

        if (!this.dataInfo.fullcostFormula) {
          this.isFormulaValidate = true;
        }

        if (this.dataGradeList.length) {
          this.validateResult.brokenRules[(this.validateResult.brokenRules.length - 1)].validator.focus();
        }
        else {
          this.validateResult.brokenRules[0].validator.focus();
        }
      }
    }
  };

  popupgradeSaveClick = () => {
    if (this.validationGroupGrade && this.validationGroupGrade.instance) {
      this.validateResult = this.validationGroupGrade.instance.validate();
      //console.log("this.validateResult >> ", this.validateResult);
      if (this.validateResult.isValid) {

        if (!this.dataInfograde.productGrade) {
          Swal.fire({
            title: 'ทำรายการไม่สำเร็จ',
            text: 'กรุณาระบุ เกรดผลิตภัณฑ์ !',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด',
          });
          return;
        } else {
          this.confirmPopupgradeData();
          this.popupgradeVisible = false;
          this.validateResult.isValid = false;
        }

      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }

  };

  checkFormula() {
    let formular = this.dataInfo.fullcostFormula;
    // let strFormula = '';
    // let chkAssign = true;

    // for (let index = 0; index < formular.length; index++) {
    //   if (formular[index].indexOf('@') !== -1) {
    //     if (formular[index].match(new RegExp("@", "g")).length == 1 && formular[index].charAt(0) == "@") {
    //       formular[index] = Math.floor(Math.random() * 100);
    //     } else {
    //       chkAssign = false;
    //     }
    //   }
    //   strFormula += formular[index];
    // }

    // console.log('สูตร : ', strFormula);
    _.each(this.dataParameterCost, (item) => {
      formular = _.replace(formular, new RegExp('#' + item.parameterName, "g"), Math.floor(Math.random() * 100))
    })

    _.each(this.dataParameterRefPrice, (item) => {
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

  confirmPopupData() {
    let productGrade = _.find(_.cloneDeep(this.dataGradeList), {
      id: this.dataInfo.productGradeId,
    });
    let source = _.find(_.cloneDeep(this.dataSourceList), {
      id: this.dataInfo.sourceId,
    });
    let deliveryPoint = _.find(_.cloneDeep(this.dataDeliveryPointList), {
      id: this.dataInfo.deliveryPointId,
    });
    if (productGrade) {

      this.dataInfo.productGrade = productGrade.productGrade;
    }
    if (source) {
      this.dataInfo.source = source.name;
    }
    if (deliveryPoint) {
      this.dataInfo.deliveryPoint = deliveryPoint.name;
    }


    this.dataInfo.productId = this.productId;

    const entryIndex = this.dataListProductFormular.findIndex(
      (entry) => entry.id === this.dataInfo.id
    );
    if (entryIndex > -1) {
      this.dataListProductFormular[entryIndex] = this.dataInfo;
    } else {
      this.dataInfo.rowOrder = this.dataListProductFormular.length + 1;
      this.dataListProductFormular.push(this.dataInfo);
    }
    this.popupVisible = false;
    // Swal.fire({
    //   title: '',
    //   text: 'ทำรายการสำเร็จ',
    //   icon: 'success',
    //   showConfirmButton: false,
    //   timer: 1000,
    // });
  }

  confirmPopupgradeData() {

    const entryIndex = this.dataGradeList.findIndex(
      (entry) => entry.id === this.dataInfograde.id
    );
    if (entryIndex > -1) {
      this.dataGradeList[entryIndex] = this.dataInfograde;
    } else {
      // this.dataInfo.rowOrder = this.dataListProductFormular.length + 1;
      this.dataGradeList.push(this.dataInfograde);
    }
    this.popupgradeVisible = false;
    // Swal.fire({
    //   title: '',
    //   text: 'ทำรายการสำเร็จ',
    //   icon: 'success',
    //   showConfirmButton: false,
    //   timer: 1000,
    // });
  }
  onCancelClick(event: any) {
    this.router.navigate(['master', 'product']);
  }

  fullClick = () => {
    this.popupFull = !this.popupFull;
  };


}
