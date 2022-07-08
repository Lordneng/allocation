import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { UserGroupService } from 'src/app/service/user-group.service';
import { MasterMenuService } from 'src/app/service/master-menu.service';
import { PermissionService } from 'src/app/service/permision.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../service/enum';
import { v4 as uuid } from 'uuid';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  dataList: any = [];
  menuList: any = [];
  dataPermission: any = [];
  dataMaster: any = [];
  userGroupId: any = null;
  userProfile: any;
  accessMenu: any;
  sidebar: ISidebar;
  subscription: Subscription;

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fas fa-sync-alt",
          onClick: this.retrieveData.bind(this),
        },
      }
    );
  }

  onToolbarPreparingPermission(e) {
    e.toolbarOptions.visible = false;
  }

  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  @ViewChild('dxDataGridPermission') dxDataGridPermission: DxDataGridComponent;

  popupFull = false;
  popupVisible = false;

  constructor(
    private masterUserGroupService: UserGroupService,
    private loaderService: NgxSpinnerService,
    private masterMenuService: MasterMenuService,
    private permissionService: PermissionService,
    private authService: AuthService,
    private sidebarService: SidebarService,) { }

  async ngOnInit(): Promise<void> {
    this.retrieveData();
    this.userProfile = this.authService.getUserProfile();
    // console.log("this.userProfile :: ", this.userProfile);

    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.accessMenuList();
    }, 1000);
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
    // console.log('AppComponent', await this.appComponent.thisMenu);
    // // 1 : Add,Edit, 2 : View Only
    // this.accessMenu = await this.appComponent.thisMenu[0].actionMenu;
  }

  retrieveMasterData(): Observable<any> {
    const masterUserGroup = this.masterUserGroupService.getList();
    const masterMenu = this.masterMenuService.getList();
    const masterPermission = this.permissionService.getList();
    return forkJoin([masterUserGroup, masterMenu, masterPermission]);
  }

  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("data", res);
      this.dataList = _.filter(res[0], { activeStatus: "Active" });
      this.dataMaster.menuList = res[1];
      this.dataPermission = res[2];

      // prepare data
      if (this.dataList) {
        _.each(this.dataList, (item, index) => {
          const filterData = _.find(_.cloneDeep(this.dataPermission), { userGroupId: item.id });
          item.rowOrder = (index + 1);
          if (filterData) {
            item.createBy = filterData.createBy;
            item.createDate = filterData.createDate;
            item.updateBy = filterData.updateBy;
            item.updateDate = filterData.updateDate;
          }
          else {
            item.createBy = null;
            item.createDate = null;
            item.updateBy = null;
            item.updateDate = null;
          }
        });
      }
      // console.log("this.dataList :: ", this.dataList);
      this.menuList = [];
      if (this.dataMaster.menuList) {
        _.each(this.dataMaster.menuList.level3, (item3) => {
          let menu1 = _.find(_.cloneDeep(this.dataMaster.menuList.level1), { id: item3.menuLevel1Id });
          let menu2 = _.find(_.cloneDeep(this.dataMaster.menuList.level2), { id: item3.menuLevel2Id });
          this.menuList.push(
            {
              id: uuid(),
              menuCode: menu2.menuCode,
              rowOrder1: _.toNumber((menu1 ? menu1.rowOrder : 0)),
              menu1Id: (menu1 ? menu1.id : null),
              menu1: (menu1 ? menu1.menuName : null),
              rowOrder2: _.toNumber((menu2 ? menu2.rowOrder : 0)),
              menu2Id: (menu2 ? menu2.id : null),
              menu2: (menu2 ? menu2.menuName : null),
              rowOrder3: _.toNumber((item3 ? item3.rowOrder : 0)),
              menu3Id: item3.id,
              menu3: item3.menuName,
              isActiveStatus: false,
              isAction: 2,
              menuLevel: 3
            }
          );
        });

        _.each(this.dataMaster.menuList.level2, (item2) => {
          let iFindData = _.filter(_.cloneDeep(this.menuList), { menu2Id: item2.id });
          if (!iFindData.length) {
            let menu1 = _.find(_.cloneDeep(this.dataMaster.menuList.level1), { id: item2.menuLevel1Id });
            this.menuList.push(
              {
                id: uuid(),
                menuCode: item2.menuCode,
                rowOrder1: _.toNumber((menu1 ? menu1.rowOrder : 0)),
                menu1Id: (menu1 ? menu1.id : null),
                menu1: (menu1 ? menu1.menuName : null),
                rowOrder2: _.toNumber((item2 ? item2.rowOrder : 0)),
                menu2Id: (item2 ? item2.id : null),
                menu2: (item2 ? item2.menuName : null),
                rowOrder3: 0,
                menu3Id: null,
                menu3: (item2 ? item2.menuName : null),
                isActiveStatus: false,
                isAction: 2,
                menuLevel: 2
              }
            );
          }
        });

        this.menuList = _.orderBy(this.menuList, ['rowOrder1', 'rowOrder2', 'rowOrder3'], ['asc', 'asc', 'asc']);
        // console.log("this.menuList :: ", this.menuList);

      }

      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });

    this.loaderService.hide();
  }

  editPermissionClick(event, data: any) {
    console.log("editPermissionClick :: ", data);
    this.userGroupId = data.id;
    // console.log("this.dataPermission :: ", this.dataPermission);
    if (this.dataPermission) {
      const filterData = _.filter(_.cloneDeep(this.dataPermission), { userGroupId: this.userGroupId });
      // console.log("filterData :: ", filterData);
      if (filterData.length) {
        _.each(filterData, (item) => {
          const findMenu = _.find(this.menuList, { menu1Id: item.menulevel1Id, menu2Id: item.menulevel2Id, menu3Id: item.menulevel3Id });
          // console.log("findMenu >> ", findMenu);
          if (findMenu) {
            // console.log("item.isActiveStatus :: ", item.activeStatus);
            findMenu.isActiveStatus = (_.toNumber(item.visibleMenu) === 1 ? true : false);
            findMenu.isAction = item.actionMenu;
          }
        });
        // console.log("this.menuList >> ", this.menuList);
      }
      else {
        // console.log("reset :: ");
        this.resetMenu();
      }
    }

    this.popupVisible = true;
  }

  fullClick = () => {
    this.popupFull = !this.popupFull;
  }

  onVisibleMenuClick(event: any, data: any) {
    // console.log("onVisibleMenuClick :: ", event);
    // console.log("onVisibleMenuClick :: ", data);
    if (this.userGroupId) {
      data.isActiveStatus = event.value;
    }
  }

  onActionMenuClick(data: any, value: any) {
    // console.log("onActionMenuClick :: ", data);
    // console.log("onActionMenuClick :: ", value);
    data.isAction = _.toNumber(value);
  }

  popupSaveClick() {
    // console.log("this.menuList", this.menuList);
    // console.log("this.userGroupId", this.userGroupId);
    let dataInsert: any = [];
    _.each(_.cloneDeep(this.menuList), (item) => {

      let maxRowOrder = _.max(_.map(this.menuList, 'rowOrder'))
      if (!maxRowOrder) {
        maxRowOrder = 0;
      }

      dataInsert.push({
        id: uuid(),
        rowOrder: (maxRowOrder + 1),
        activeStatus: 1,
        userGroupId: this.userGroupId,
        menulevel1Id: item.menu1Id,
        menulevel2Id: item.menu2Id,
        menulevel3Id: item.menu3Id,
        visibleMenu: (item.isActiveStatus == true ? 1 : 0),
        actionMenu: _.toNumber(item.isAction),
        createBy: (this.userProfile.fullName ? this.userProfile.fullName : null),
        updateBy: (this.userProfile.fullName ? this.userProfile.fullName : null),
      });

    });

    // console.log("dataInsert :: ", dataInsert);
    // return;
    const observable: any[] = [];
    observable.push(this.permissionService.create(dataInsert));
    // console.log("dataInsert :: ", dataInsert);
    // return;
    this.popupVisible = false;
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

  popupCancelClick() {
    this.userGroupId = null;
    this.popupVisible = false;
    this.resetMenu();
  }

  resetMenu() {
    if (this.menuList) {
      _.each(this.menuList, (item) => {
        item.isActiveStatus = false;
        item.isAction = 2;
      });
    }
  }
}
