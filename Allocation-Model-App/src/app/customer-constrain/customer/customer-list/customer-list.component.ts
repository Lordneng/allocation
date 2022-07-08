import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MasterContractService } from 'src/app/service/master-contract.service';
import { MasterCustomerService } from 'src/app/service/master-customer.service';
import { MasterPlantService } from 'src/app/service/master-plant.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../../service/enum';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';
import { AuthService } from 'src/app/service/auth.service';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  accessMenu: any;
  dataList: any = []
  dataInfo: any = {};
  dataPlantList: any = [];
  dataInfoOld: any = {};
  modalRef: BsModalRef;
  filtersData: any = { year: moment().toString(), customerId: null, productId: null };
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-center modal-lg'
  };
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fas fa-sync-alt",
          onClick: this.retrieveListData.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fas fa-plus",
          onClick: this.addClick.bind(this),
        },
      }
    );
  }
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild('infoForm', { static: true }) infoForm: CustomerInfoComponent;

  sidebar: ISidebar;
  subscription: Subscription;

  constructor(
    private loaderService: NgxSpinnerService,
    private router: Router, private modalService: BsModalService,
    private dataService: MasterContractService,
    private customerService: MasterCustomerService,
    private plantService: MasterPlantService,
    private authService: AuthService,
    private sidebarService: SidebarService,
  ) { }

  ngOnInit(): void {
    this.dataList = [];
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

  onReorderListAssessor = ($event: any) => {
    console.log('onReorderListAssessor', $event)
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
  }

  retrieveMasterData(): Observable<any> {
    const masterCustomer = this.customerService.getList();
    const masterPlant = this.plantService.getList();
    return forkJoin([masterCustomer, masterPlant]);
  }

  retrieveListData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("data", res);
      this.dataList = res[0];
      this.dataPlantList = res[1];
      this.onGenFile();
      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });
    this.loaderService.hide();
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  onSave(event) {
    console.log('event', event);
    if (event && event.changes && event.changes.length > 0) {
      _.each(this.dataList, (item) => {
        item.duration = _.toNumber((item.contractEndDate ? moment(item.contractEndDate).format('yyyy') : 0)) - _.toNumber((item.contractStartDate ? moment(item.contractStartDate).format('yyyy') : 0));
      });
      this.saveData(event.changes);
    }
  }

  saveData(data) {

    let dataInsert: any = [];
    let dataUpdate: any = [];
    let dataRemove: any = [];
    _.each(data, (item) => {
      if (item.type === saveEvent.insert) {
        let maxRowOrder = _.max(_.map(this.dataList, 'rowOrder'))
        if (!maxRowOrder) {
          maxRowOrder = 0;
        }
        item.data.rowOrder = maxRowOrder + 1;
        dataInsert.push(item.data);
      } else if (item.type === saveEvent.update) {
        if (item.data) {
          dataUpdate.push(item.data);
        } else {
          dataUpdate.push(item);
        }

      } else if (item.type === saveEvent.remove) {
        dataRemove.push(item.key);
      }
    });
    const observable: any[] = [];
    if (dataInsert.length > 0) {
      observable.push(this.dataService.create(dataInsert));
    }
    if (dataUpdate.length > 0) {
      _.each(dataUpdate, (item) => {
        observable.push(this.dataService.update(item));
      })
    }
    if (dataRemove.length > 0) {

      _.each(dataRemove, (item) => {
        observable.push(this.dataService.delete(item));
      })

    }

    forkJoin(observable).subscribe(res => {

      this.retrieveListData();
      Swal.fire({
        title: '',
        text: 'บันทึกสำเร็จ',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      })
    }, error => {
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ',
        text: error.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      })
    });

  }

  customizeTextDateFormat(cellInfo) {
    if (cellInfo && cellInfo.value && _.isDate(cellInfo.value))
      return moment(cellInfo.value).format('DD/MMM/YYYY');
    else return cellInfo.valueText;

  }

  onGenFile() {
    let abilityPlanRayongDataGrid = this.dataList;
    console.log('abilityPlanRayongDataGrid', abilityPlanRayongDataGrid);
    let dataSend: any = {};
    let dataCost = [];
    let dataSellPrice = [];
    let data: any = {};
    // data.product = item.product;
    // data.unit = item.unit;
    // data.source = item.source;
    // data.demand = item.demand;
    // data.deliveryPoint = item.deliveryPoint;
    const _string = '_';
    _.each(abilityPlanRayongDataGrid, (item) => {

      data = {};
      data.key = item.product + _string + item.customer + _string + item.source;
      data.min = item.volumePerYearMin
      data.max = item.volumePerYearMax
      if (item.tier) {
        data.tier = item.tier
      }
      data.endContract = moment(item.contractEndDate).format('YYYY-MM-DD');
      dataCost.push(data);
    })

    dataSend.volumeYear = dataCost
    console.log('dataSend', dataSend);
  }

  editClick($event: any, itemData: any) {
    if ($event && itemData) {
      this.doEdit(itemData);
    }
  }

  addClick($event: any) {
    if (this.accessMenu == 1) {
      const infoForm: any = { id: uuid(), customerCode: null, customerName: null, customerShortName: null, plantData: [], isSaleSubCustomer: false, isEdit: false };
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

  getRowNumber(data: any) {
    return (data.rowIndex + 1);
  }

  doEdit(data?: any) {
    console.log('doEdit', data);
    let customerID = data.id;

    this.router.navigate([
      'customer-constrain',
      'customer',
      'customer-detail',
      { id: customerID },
    ]);
  }

  searchClick() {
    // console.log("this.filtersData >>> ", this.filtersData);
    this.modalRef.hide();
  }

  searchCancelClick() {
    this.filtersData = { year: moment().toString(), customerId: null, productId: null };
    this.modalRef.hide();
  }

  customizeTextDateTimeFormat(cellInfo) {
    if (cellInfo && cellInfo.value && _.isDate(cellInfo.value))
      return moment(cellInfo.value).format('DD/MM/YYYY H:mm:ss');
    else return cellInfo.valueText;
  }

}

