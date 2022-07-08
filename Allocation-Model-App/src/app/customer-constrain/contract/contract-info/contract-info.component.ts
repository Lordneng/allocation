import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MasterCustomerService } from 'src/app/service/master-customer.service';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { MasterUnitService } from 'src/app/service/master-unit.service';
import { ConditionSettingComponent } from '../component/condition-setting/condition-setting.component';
import { MasterContractService } from 'src/app/service/master-contract.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
import * as moment from 'moment';
import { MasterContractTypeService } from 'src/app/service/master-contract-type.service';
import { AuthService } from 'src/app/service/auth.service';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-contract-info',
  templateUrl: './contract-info.component.html',
  styleUrls: ['./contract-info.component.css']
})
export class ContractInfoComponent implements OnInit {
  dataInfo: any = {
    yearVolumnMin: 0,
    yearVolumnMax: 0,
    plantList: [],
    plantListID: []
  };
  selectInfo: any = { typeList: [], typeListID: [1] };
  dataList: any = [];
  dataPoint: any = [];
  dataType: any = [{ id: 1, dataPoint: [] }];
  dataTest: any = [];
  dataProductGrade: any = [];
  params: any = {};
  dataMaster: any = {};
  copyMsg: string = '';
  validateResult: any = { isValid: true };
  isEdit = false;
  isLoading = true;
  accessMenu: any;
  unitLabel: string = '(Ton)';

  sidebar: ISidebar;
  subscription: Subscription;

