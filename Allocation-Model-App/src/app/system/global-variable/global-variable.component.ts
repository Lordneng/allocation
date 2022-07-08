import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { GlobalVariableService } from 'src/app/service/global-variable.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../service/enum';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { v4 as uuid } from 'uuid';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-global-variable',
  templateUrl: './global-variable.component.html',
  styleUrls: ['./global-variable.component.scss']
})
export class GlobalVariableComponent implements OnInit {
  accessMenu: any;
  dataList: any = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  popupVisible = false;
  validateResult: any = { isValid: true };
  modalRef: BsModalRef;
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fas fa-sync-alt",
          onClick: this.retrieveData.bind(this),
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

  sidebar: ISidebar;
  subscription: Subscription;

  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  constructor(
    private masterGlobalVariableService: GlobalVariableService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService,
    private sidebarService: SidebarService,) { }

  ngOnInit(): void {
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
    // const masterCost = this.masterCostsService.getList();
    const masterGlobalVariable = this.masterGlobalVariableService.getList();
    return forkJoin([masterGlobalVariable]);
  }
  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      // console.log("data", res);
      this.dataList = res[0];

      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });

    this.loaderService.hide();
  }

  // onSave(event) {
  //   console.log('event', event);
  //   console.log('event.changes', event.changes);
  //   console.log('event.changes.length', event.changes.length);
  //   console.log('datalist', this.dataList);
  //   if (event && event.changes && event.changes.length > 0) {
  //     this.saveData(event.changes);
  //   }
  // }

  // saveData(data) {
  //   console.log("item.data1", data);

  //   let dataInsert: any = [];
  //   let dataUpdate: any = [];
  //   let dataRemove: any = [];
  //   _.each(data, (item) => {
  //     if (item.type === saveEvent.insert) {
  //       let maxRowOrder = _.max(_.map(this.dataList, 'rowOrder'))
  //       if (!maxRowOrder) {
  //         maxRowOrder = 0;
  //       }
  //       item.data.rowOrder = maxRowOrder + 1;
  //       dataInsert.push(item.data);
  //     } else if (item.type === saveEvent.update) {
  //       if (item.data) {
  //         dataUpdate.push(item.data);
  //       } else {
  //         dataUpdate.push(item);
  //       }

  //     } else if (item.type === saveEvent.remove) {
  //       dataRemove.push(item.key);
  //     }
  //   });
  //   const observable: any[] = [];
  //   if (dataInsert.length > 0) {
  //     observable.push(this.masterGlobalVariableService.create(dataInsert));
  //   }
  //   if (dataUpdate.length > 0) {
  //     _.each(dataUpdate, (item) => {
  //       observable.push(this.masterGlobalVariableService.update(item));
  //     });
  //   }
  //   if (dataRemove.length > 0) {

  //     _.each(dataRemove, (item) => {
  //       observable.push(this.masterGlobalVariableService.delete(item));
  //     });

  //   }

  //   forkJoin(observable).subscribe(res => {

  //     this.retrieveData();
  //     Swal.fire({
  //       title: '',
  //       text: 'บันทึกสำเร็จ',
  //       icon: 'success',
  //       showConfirmButton: false,
  //       timer: 1000
  //     })
  //   }, error => {
  //     Swal.fire({
  //       title: 'บันทึกไม่สำเร็จ',
  //       text: error.message,
  //       icon: 'error',
  //       showConfirmButton: false,
  //       timer: 1000
  //     })
  //   });
  // }

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

    const infoForm: any = {
      id: uuid(),
      name: null,
      rowOrder: 0,
      activeStatus: 'Active',
      isEdit: false
    };
    this.doEdit(infoForm);
  }

  doEdit(data?: any) {
    console.log("doEdit", data);
    this.popupVisible = true
    this.dataInfo = data;
  }

  editClick($event: any, itemData: any) {
    if ($event && itemData) {
      itemData.isEdit = true;
      this.doEdit(itemData);
    }
  }

  popupSaveClick = () => {

    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();

      if (this.validateResult.isValid) {
        this.saveData();
        this.popupVisible = false;
        this.validateResult.isValid = false;
      }
      else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  saveData() {

    // console.log("this.dataInfo :: ", this.dataInfo);
    // console.log("_.trim(_.lowerCase(this.dataInfo.name)) : ", _.trim(_.lowerCase(this.dataInfo.name)));
    let dataInsert: any = [];
    let dataUpdate: any = [];

    if (!this.dataInfo.isEdit) {

      const checkDuplicate = _.find(_.cloneDeep(this.dataList), (it) => { return _.toLower(_.trim(it.variable)) === _.toLower(_.trim(this.dataInfo.variable)) });
      // console.log("checkDuplicate :: ", checkDuplicate);
      // return;
      if (checkDuplicate) {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: 'มี Global Variable "' + _.trim(this.dataInfo.variable) + '" ในระบบแล้ว',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
        })
        this.retrieveData();
        return;
      }

      let maxRowOrder = _.max(_.map(this.dataList, 'rowOrder'))
      if (!maxRowOrder) {
        maxRowOrder = 0;
      }

      this.dataInfo.rowOrder = maxRowOrder + 1;
      this.dataInfo.name = _.trim(this.dataInfo.name);
      dataInsert.push(this.dataInfo);
    }
    else {
      const checkDuplicate = _.find(_.cloneDeep(this.dataList), (it) => { return _.toLower(_.trim(it.name)) == _.toLower(_.trim(this.dataInfo.name)) && it.id != this.dataInfo.id });
      // console.log("checkDuplicate :: ", checkDuplicate);
      // return;
      if (checkDuplicate) {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: 'มี Global Variable "' + _.trim(this.dataInfo.name) + '" ในระบบแล้ว',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
        })
        this.retrieveData();
        return;
      }

      this.dataInfo.name = _.trim(this.dataInfo.name);
      dataUpdate.push(this.dataInfo);
    }

    const observable: any[] = [];
    if (dataInsert.length > 0) {
      observable.push(this.masterGlobalVariableService.create(dataInsert));
    }
    if (dataUpdate.length > 0) {
      _.each(dataUpdate, (item) => {
        observable.push(this.masterGlobalVariableService.update(item));
      });
    }

    forkJoin(observable).subscribe(res => {

      this.retrieveData();
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

  popupCancelClick = () => {
    this.dataInfo = {};
    this.popupVisible = false;
    this.retrieveData();
  }

  onHidingClick() {
    this.dataInfo = {};
    this.popupVisible = false;
    this.retrieveData();
  }
}
