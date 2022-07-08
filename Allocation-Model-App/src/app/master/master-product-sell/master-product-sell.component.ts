import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MasterProductsService } from "src/app/service/master-products.service";
import { saveEvent } from '../../service/enum';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-master-product-sell',
  templateUrl: './master-product-sell.component.html',
  styleUrls: ['./master-product-sell.component.css']
})
export class MasterProductSellComponent implements OnInit {
  dataList: any = []
  accessMenu: any;
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fas fa-sync-alt",
          onClick: this.retrieveListData.bind(this),
        },
      }
    );
  }
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  constructor(
    private dataService: MasterProductsService,
    private loaderService: NgxSpinnerService,
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
    const masterCost = this.dataService.getList();
    return forkJoin([masterCost]);
  }
  retrieveListData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe(res => {
      console.log("data", res);
      this.dataList = res[0];

      this.loaderService.hide();
      if (this.dxDataGridList && this.dxDataGridList.instance) {
        this.dxDataGridList.instance.refresh();
      }
    });

    this.loaderService.hide();
  }
  onSave(event) {
    console.log('event', event);
    if (event && event.changes && event.changes.length > 0) {
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
}
