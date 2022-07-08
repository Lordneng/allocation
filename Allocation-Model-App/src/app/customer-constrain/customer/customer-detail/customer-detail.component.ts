import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { MasterCustomerService } from 'src/app/service/master-customer.service';
import { MasterCustomerTypeService } from 'src/app/service/master-customer-type.service';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { forkJoin, observable, Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DxDataGridComponent,
  DxValidationGroupComponent,
} from 'devextreme-angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChoiceWithIndices } from '@flxng/mentions';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth.service';

interface Formula {
  id: number;
  name: string;
}

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
})

export class CustomerDetailComponent implements OnInit {
  accessMenu: any;
  dataInfo: any = {};
  dataCustomer: any = {};
  dataCustomerPlant: any = {};
  customerType: any = [];
  popupVisible = false;
  popupFormulaVisible = false;
  validateResult: any = { isValid: true };
  customerId = uuid();
  dataRef: any = [];
  itemsFormula: any = [];
  isFormulaValidate = false;

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


  @ViewChild('targetGroup', { static: true })
  validationGroup: DxValidationGroupComponent;
  @ViewChild('targetGroupCustomer', { static: true })
  validationGroupcustomer: DxValidationGroupComponent;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;

  sidebar: ISidebar;
  subscription: Subscription;

  constructor(
    private router: Router,
    private loaderService: NgxSpinnerService,
    private dataService: MasterCustomerService,
    private customerTypeService: MasterCustomerTypeService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log('params', params);
      if (params.id) {
        this.customerId = params.id;
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

  ngAfterViewInit(): void { }

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

  valCustomerChanged($event) {
    const customerType = _.find(this.customerType, (item) => {
      return item.code === $event.value;
    });

    if(customerType){
      this.dataCustomer.customerTypeName = customerType.name;
    }
  }

  onReorderListAssessor = ($event: any) => {
    const visibleRows = $event.component.getVisibleRows();

    setTimeout(() => {
      // this.saveData(this.dataList);
      if (this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    }, 100);
  };

  retrieveMasterData(): Observable<any> {
    const mastercustomer = this.dataService.getOne(this.customerId);
    const mastercustomerPlant = this.dataService.getPlant(this.customerId);
    const mastercustomerType = this.customerTypeService.getList();
    return forkJoin([
      mastercustomer,
      mastercustomerPlant,
      mastercustomerType
    ]);
  }

  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe((res) => {
      console.log('data', res);
      if (res[0]) {
        this.dataCustomer = res[0];
        this.dataCustomer.isEdit = true;
      } else {
        this.dataCustomer.isEdit = false;
        this.dataCustomer.id = this.customerId;
      }
      this.dataCustomerPlant = res[1];
      this.customerType = res[2]
    });
    this.loaderService.hide();
  }

  addClick($event: any) {
    if (this.accessMenu == 1) {
      const infoForm: any = {
        id: uuid(),
        name: null,
        rowOrder: 0,
        isEdit: false,
      };
      this.doEdit(infoForm);
    } else {
      Swal.fire({
        title: 'Access Denied',
        text: 'ไม่สามารถทำรายการได้เนื่องจากไม่มีสิทธิ์',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        //timer: 1000
      });
    }
  }

  BackClick = () => {
    this.router.navigate([
      'customer-constrain',
      'customer',
    ]);
  };

  doEdit(data?: any) {
    console.log('doEdit', data);
    this.popupVisible = true;
    this.dataInfo = data;
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

  popupCancelClick = () => {
    this.dataInfo = {};
    this.popupVisible = false;
    this.retrieveData();
  };

  popupFormulaCancelClick = () => {
    this.popupFormulaVisible = false;
  };

  onHidingClick() {
    this.dataInfo = {};
    this.popupVisible = false;
    //this.retrieveData();
  }

  onHidingFormulaClick() {
    this.popupFormulaVisible = false;
  }

  SaveClick = () => {
    if (this.validationGroupcustomer && this.validationGroupcustomer.instance) {
      this.validateResult = this.validationGroupcustomer.instance.validate();
      if (this.validateResult.isValid) {
        this.saveData();
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  };

  saveData() {
    const observable: any[] = [];
    const resData = this.dataCustomer;

    resData.plants = [];
    resData.plants = this.dataCustomerPlant;

    console.log('resData', resData);
    console.log('Json resData', JSON.stringify(resData));
    // return;

    // Insert
    if (resData.isEdit === false) {
      observable.push(this.dataService.create(resData));
    }
    // update
    else {
      observable.push(this.dataService.update(resData));
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

        this.router.navigate([
          'customer-constrain',
          'customer',
        ]);

        // this.retrieveData();
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

  getRowNumber(data: any) {
    return (data.rowIndex + 1);
  }

  popupSaveClick = () => {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      //console.log("this.validateResult >> ", this.validateResult);
      if (this.validateResult.isValid) {

        //Check List Plant
        if (this.checkPlantList()) {
          this.confirmPopupData();
          this.popupVisible = false;
          this.validateResult.isValid = false;
        }

      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  };

  confirmPopupData() {
    this.dataInfo.customerId = this.customerId;
    const entryIndex = this.dataCustomerPlant.findIndex(
      (entry) => entry.id === this.dataInfo.id
    );
    if (entryIndex > -1) {
      this.dataCustomerPlant[entryIndex] = this.dataInfo;
    } else {
      this.dataInfo.rowOrder = this.dataCustomerPlant.length + 1;
      this.dataCustomerPlant.push(this.dataInfo);
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

  checkPlantList() {
    // console.log('this.dataInfo',this.dataInfo);
    const filterPlant = _.find(this.dataCustomerPlant, (item) => {
      return item.code === this.dataInfo.code && item.id !== this.dataInfo.id;
    });
    // console.log('filterPlant',filterPlant);
    if (filterPlant) {
      this.retrieveData();
      Swal.fire({
        title: 'เพิ่มรายการไม่สำเร็จ',
        text: 'Code มีอยู่แล้วกรุณาทำรายการใหม่',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        //timer: 1000
      });
      return false;
    } else {
      return true;
    }
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
    console.log('mentions:', this.mentions);
    if (this.dataInfo.fullcostFormula) {
      this.isFormulaValidate = false;
    }
    else {
      this.isFormulaValidate = true;
    }
  }

  onMenuShow(): void {
    console.log('Menu show!');
  }

  onMenuHide(): void {
    console.log('Menu hide!');
    this.choices = [];
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
}
