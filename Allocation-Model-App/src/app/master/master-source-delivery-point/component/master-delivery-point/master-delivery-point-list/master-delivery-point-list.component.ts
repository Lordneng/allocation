import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterDeliveryPointService } from 'src/app/service/master-delivery-point.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { saveEvent } from 'src/app/service/enum';
import { forkJoin, Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { AuthService } from '../../../../../service/auth.service';

@Component({
  selector: 'app-master-delivery-point-list',
  templateUrl: './master-delivery-point-list.component.html',
  styleUrls: ['./master-delivery-point-list.component.css']
})
export class MasterDeliveryPointListComponent implements OnInit {

  dataList: any = []
  dataInfo: any = {};
  dataPlantList: any = [];
  dataInfoOld: any = {};
  popupVisible = false;
  validateResult: any = { isValid: true };

  modalRef: BsModalRef;
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

  accessMenu: any;

  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  constructor(
    private loaderService: NgxSpinnerService,
    private dataService: MasterDeliveryPointService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.retrieveListData();
    this.accessMenuList();
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
    const masterDeliveryPoint = this.dataService.getList();
    return forkJoin([masterDeliveryPoint]);
  }

  retrieveListData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("data", res);
      this.dataList = res[0];
      // this.onGenFile();
      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });
    this.loaderService.hide();
  }

  customizeTextDateFormat(cellInfo) {
    if (cellInfo && cellInfo.value && _.isDate(cellInfo.value))
      return moment(cellInfo.value).format('DD/MMM/YYYY');
    else return cellInfo.valueText;

  }

  editClick($event: any, itemData: any) {
    if ($event && itemData) {
      itemData.isEdit = true;
      this.doEdit(itemData);
    }
  }

  addClick($event: any) {
    const infoForm: any = { code: null, name: null, activeStatus: 'Active', isEdit: false };
    this.doEdit(infoForm);
  }

  doEdit(data?: any) {

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

    console.log("doEdit", data);
    this.popupVisible = true
    data.transportationType = data.transportationTypeCode;
    this.dataInfo = data;
    // this.infoForm.show();
    // this.infoForm.dataInfo = data;
  }

  popupSaveClick() {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      // console.log("this.validateResult :: ", this.validateResult);
      // return;
      if (this.validateResult.isValid) {
        this.SaveData();
        this.popupVisible = false;
        this.validateResult.isValid = false;
      }
      else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  SaveData = () => {

    console.log("save click :: --> ", this.dataInfo);

    if (!this.dataInfo.isEdit) {
      const checkDuplicate = _.find(_.cloneDeep(this.dataList), (i) => { return _.toLower(i.code) == _.toLower(_.trim(this.dataInfo.code)) });
      if (checkDuplicate) {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: 'มี Code "' + _.trim(this.dataInfo.code) + '" ในระบบแล้ว',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
          //timer: 1000
        })
        this.retrieveListData();
        return;
      }
    }

    else {
      const checkDuplicate = _.find(_.cloneDeep(this.dataList), (it) => { return _.toLower(it.code) == _.toLower(_.trim(this.dataInfo.code)) && it.id != this.dataInfo.id });
      if (checkDuplicate) {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: 'มี Code "' + _.trim(this.dataInfo.code) + '" ในระบบแล้ว',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
          //timer: 1000
        })
        this.retrieveListData();
        return;
      }
    }

    const observable: any[] = [];
    const dataForSave: any = {};

    dataForSave.code = _.trim(this.dataInfo.code);
    dataForSave.name = _.trim(this.dataInfo.name);
    dataForSave.transportationTypeCode = this.dataInfo.transportationType;
    dataForSave.transportationTypeName = this.dataInfo.transportationType;
    dataForSave.activeStatus = this.dataInfo.activeStatus;

    // create
    if (this.dataInfo.isEdit === false) {
      let maxRowOrder = _.max(_.map(this.dataList, 'rowOrder'))
      if (!maxRowOrder) {
        maxRowOrder = 0;
      }

      dataForSave.rowOrder = maxRowOrder + 1;
      observable.push(this.dataService.create(dataForSave));
    }
    // update
    else {
      dataForSave.id = this.dataInfo.id;
      observable.push(this.dataService.update(dataForSave));
    }

    forkJoin(observable).subscribe(res => {
      this.popupVisible = false;
      this.loaderService.hide();
      this.retrieveListData();
      Swal.fire({
        title: '',
        text: 'บันทึกสำเร็จ',
        icon: 'success',
        showConfirmButton: false,
        // confirmButtonText: 'ปิด'
        timer: 1000
      })
    }, error => {
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ',
        text: error.message,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
        //timer: 1000
      })
    });

  }
  popupCancelClick = () => {
    this.dataInfo = {};
    this.popupVisible = false;
    this.retrieveListData();
  }

  onHidingClick() {
    this.dataInfo = {};
    this.popupVisible = false;
    this.retrieveListData();
  }

}