  @ViewChild('conditionSetting', { static: true }) conditionSetting: ConditionSettingComponent;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderService: NgxSpinnerService,
    private customerService: MasterCustomerService,
    private productService: MasterProductsService,
    private unitService: MasterUnitService,
    private contractService: MasterContractService,
    private masterContractTypeService: MasterContractTypeService,
    private authService: AuthService,
    private sidebarService: SidebarService,
  ) {

    this.activatedRoute.params.subscribe(params => {
      this.params.ID = (params.ID ? params.ID : null);
      this.params.ISCOPY = (params.ISCOPY ? params.ISCOPY : null);

      this.dataInfo.ID = (this.params.ID ? this.params.ID : _.toUpper(uuid()));
    });

  }

  ngOnInit(): void {

    if (!this.dataList) {
      this.dataList = [];
    }

    console.log("this.params >> ", this.params);
    if (this.params.ISCOPY) {
      this.copyMsg = '[Copy]';
    }

    this.retrieveListData();

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

  ngAfterViewInit(): void { }

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
    const masterCustomer = this.customerService.getList();
    const masterProduct = this.productService.getList();
    const masterUnit = this.unitService.getList();
    const masterContract = this.contractService.getList();
    const masterContractType = this.masterContractTypeService.getList();
    const contractInfo = this.contractService.getOne(this.dataInfo.ID);
    const contractPlant = this.contractService.getPlant(this.dataInfo.ID);
    // const contractCondition = this.contractService.getCondition(this.dataInfo.ID);
    return forkJoin([masterCustomer, masterProduct, masterUnit, masterContract, masterContractType, contractInfo, contractPlant]);
  }

  retrieveListData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("res >>> ", res);
      if (res) {

        this.dataMaster.customers = _.orderBy(_.filter(res[0], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);
        this.dataMaster.products = _.orderBy(_.filter(res[1], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);
        this.dataMaster.masterUnit = _.orderBy(_.filter(res[2], x => {
          return x.activeStatus == "Active" && _.toLower(x.fullName) === 'ton/month' || _.toLower(x.fullName) === 'ton/year'
        }), ['rowOrder'], ['ASC']);
        this.dataMaster.masterContract = res[3];
        this.dataMaster.masterContractType = _.orderBy(_.filter(res[4], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);

        if (res[5]) {
          this.isEdit = true;
          this.dataInfo = res[5];
          this.dataInfo.contractName = this.dataInfo.name;
          this.dataInfo.contractType = this.dataInfo.contractTypeId;
          this.dataInfo.yearVolumnMin = this.dataInfo.minVolumn;
          this.dataInfo.yearVolumnMax = this.dataInfo.maxVolumn;
          this.dataInfo.startDate = this.dataInfo.startContractDate;
          this.dataInfo.endDate = this.dataInfo.endContractDate;
          this.dataInfo.forecastVolume = this.dataInfo.totalForecastVolumn;
          this.dataInfo.actualVolume = this.dataInfo.totalActualVolumn;

          if (this.params.ISCOPY != null) {
            this.dataInfo.startDate = null;
            this.dataInfo.endDate = null;
            this.dataInfo.contractNumber = null;
          }

          this.dataInfo.plantList = [];
          this.dataInfo.plantListID = [];
          // console.log("this.dataInfo >> ", this.dataInfo);
        }

        if (res[6]) {
          this.dataInfo.plantList = _.orderBy(res[6], ['customerPlantName'], ['ASC']);
          _.each(this.dataInfo.plantList, i => {
            this.dataInfo.plantListID.push(i.customerPlantId);
          });

          setTimeout(() => {
            this.isLoading = false;
            this.onPlantChange();
          }, 500);
        }
      }

    });

    console.log("this.dataMaster >> ", this.dataMaster);
    setTimeout(() => {
      this.loaderService.hide();
    }, 200);

  }

  onProductChanged() {

    if (this.dataInfo && this.dataInfo.productId) {
      this.productService.getGrade(this.dataInfo.productId).subscribe(res => {
        this.dataProductGrade = res;
        this.conditionSetting.dataProductGrade = this.dataProductGrade;
      });

      if (this.dataInfo?.productList?.productCode == 'NGL') {
        this.unitLabel = "(Q3)";
      }
      else {
        this.unitLabel = "(Ton)";
      }
    }
    else {
      this.unitLabel = "(Ton)";
    }
  }

  onCustomerChanged() {

    if (this.isLoading === false) {
      this.dataMaster.plant = [];
      this.dataInfo.plantListID = [];
    }
    if (this.dataInfo && this.dataInfo.customerId) {
      this.customerService.getPlant(this.dataInfo.customerId).subscribe((res) => {
        this.dataMaster.plant = res;
        if (this.dataMaster.plant.length === 1) {
          this.dataInfo.plantListID = [this.dataMaster.plant[0]['id']];
        }
      });
    }
  }

  onPlantChange() {

    if (this.dataInfo.plantListID && this.dataInfo.plantListID.length > 0) {
      this.conditionSetting.dataPlant = this.dataInfo.plantList;
    } else if (this.dataInfo.productID) {
      this.conditionSetting.dataPlant = [this.dataInfo.productList];
    } else {
      this.conditionSetting.dataPlant = [];
    }
  }

  displayCustomer(item: any) {
    if (item) {
      return `${item.name}`;
    } else {
      return '';
    }
  }

  displayProduct(item: any) {
    if (item) {
      return `${item.productShortName}`;
    } else {
      return '';
    }
  }

  displayPlant(item: any) {
    if (item) {
      return `${item.name}`;
    } else {
      return '';
    }
  }

  deleteDocumentClick($event: any) {
    if ($event) {
      Swal.fire({
        title: '<h3>คุณต้องการลบข้อมูลหรือไม่</h3>',
        icon: 'warning',
        // html: 'Customer : ' + itemData.customer + '<br>Source : ' + itemData.source,
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        cancelButtonColor: 'red'

      }).then((result) => {
        if (result.isConfirmed) {

          const observable: any[] = [];
          observable.push(this.contractService.delete(this.params.ID));

          forkJoin(observable).subscribe(res => {

            this.loaderService.hide();
            Swal.fire({
              title: '',
              text: 'ลบข้อมูลสำเร็จ',
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'ปิด'
            }).then((resp) => {
              this.router.navigate(['customer-constrain', 'contract']);
            })
          }, error => {
            Swal.fire({
              title: 'บันทึกไม่สำเร็จ',
              text: error.error.message,
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'ปิด'
            })
          });

        }
      });
    }
  }

  copyDocumentClick($event: any) {
    if ($event) {
      Swal.fire({
        title: '<h3>คุณต้องหารคัดลอกข้อมูลหรือไม่</h3>',
        icon: 'warning',
        // html: 'Customer : ' + itemData.customer + '<br>Source : ' + itemData.source,
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        cancelButtonColor: 'red'

      }).then((result) => {
        if (result.isConfirmed) {
          const isCoppy = _.toUpper(uuid());
          const param: any = { ID: this.params.ID, ISCOPY: isCoppy };
          this.router.navigate(['customer-constrain', 'contract', 'contract-info', param]);
          this.params.ISCOPY = isCoppy;
          this.copyMsg = '[Copy]';
          this.dataInfo.contractNumber = null;
          this.dataInfo.startDate = null;
          this.dataInfo.endDate = null;
        }
      });
    }
  }

  onSaveClick($event: any) {
    console.log("onSaveClick ..... ", $event);
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        this.saveData();
        this.validateResult.isValid = false;
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  saveData() {

    const conditionData = this.conditionSetting.getDataSave();
    console.log("this.datainfo >> ", this.dataInfo);
    console.log("conditionData >> ", conditionData);

    if (conditionData) {

      let rowOrder = (this.dataMaster.masterContract ? (this.dataMaster.masterContract.length + 1) : 1);
      // contractData
      let contractData: any = {}
      let contractId = _.toUpper(uuid());
      if (this.params.ID) {
        contractId = this.params.ID;
      }
      if (this.params.ISCOPY) {
        contractId = this.params.ISCOPY;
        this.isEdit = false;
      }
      contractData['id'] = contractId;
      contractData['code'] = this.dataInfo['contractName'];
      contractData['name'] = this.dataInfo['contractName'];
      contractData['shortName'] = this.dataInfo['contractName'];
      contractData['contractNumber'] = this.dataInfo['contractNumber'];
      contractData['contractTypeId'] = this.dataInfo['contractTypeList']['id'];
      contractData['contractTypeName'] = this.dataInfo['contractTypeList']['name'];
      contractData['startContractDate'] = moment(this.dataInfo['startDate']).format('YYYY-MM-DD');
      contractData['endContractDate'] = moment(this.dataInfo['endDate']).format('YYYY-MM-DD');
      contractData['productId'] = this.dataInfo['productList']['id'];
      contractData['productName'] = this.dataInfo['productList']['productShortName'];
      contractData['minVolumn'] = this.dataInfo['yearVolumnMin'];
      contractData['maxVolumn'] = this.dataInfo['yearVolumnMax'];
      contractData['isMinVolumnNoLimit'] = (this.dataInfo['isMinVolumnNoLimit'] ? this.dataInfo['isMinVolumnNoLimit'] : false);
      contractData['isMaxVolumnNoLimit'] = (this.dataInfo['isMaxVolumnNoLimit'] ? this.dataInfo['isMaxVolumnNoLimit'] : false);
      contractData['unitId'] = this.dataInfo['unitList']['id'];
      contractData['unitName'] = this.dataInfo['unitList']['fullName'];
      contractData['customerId'] = this.dataInfo['customerList']['id'];
      contractData['customerName'] = this.dataInfo['customerList']['name'];
      contractData['totalActualVolumn'] = this.dataInfo.actualVolume;
      contractData['totalForecastVolumn'] = this.dataInfo.forecastVolume;
      contractData['rowOrder'] = rowOrder;
      contractData['activeStatus'] = 'Active';

      // ContractCustomerPlant
      let contractCustomerPlant: any = [];
      let contractDataItem: any = [];
      let contractProductGrade: any = [];
      _.each(this.dataInfo['plantList'], (item, i) => {
        let contractCustomerPlantId = uuid();
        contractCustomerPlant.push({
          id: contractCustomerPlantId,
          contractId: contractId,
          customerId: this.dataInfo['customerId'],
          customerPlantId: item['id'],
          customerPlantName: item['name'],
          rowOrder: (i + 1)
        });

        // contractData item
        _.each(conditionData[item['id']], (it, index) => {
          let contractConditionOfSaleId = _.toUpper(uuid());
          contractDataItem.push({
            id: contractConditionOfSaleId,
            contractId: contractId,
            customerId: contractData['customerId'],
            customerContractPlantId: contractCustomerPlantId,
            customerPlantId: item['id'],
            conditionsOfSaleId: it['conditionId'],
            conditionsOfSaleName: it['conditionName'],
            sourceId: it['sourceId'],
            sourceName: it['sourceName'],
            deliveryId: it['deliveryPointId'],
            deliveryName: it['deliveryPointName'],
            demandName: it['demandName'],
            sellingPriceFormula: it['cal'],
            tierNo: it['tierNo'],
            tierTypeId: null,
            tierTypeName: null,
            minVolumeTier: it['tireMin'],
            maxVolumeTier: it['tireMax'],
            isMinVolumeTierNoLimit: (it['isMinVolumeTierNoLimit'] ? it['isMinVolumeTierNoLimit'] : false),
            isMaxVolumeTierNoLimit: (it['isMaxVolumeTierNoLimit'] ? it['isMaxVolumeTierNoLimit'] : false),
            unitId: it['tireUnitId'],
            unitName: it['tireUnitName'],
            substituedProductId: (it['substituedProductId'] ? it['substituedProductId'] : null),
            substituedProductName: (it['substituedProductName'] ? it['substituedProductName'] : null),
            substituedRate: (it['substituedRate'] ? it['substituedRate'] : null),
            supplierId: (it['supplierId'] ? it['supplierId'] : null),
            supplierName: (it['supplierName'] ? it['supplierName'] : null),
            rowOrder: it['rowOrder'],
            activeStatus: 'Active',
            startSellingPriceFomulaDate: moment(it['startDate']).format('YYYY-MM-DD'),
            endSellingPriceFomulaDate: moment(it['endDate']).format('YYYY-MM-DD')
          });

          // customerProductGrades
          if (it['productGradeList']) {
            _.each(it['productGradeList'], (x, y) => {
              contractProductGrade.push({
                id: _.toUpper(uuid()),
                contractId: contractId,
                customerId: this.dataInfo['customerId'],
                customerPlantId: item['id'],
                productId: this.dataInfo['productList']['id'],
                productGradId: x['id'],
                productGradName: x['name'],
                contractConditionOfSaleId: contractConditionOfSaleId,
                rowOrder: (y + 1)
              });
            })
          }
        });
      });

      contractData['customerPlants'] = contractCustomerPlant;
      contractData['customerConditions'] = contractDataItem;
      contractData['customerProductGrades'] = contractProductGrade;

      console.log("contractData >>> ", contractData);
      // return;
      const observable: any[] = [];

      if (this.isEdit === false) {
        observable.push(this.contractService.create(contractData));
      }
      else {
        observable.push(this.contractService.update(contractData));
      }

      forkJoin(observable).subscribe(res => {

        this.loaderService.hide();
        Swal.fire({
          title: '',
          text: 'บันทึกสำเร็จ',
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
        }).then((resp) => {
          this.router.navigate(['customer-constrain', 'contract']);
        })

      }, error => {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: error.error.message,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
        })
      });
    }
    else {
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ',
        text: 'กรุณาเพิ่มข้อมูลเงื่อนไขขาย',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      })
    }
  }

  onCancelClick(event: any) {
    this.router.navigate(['customer-constrain', 'contract']);
  }

  onCheckboxChanged(event: any, action: string) {
    // console.log("onCheckboxChange >>> ", event.target.checked);
    // console.log("this.dataInfo >> ", this.dataInfo);
    if (event?.target?.checked === true) {
      if (action === 'min') {
        this.dataInfo.yearVolumnMin = null;
      }
      else {
        this.dataInfo.yearVolumnMax = null;
      }
    }
    else {
      if (action === 'min') {
        this.dataInfo.yearVolumnMin = 0;
      }
      else {
        this.dataInfo.yearVolumnMax = 0;
      }
    }
  }
}
