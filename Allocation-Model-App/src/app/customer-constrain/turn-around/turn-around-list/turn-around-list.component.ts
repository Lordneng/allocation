import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { saveEvent } from '../../../service/enum';
import { ProductInfoComponent } from './../../../master/product/product-info/product-info.component';
import { MasterCustomerService } from 'src/app/service/master-customer.service';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { MasterTurnaroundService } from 'src/app/service/master-turnaround.service';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-turn-around-list',
  templateUrl: './turn-around-list.component.html',
  styleUrls: ['./turn-around-list.component.css']
})
export class TurnAroundListComponent implements OnInit {
  accessMenu: any;
  dataList: any = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  filtersData: any = { year: moment().toString(), customerId: null, productId: null, isFilter: false };
  masterData: any = {};
  sidebar: ISidebar;
  subscription: Subscription;

  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('container') container: Container;
  @ViewChild('infoForm') infoForm: ProductInfoComponent;
  @ViewChild(DxFormComponent, { static: false }) myForm: DxFormComponent;

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'fas fa-sync-alt',
          onClick: this.retrieveListData.bind(this),
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
  constructor(
    private loaderService: NgxSpinnerService,
    private router: Router,
    private modalService: BsModalService,
    private dataService: MasterTurnaroundService,
    private customerService: MasterCustomerService,
    private productService: MasterProductsService,
    private authService: AuthService,
    private sidebarService: SidebarService,
  ) { }

  ngOnInit(): void {
    this.retrieveListData();
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.accessMenuList();
    }, 500);
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

  onReorderListAssessor = ($event: any) => {
    console.log('onReorderListAssessor', $event);
    const visibleRows = $event.component.getVisibleRows();
    const toIndex = _.indexOf(this.dataList, visibleRows[$event.toIndex].data);
    const fromIndex = _.indexOf(this.dataList, $event.itemData);
    this.dataList.splice(fromIndex, 1);
    this.dataList.splice(toIndex, 0, $event.itemData);

    setTimeout(() => {
      // reorder
      _.each(this.dataList, (item: any, index) => {
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

  retrieveMasterData(): Observable<any> {

    const filterOption: any = {};
    filterOption.year = moment().format('yyyy');
    if (this.filtersData.isFilter === true) {
      if (this.filtersData.year) {
        filterOption.year = moment(this.filtersData.year).format('yyyy');
      }
      if (this.filtersData.customerId) {
        filterOption.customerId = this.filtersData.customerId;
      }
      if (this.filtersData.productId) {
        filterOption.productId = this.filtersData.productId;
      }
    }

    const masterContract = this.dataService.getList(filterOption);
    const masterCustomer = this.customerService.getList();
    const masterProduct = this.productService.getList();
    return forkJoin([masterContract, masterCustomer, masterProduct]);
  }
  retrieveListData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("data", res);
      this.dataList = res[0];
      this.masterData.masterCustomer = _.orderBy(_.filter(res[1], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);
      this.masterData.masterProduct = _.orderBy(_.filter(res[2], { activeStatus: "Active" }), ['rowOrder'], ['ASC']);
      // this.onGenFile();
      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });

    console.log("this.masterData :: ", this.masterData);
    this.loaderService.hide();
  }

  getRowNumber(data: any) {
    return (data.rowIndex + 1);
  }

  itemClick(event: any, data: any) {
    // console.log("data >> ", data);
    // console.log("event.itemData.text >> ", event.itemData.text);
    if (event.itemData.text === 'Delete') {
      this.deleteClick(data);
    }
    else if (event.itemData.text === 'Copy') {
      this.editClick(event, data, true);
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

          const observable: any[] = [];
          observable.push(this.dataService.delete(itemData.id));

          forkJoin(observable).subscribe(res => {

            this.loaderService.hide();
            Swal.fire({
              title: '',
              text: 'ลบข้อมูลสำเร็จ',
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'ปิด'
            }).then((resp) => {
              this.retrieveListData();
            })
          }, error => {
            Swal.fire({
              title: 'ลบข้อมูลไม่สำเร็จ',
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

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  searchClick() {
    // console.log("this.filtersData >>> ", this.filtersData);
    this.filtersData.isFilter = true;
    this.retrieveListData();
    this.modalRef.hide();
  }

  searchCancelClick() {
    this.filtersData = { year: moment().toString(), customerId: null, productId: null, isFilter: false };
    this.modalRef.hide();
  }

  customizeTextDateFormat(cellInfo) {
    if (cellInfo && cellInfo.value && _.isDate(cellInfo.value))
      return moment(cellInfo.value).format('DD/MM/YYYY');
    else return cellInfo.valueText;
  }

  customizeTextDateTimeFormat(cellInfo) {
    if (cellInfo && cellInfo.value && _.isDate(cellInfo.value))
      return moment(cellInfo.value).format('DD/MM/YYYY H:mm:ss');
    else return cellInfo.valueText;
  }

  editClick($event: any, itemData: any, isCopy?: boolean) {
    if ($event && itemData) {
      if (isCopy === true) {
        itemData.isCopy = _.toUpper(uuid());
      }
      this.doEdit(itemData);
    }
  }

  addClick($event: any) {
    if (this.accessMenu == 1) {
      const infoForm: any = {
        id: uuid(),
        productCode: null,
        productName: null,
        productShortName: null,
        rowOrder: this.dataList ? this.dataList.length : 1,
        isEdit: false,
        gradeData: [],
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

  doEdit(data?: any) {
    console.log('doEdit', data);

    const param: any = { id: data.id };
    if (data.isCopy) {
      param.iscopy = data.isCopy
    }

    this.router.navigate([
      'customer-constrain',
      'turn-around',
      'turn-around-detail',
      param,
    ]);

  }

  displayCustomer(item: any) {
    if (item) {
      return `${item.code} | ${item.name}`;
    } else {
      return '';
    }
  }

  displayProduct(item: any) {
    if (item) {
      // return `${item.productCode} | ${item.productName}`;
      return `${item.productShortName}`;
    } else {
      return '';
    }
  }
}
