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
import { MasterProductsService } from 'src/app/service/master-products.service';
import { MasterProductGradeService } from 'src/app/service/master-product-grade.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../../service/enum';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { AuthService } from '../../../service/auth.service';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';
import { SystemModeService } from 'src/app/service/system-mode.service';
import { UserGroupListService } from 'src/app/service/user-group-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})

export class ProductListComponent implements OnInit {
  dataList: any = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-center modal-lg',
  };
  accessMenu: any;
  sidebar: ISidebar;
  subscription: Subscription;
  systemMode: any = {
    isUserConfigFormula: false,
    isDigitalConfigFormula: false
  };

  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('container') container: Container;
  @ViewChild('infoForm') infoForm: ProductInfoComponent;

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
    // e.toolbarOptions.items.push(
    //   {
    //     location: "after",
    //     widget: "dxButton",
    //     options: {
    //       icon: "fas fa-plus",
    //       onClick: this.doEdit.bind(this),
    //     },
    //   }
    // );
  }
  constructor(
    private loaderService: NgxSpinnerService,
    private router: Router,
    private modalService: BsModalService,
    private dataService: MasterProductsService,
    private dataProductGradeService: MasterProductGradeService,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private masterUserGroupListService: UserGroupListService,
    private systemModeService: SystemModeService
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
    // this.dataList = [];
    // let data = { id: 1, productCode: 1, productName: 'Ethane', productShortName: 'C2', isRefinery: false, gradeData: [] };
    // this.dataList.push(data);
    // data = { id: 2, productCode: 2, productName: 'Propane', productShortName: 'C3', isRefinery: false, gradeData: [] };
    // this.dataList.push(data);
    // data = { id: 3, productCode: 3, productName: 'LPG', productShortName: 'LPG', isRefinery: false, gradeData: [{ id: 1, productGrade: 'LPG-Petro' }, { id: 2, productGrade: 'LPG-Domestic' }] };
    // this.dataList.push(data);
    // data = { id: 4, productCode: 4, productName: 'NGL', productShortName: 'NGL', isRefinery: false, gradeData: [] };
    // this.dataList.push(data);
    // data = { id: 5, productCode: 5, productName: 'Pentane', productShortName: 'Pentane', isRefinery: false, gradeData: [] };
    // this.dataList.push(data);
    // data = { id: 6, productCode: 6, productName: 'CO2', productShortName: 'CO2', isRefinery: false, gradeData: [] };
    // this.dataList.push(data);
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
    const masterProduct = this.dataService.getList();
    return forkJoin([masterProduct]);
  }
  retrieveListData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe((res) => {
      console.log('data', res);
      this.dataList = res[0];
      this.loaderService.hide();
    });
    this.loaderService.hide();
  }
  onSave(event) {
    console.log('event', event);
    if (event && event.changes && event.changes.length > 0) {
      _.each(this.dataList, (item) => {
        item.duration =
          _.toNumber(
            item.contractEndDate
              ? moment(item.contractEndDate).format('yyyy')
              : 0
          ) -
          _.toNumber(
            item.contractStartDate
              ? moment(item.contractStartDate).format('yyyy')
              : 0
          );
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
        let maxRowOrder = _.max(_.map(this.dataList, 'rowOrder'));
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
      });
    }
    if (dataRemove.length > 0) {
      _.each(dataRemove, (item) => {
        observable.push(this.dataService.delete(item));
      });
    }

    forkJoin(observable).subscribe(
      (res) => {
        this.retrieveListData();
        Swal.fire({
          title: '',
          text: 'บันทึกสำเร็จ',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
      },
      (error) => {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: error.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    );
  }

  customizeTextDateFormat(cellInfo) {
    if (cellInfo && cellInfo.value && _.isDate(cellInfo.value))
      return moment(cellInfo.value).format('DD/MMM/YYYY');
    else return cellInfo.valueText;
  }

  editClick($event: any, itemData: any) {
    if ($event && itemData) {
      this.doEdit(itemData);
    }
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
      productCode: null,
      productName: null,
      productShortName: null,
      rowOrder: this.dataList ? this.dataList.length : 1,
      isEdit: false,
      gradeData: [],
    };
    this.doEdit(infoForm);
  }

  doEdit(data?: any) {
    console.log('doEdit', data);
    let productID = data.id;

    this.router.navigate([
      'master',
      'product',
      'product-detail',
      { id: productID },
    ]);

    //this.infoForm.show();
    //this.infoForm.dataInfo = data;
  }

  getRowNumber(data: any) {
    return (data.rowIndex + 1);
  }
}
