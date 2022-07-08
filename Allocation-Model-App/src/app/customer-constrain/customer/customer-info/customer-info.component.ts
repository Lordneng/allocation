import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import { MasterCustomerService } from 'src/app/service/master-customer.service';
import { MasterPlantService } from 'src/app/service/master-plant.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {

  @Input() dataInfo: any = {};
  dataList: any = [];
  popupVisible = false;
  accessMenu: any;

  constructor(
    private loaderService: NgxSpinnerService,
    private customerService: MasterCustomerService,
    private plantService: MasterPlantService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
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

  plantAddClick() {
    if (!this.dataList) {
      this.dataList = [];
    }
    let id = uuid();
    if (this.dataInfo.plantData.lenth > 1) {
      id = _.max(_.map(this.dataList, 'id'));
    }
    this.dataInfo.plantData.push({ id: id });

  }

  deleteClick(event, data) {
    _.remove(this.dataInfo.plantData, (item) => {
      return item.id === data.id;
    })
  }

  show() {
    this.popupVisible = true;
  }

  hide() {
    this.popupVisible = false;
  }

  popupSaveClick = () => {

    console.log("save click :: --> ", this.dataInfo);
    if (!this.dataInfo.customerCode && !this.dataInfo.customerName) {
      return;
    }

    const observable: any[] = [];
    const dataCustomer: any = {};
    const dataPlant: any = [];

    dataCustomer.id = this.dataInfo.id;
    dataCustomer.customerCode = this.dataInfo.customerCode;
    dataCustomer.customerName = this.dataInfo.customerName;
    dataCustomer.customerShortName = this.dataInfo.customerShortName;
    dataCustomer.remark = this.dataInfo.remark;
    dataCustomer.activeStatus = 'Active';

    _.each(this.dataInfo.plantData, (item, index) => {
      dataPlant.push({
        // id: item.id,
        customerId: this.dataInfo.id,
        name: item.name,
        rowOrder: (index + 1),
        activeStatus: 'Active'
      });
    });

    console.log("dataCustomer ---> ", dataCustomer);
    console.log("dataPlant ---> ", dataPlant);

    // create
    if (this.dataInfo.isEdit === false) {
      observable.push(this.customerService.create(dataCustomer));
      observable.push(this.plantService.create(dataPlant));
    }
    // update
    else {
      dataCustomer.id = this.dataInfo.id;
      // console.log("dataCustomer ---> ", dataCustomer);
      // console.log("dataPlant ---> ", dataPlant);
      observable.push(this.customerService.update(dataCustomer));
      observable.push(this.plantService.update(dataPlant));
    }

    forkJoin(observable).subscribe(res => {
      this.hide();
      this.loaderService.hide();
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
    this.hide();
  }

}
