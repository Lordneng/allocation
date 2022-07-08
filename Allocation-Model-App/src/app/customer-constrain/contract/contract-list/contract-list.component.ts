import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MasterContractService } from 'src/app/service/master-contract.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../../service/enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { MasterCustomerService } from 'src/app/service/master-customer.service';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.css']
})
export class ContractListComponent implements OnInit {
  dataList: any = []
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

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  sidebar: ISidebar;
  subscription: Subscription;

  form: FormGroup;
  filtersData: any = { year: moment().toString(), customerId: null, productId: null, isFilter: false };
  masterData: any = {};
  accessMenu: any;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild(DxFormComponent, { static: false }) myForm: DxFormComponent;
  constructor(
    private loaderService: NgxSpinnerService,
    private router: Router,
    private dataService: MasterContractService,
    private modalService: BsModalService,
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

    this.accessMenuList();
    // this.dataList = [{ "contractGroup": "Petro", "product": "Ethane", "customer": "GC", "source": "GSP RY", "contractVolumePerYear": "1 900 000 - 2 500 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2020", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "Ethane", "customer": "SCG Chem / MOC", "source": "GSP RY", "contractVolumePerYear": "Min. 150 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "Sub Propane", "customer": "SCG Chem / MOC", "source": "GSP RY/SCG Terminal", "contractVolumePerYear": "Min. 150 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "Propane", "customer": "GC", "source": "GSP RY", "contractVolumePerYear": "260 000 - 1 200 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2020", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "Propane", "customer": "HMC (PDH Plant)", "source": "GSP RY", "contractVolumePerYear": "350 000 - 410 000", "unit": "Ton/Year", "contractStartDate": "Jan 19 2010", "contractEndDate": "Jan 18 2025", "duration": "" }, { "contractGroup": "Petro", "product": "Propane", "customer": "", "source": "GSP RY", "contractVolumePerYear": "350 000 - 410 000", "unit": "Ton/Year", "contractStartDate": "Apr 1 2020", "contractEndDate": "Jan 18 2025", "duration": "" }, { "contractGroup": "Petro", "product": "Propane", "customer": "SCG Chem / MOC", "source": "GSP RY/SCG Terminal", "contractVolumePerYear": "(Tier 1) 0 - 48 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "Propane", "customer": "SCG Chem / MOC", "source": "GSP RY/SCG Terminal", "contractVolumePerYear": "(Tier 2) 48 001 – 400 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "LPG", "customer": "GC", "source": "GSP RY", "contractVolumePerYear": "400 000 - 1 000 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2020", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "LPG", "customer": "ROC & MOC", "source": "GSP RY", "contractVolumePerYear": "48 000 - 240 000", "unit": "Ton/Year", "contractStartDate": "Jun 1 2013", "contractEndDate": "May 31 2023", "duration": "" }, { "contractGroup": "Petro", "product": "LPG", "customer": "SCG Chem / ROC", "source": "GSP RY", "contractVolumePerYear": "(Tier 1) 0-384 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "LPG", "customer": "", "source": "GSP RY", "contractVolumePerYear": "(Tier 2) 384 001 – 720 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "SWAP LPG", "customer": "SCG Chem / ROC", "source": "SCG Terminal", "contractVolumePerYear": "0 – 400 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2020", "contractEndDate": "Dec 31 2027", "duration": "" }, { "contractGroup": "Petro", "product": "NGL", "customer": "GC", "source": "GSP RY", "contractVolumePerYear": "200 000 - 400 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2020", "contractEndDate": "Dec 31 2030", "duration": "" }, { "contractGroup": "Petro", "product": "NGL", "customer": "ROC", "source": "GSP RY", "contractVolumePerYear": "380 000 - 600 000", "unit": "Ton/Year", "contractStartDate": "Jun 1 2013", "contractEndDate": "May 31 2023", "duration": "" }, { "contractGroup": "Petro", "product": "Pentane", "customer": "ROC", "source": "GSP RY", "contractVolumePerYear": "26 000-87 000", "unit": "Ton/Year", "contractStartDate": "Feb 20 2015", "contractEndDate": "Feb 19 2025", "duration": "" }, { "contractGroup": "Petro", "product": "CO2", "customer": "Praxair", "source": "GSP RY", "contractVolumePerYear": "min 120 000", "unit": "Ton/Year", "contractStartDate": "Jan 1 2019", "contractEndDate": "Dec 31 2028", "duration": "" }, { "contractGroup": "Petro", "product": "CO2", "customer": "Linde", "source": "GSP RY", "contractVolumePerYear": "min 7 200", "unit": "Ton/Year", "contractStartDate": "Jan 1 2019", "contractEndDate": "Dec 31 2028", "duration": "" }, { "contractGroup": "M.7", "product": "LPG", "customer": "OR", "source": "MT/BRP/KHM/PTT TANK/SPRC", "contractVolumePerYear": "155 000 (No-Tier)", "unit": "Ton/month", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2021", "duration": "" }, { "contractGroup": "M.7", "product": "LPG", "customer": "OR", "source": "LKB", "contractVolumePerYear": "6 000 (No-Tier)", "unit": "Ton/month", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2021", "duration": "" }, { "contractGroup": "M.7", "product": "LPG", "customer": "SGP/UGP", "source": "MT", "contractVolumePerYear": "44 000 (No-Tier)", "unit": "Ton/month", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2021", "duration": "" }, { "contractGroup": "M.7", "product": "LPG", "customer": "WP", "source": "PTTTANK/IRPC/SPRC", "contractVolumePerYear": "15 000 (Tier)", "unit": "Ton/month", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2021", "duration": "" }, { "contractGroup": "M.7", "product": "LPG", "customer": "PAP", "source": "PTT TANK", "contractVolumePerYear": "4 350 (No-Tier)", "unit": "Ton/month", "contractStartDate": "Jan 1 2021", "contractEndDate": "Dec 31 2021", "duration": "" }];
    // _.each(this.dataList, (item, index) => {
    //   item.id = index
    // })
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

    const filterOption: any = {};
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
      this.onGenFile();
      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });

    console.log("this.masterData :: ", this.masterData);
    this.loaderService.hide();
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

  addClick() {

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

    this.router.navigate(['customer-constrain', 'contract', 'contract-info']);
  }

  editClick($event: any, itemData: any, isCopy?: boolean) {
    if ($event && itemData) {
      if (isCopy === true) {
        itemData.isCopy = _.toUpper(uuid());
      }
      this.doEdit(itemData);
    }
  }
  doEdit(data?: any) {
    console.log("doEdit", data);
    if (data) {
      const param: any = { ID: data.id };
      if (data.isCopy) {
        param.ISCOPY = data.isCopy
      }
      this.router.navigate(['customer-constrain', 'contract', 'contract-info', param]);
    } else {
      this.router.navigate(['customer-constrain', 'contract', 'contract-info']);
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

  displayCustomer(item: any) {
    if (item) {
      return `${item.name}`;
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
        html: 'Customer : ' + itemData.customerName + '<br>Source : ' + itemData.name,
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        cancelButtonColor: 'red'

      }).then((result) => {
        if (result.isConfirmed) {

          const observable: any[] = [];
          observable.push(this.dataService.delete(itemData['id']));

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

  onRowPrepared(event: any) {
    if (event && event.rowType === 'data') {
      let duration = moment.duration(moment(event.data['endDate']).diff(moment(event.data['startDate']))).years();
      event.data['duration'] = duration;
    }
  }

  getRowNumber(data: any) {
    if (data.rowType === 'data') {
      return (data.rowIndex + 1);
    }
  }
}
