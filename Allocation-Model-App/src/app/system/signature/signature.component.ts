import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxTagBoxComponent, DxValidationGroupComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { SignatureService } from 'src/app/service/signature.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../service/enum';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {
  imageSrc: string = '';
  dataList: any = [];
  dataMaster: any = [];
  signatureGroupDropdown: any = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  popupVisible = false;
  validateResult: any = { isValid: true };
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

  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  constructor(
    private SignatureService: SignatureService,
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
      this.saveData(this.dataList);
      if (this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    }, 100);
  }

  retrieveMasterData(): Observable<any> {
    const masterSignature = this.SignatureService.getList();
    return forkJoin([masterSignature]);
  }

  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("data", res);
      this.dataList = res[0];
      this.dataMaster.SignatureGroup = res[1];
      this.dataMaster.masterSignatureGroupList = res[2];
      if (this.dataList && this.dataList.length > 0) {
        _.each(this.dataList, (item) => {
          item.signatureGroupDropdown = [];
          const masterSignatureGroupListData = _.filter(_.cloneDeep(this.dataMaster.masterSignatureGroupList), (x) => { return _.toUpper(x.signature_id) == _.toUpper(item.id) });
          if (masterSignatureGroupListData) {
            _.each(masterSignatureGroupListData, (x) => {
              item.signatureGroupDropdown.push(x.signature_group_id);
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

  handleInputChange(event) {
    console.log('event', event);
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.popupVisible = false;
      Swal.fire({
        title: 'เลือกไฟล์ไม่สำเร็จ',
        text: "-- กรุณาเลือกไฟล์รูปภาพ เท่านั้น!! --",
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        // timer: 1000
      }).then((result) => {
        this.popupVisible = true;
      })
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.dataInfo.signatureImg = this.imageSrc;
    console.log(this.imageSrc)
  }

  saveData(data) {
    console.log("item.data1", data);

    let dataInsert: any = {};
    let dataUpdate: any = {};
    // let dataRemove: any = [];
    // let signatureGroupData: any = [];
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
      observable.push(this.SignatureService.create(dataInsert));
    }
    else if (this.dataInfo.isEdit === true) {
      // dataUpdate.push(data);
      dataUpdate = data;
      observable.push(this.SignatureService.update(dataUpdate));
    }

    // if (data.signatureGroupDropdown) {
    //   _.each(data.signatureGroupDropdown, (i, idx) => {
    //     signatureGroupData.push({
    //       signature_id: data.id,
    //       signature_group_id: i,
    //       rowOrder: (idx + 1),
    //       activeStatus: 1
    //     });
    //   });
    // }
    // });

    // if (dataInsert.length > 0) {
    //   observable.push(this.SignatureService.create(dataInsert));
    // }
    // if (dataUpdate.length > 0) {
    //   _.each(dataUpdate, (item) => {
    //     observable.push(this.SignatureService.update(item));
    //   })
    // }
    // if (dataRemove.length > 0) {
    //   _.each(dataRemove, (item) => {
    //     observable.push(this.SignatureService.delete(item));
    //   });
    // }

    // observable.push(this.masterSignatureGroupListService.create(signatureGroupData));

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
      this.popupVisible = false;
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ',
        text: error.error.message,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        // timer: 1000
      }).then((result) => {
        this.popupVisible = true;
      })
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
    console.log("doEdit", data);
    this.popupVisible = true
    this.dataInfo = data;
    this.imageSrc = this.dataInfo.signatureImg;
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
