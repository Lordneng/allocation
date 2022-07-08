import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import Swal from 'sweetalert2';
import { saveEvent } from '../../service/enum';

@Component({
  selector: 'app-master-product-cost',
  templateUrl: './master-product-cost.component.html',
  styleUrls: ['./master-product-cost.component.css']
})
export class MasterProductCostComponent implements OnInit {
  dataList: any = [];
  accessMenu: any;
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
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  constructor(
    private masterCostsService: MasterCostsService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.retrieveData();
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
    const masterCost = this.masterCostsService.getList();
    return forkJoin([masterCost]);
  }
  retrieveData() {
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
    console.log('event.changes', event.changes);
    console.log('event.changes.length', event.changes.length);
    console.log('datalist', this.dataList);
    if (event && event.changes && event.changes.length > 0) {
      this.saveData(event.changes);
    }
  }

  saveData(data) {
    console.log("item.data1", data);

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
      observable.push(this.masterCostsService.create(dataInsert));
    }
    if (dataUpdate.length > 0) {
      _.each(dataUpdate, (item) => {
        observable.push(this.masterCostsService.update(item));
      });
    }
    if (dataRemove.length > 0) {

      _.each(dataRemove, (item) => {
        observable.push(this.masterCostsService.delete(item));
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

}
