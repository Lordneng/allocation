import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxTagBoxComponent, DxValidationGroupComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { UserGroupListService } from 'src/app/service/user-group-list.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../service/enum';
import { UserGroupService } from 'src/app/service/user-group.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';

import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  dataList: any = [];
  dataMaster: any = [];
  userGroupDropdown: any = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  popupVisible = false;
  validateResult: any = { isValid: true };

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

  accessMenu: any;
  sidebar: ISidebar;
  subscription: Subscription;


  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  constructor(
    private UserService: UserService,
    private loaderService: NgxSpinnerService,
    private masterUserGroupService: UserGroupService,
    private masterUserGroupListService: UserGroupListService,
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
      this.saveData(this.dataList);
      if (this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    }, 100);
  }

  retrieveMasterData(): Observable<any> {
    const masterUser = this.UserService.getList();
    const masterUserGroup = this.masterUserGroupService.getList();
    const masterUserGroupList = this.masterUserGroupListService.getList();
    return forkJoin([masterUser, masterUserGroup, masterUserGroupList]);
  }

  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("data", res);
      this.dataList = res[0];
      this.dataMaster.UserGroup = res[1];
      this.dataMaster.masterUserGroupList = res[2];
      if (this.dataList && this.dataList.length > 0) {
        _.each(this.dataList, (item) => {
          item.userGroupDropdown = [];
          const masterUserGroupListData = _.filter(_.cloneDeep(this.dataMaster.masterUserGroupList), (x) => { return _.toUpper(x.user_id) == _.toUpper(item.id) });
          if (masterUserGroupListData) {
            _.each(masterUserGroupListData, (x) => {
              item.userGroupDropdown.push(x.user_group_id);
            });
          }
        });
      }
      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });

    this.loaderService.hide();
  }

  onSave(event) {
    if (event && event.changes && event.changes.length > 0) {
      this.saveData(event.changes);
    }
  }

  saveData(data) {
    console.log("item.data1", data);

    let dataInsert: any = {};
    let dataUpdate: any = {};
    // let dataRemove: any = [];
    // let userGroupData: any = [];
    const observable: any[] = [];

    // _.each(data, (item) => {

    // if (item.type === saveEvent.insert) {
    //   let maxRowOrder = _.max(_.map(this.dataList, 'rowOrder'))
    //   if (!maxRowOrder) {
    //     maxRowOrder = 0;
    //   }
    //   item.data.rowOrder = maxRowOrder + 1;
    //   dataInsert.push(item.data);
    // } else if (item.type === saveEvent.update) {
    //   if (item.data) {
    //     dataUpdate.push(item.data);
    //   } else {
    //     dataUpdate.push(item);
    //   }

    // } else if (item.type === saveEvent.remove) {
    //   dataRemove.push(item.key);
    // }

    if (this.dataInfo.isEdit === false) {
      let maxRowOrder = _.max(_.map(this.dataList, 'rowOrder'))
      if (!maxRowOrder) {
        maxRowOrder = 0;
      }
      data.rowOrder = maxRowOrder + 1;
      // dataInsert.push(data);
      dataInsert = data;
      observable.push(this.UserService.create(dataInsert));
    }
    else if (this.dataInfo.isEdit === true) {
      // dataUpdate.push(data);
      dataUpdate = data;
      observable.push(this.UserService.update(dataUpdate));
    }

    // if (data.userGroupDropdown) {
    //   _.each(data.userGroupDropdown, (i, idx) => {
    //     userGroupData.push({
    //       user_id: data.id,
    //       user_group_id: i,
    //       rowOrder: (idx + 1),
    //       activeStatus: 1
    //     });
    //   });
    // }
    // });

    // if (dataInsert.length > 0) {
    //   observable.push(this.UserService.create(dataInsert));
    // }
    // if (dataUpdate.length > 0) {
    //   _.each(dataUpdate, (item) => {
    //     observable.push(this.UserService.update(item));
    //   })
    // }
    // if (dataRemove.length > 0) {
    //   _.each(dataRemove, (item) => {
    //     observable.push(this.UserService.delete(item));
    //   });
    // }

    // observable.push(this.masterUserGroupListService.create(userGroupData));

    forkJoin(observable).subscribe(res => {
      this.popupVisible = false;
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
        text: error.error.message,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        // timer: 1000
      });
    });
  }

  editClick($event: any, itemData: any) {
    if ($event && itemData) {
      itemData.isEdit = true;
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
      return;
    }

    const infoForm: any = { code: null, name: null, activeStatus: 'Active', isEdit: false };
    this.doEdit(infoForm);
  }

  doEdit(data?: any) {

    // if (this.accessMenu !== 1) {
    //   Swal.fire({
    //     title: 'Access Denied',
    //     text: 'ไม่สามารถทำรายการได้เนื่องจากไม่มีสิทธิ์',
    //     icon: 'error',
    //     showConfirmButton: true,
    //     confirmButtonText: 'ปิด',
    //   });
    //   return;
    // }

    console.log("doEdit", data);
    this.popupVisible = true
    this.dataInfo = data;
    // this.infoForm.show();
    // this.infoForm.dataInfo = data;
  }

  popupSaveClick() {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        this.saveData(this.dataInfo);
        this.validateResult.isValid = false;
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  popupCancelClick = () => {
    this.popupVisible = false;
    setTimeout(() => {
      this.dataInfo = {};
      this.retrieveData();
    }, 500);
  }
}
