import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DxDataGridComponent,
  DxValidationGroupComponent,
} from 'devextreme-angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MasterTurnaroundService } from 'src/app/service/master-turnaround.service';
import { MasterTurnaroundTypeService } from 'src/app/service/master-turnaround-types.service';
import { MasterCustomerService } from 'src/app/service/master-customer.service';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { MasterPlantService } from 'src/app/service/master-plant.service';
import * as moment from 'moment';
import { ISidebar, SidebarService } from '../../../containers/layout/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth.service';

interface Formula {
  id: number;
  name: string;
}

@Component({
  selector: 'app-turn-around-detail',
  templateUrl: './turn-around-detail.component.html',
  styleUrls: ['./turn-around-detail.component.css']
})
export class TurnAroundDetailComponent implements OnInit {
  accessMenu: any;
  dataInfo: any = {};
  Id = uuid();
  validateResult: any = { isValid: true };
  isDisablePercent = true;
  updatePercent = null;
  dataTurnaround: any = {};
  dataTurnType: any = {};
  dataCustomer: any = {};
  dataProduct: any = {};
  dataPlantCustomer: any = {};
  copyMsg: string = '';
  isCopyId: any = null;
  sidebar: ISidebar;
  subscription: Subscription;

  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;

  constructor(
    private router: Router,
    private loaderService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private dataService: MasterTurnaroundService,
    private dataTurnTypeService: MasterTurnaroundTypeService,
    private dataCustomerService: MasterCustomerService,
    private dataProductService: MasterProductsService,
    private authService: AuthService,
    private sidebarService: SidebarService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log('params', params);
      if (params.id) {
        this.Id = params.id;
      }
      if (params.iscopy) {
        this.copyMsg = '[Copy]';
        this.isCopyId = params.iscopy;
      }
    });

    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );

    this.retrieveData();
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.accessMenuList();
    }, 500);
  }

  async accessMenuList() {
    this.authService.menuAll$.subscribe(res => {
      if (res && res.currentMenu) {
        // console.log("res >>>>>>> ", res['currentMenu']);
        console.log("actionMenu > ", res.currentMenu?.actionMenu);
        this.accessMenu = res.currentMenu.actionMenu;

        if (this.accessMenu != 1) {
          this.isDisablePercent = true;
        }
      }
    });
  }

  retrieveMasterData(): Observable<any> {
    const dataTurnType = this.dataTurnTypeService.getList();
    const masterCustomer = this.dataCustomerService.getList();
    const masterProduct = this.dataProductService.getList();
    const dataTurnaround = this.dataService.getOne(this.Id);
    return forkJoin([
      dataTurnType,
      masterCustomer,
      masterProduct,
      dataTurnaround,
    ]);
  }

  retrieveData() {
    this.loaderService.show();
    this.retrieveMasterData().subscribe((res) => {

      console.log('res',res);

      this.dataTurnType = res[0];
      this.dataCustomer = res[1];
      this.dataProduct = _.filter(_.cloneDeep(res[2]), { activeStatus: 'Active', });
      if (res[3]) {
        this.dataTurnaround = res[3];
        this.updatePercent = this.dataTurnaround.percent;
        this.dataTurnaround.isEdit = true;
        this.changPercentDisable(this.dataTurnaround?.turnaroundTypeId);
      } else {
        this.dataTurnaround.isEdit = false;
        this.dataTurnaround.id = this.Id;
      }
      // this.dataPlant = res[4];
      // this.dataPlantCustomer = res[4];
      this.dataInfo = this.dataTurnaround;

    });
    this.loaderService.hide();
  }

  customerChanged($event) {
    const data = this.dataCustomer;
    const ID = $event.value;
    const findData = _.find(data, (item) => {
      return item.id === ID;
    });

    if (ID) {
      this.dataCustomerService.getPlant(ID).subscribe((res) => {
        this.dataPlantCustomer = res;
        if (this.dataPlantCustomer.length === 0) {
          this.dataTurnaround.plantId = null;
        }
      });
      // this.dataPlantCustomer = _.filter(_.cloneDeep(this.dataPlant), { customerId: ID.toLowerCase(), });
      // console.log('this.dataTurnaround.plantId',this.dataTurnaround.plantId);
      // if(this.dataTurnaround.plantId){
      //   let filterPlantCustomer = _.filter(_.cloneDeep(this.dataPlantCustomer), { id: this.dataTurnaround.plantId, });
      //   if(filterPlantCustomer.length == 0){
      //     this.dataTurnaround.plantId = null;
      //   }
      // }
    }

    if (findData) {
      this.dataTurnaround.customerName = findData.name;
    }

  }

  plantChanged($event) {
    const data = this.dataPlantCustomer;
    const ID = $event.value;
    const findData = _.find(data, (item) => {
      return item.id === ID;
    });

    if (findData) {
      this.dataTurnaround.plantName = findData.name;
    }

  }

  productChanged($event) {
    const data = this.dataProduct;
    const ID = $event.value;
    const findData = _.find(data, (item) => {
      return item.id === ID;
    });

    if (findData) {
      this.dataTurnaround.productName = findData.productName;
    }

  }

  turnTypeChanged($event) {
    console.log('$event turnTypeChanged', $event);
    const turnTypeId = $event.value;
    // console.log('turnTypeId',turnTypeId);
    this.changPercentDisable(turnTypeId);
  }

  changPercentDisable(turnTypeId: any){
    if (turnTypeId) {
      const findData = _.find(_.cloneDeep(this.dataTurnType), (item) => {
        return item.id === turnTypeId;
      });

      console.log('findData',findData);

      if (findData) {
        this.dataTurnaround.turnaroundTypeName = findData.name;
        // if(findData.isDisable == true){
        //   this.dataTurnaround.percent = findData.value;
        // }else{
        //   if (this.dataTurnaround.isEdit === true){
        //     this.dataTurnaround.percent = this.updatePercent;
        //   }else{
        //     this.dataTurnaround.percent = null;
        //   }
        // }
        this.dataTurnaround.percent = (findData.isDisable ? findData.value : (this.updatePercent ? this.updatePercent : findData.value));
        this.isDisablePercent = findData.isDisable;

      }
    } else {
      this.dataTurnaround.percent = null;
      this.isDisablePercent = true;
    }
  }

  dateChanged() {
    if (this.dataTurnaround.startTurnaroundDate && this.dataTurnaround.endTurnaroundDate) {
      var startDate = moment(this.dataTurnaround.startTurnaroundDate);
      var endDate = moment(this.dataTurnaround.endTurnaroundDate);
      var duration = moment.duration(endDate.diff(startDate));
      var durationday = duration.asDays();
      console.log('durationdays', durationday);
      if (durationday >= 0) {
        this.dataTurnaround.duration = durationday + 1;
      } else {

        this.dataTurnaround.startTurnaroundDate = endDate;

        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: "ไม่สามารถเลือกวันที่เริ่มต้นมากกว่าวันที่สิ้นสุดได้",
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
        });
      }
    }
  }

  SaveClick = () => {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();

      if (this.validateResult.isValid) {
        this.saveData();
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  };

  BackClick = () => {
    this.router.navigate([
      'customer-constrain',
      'turn-around',
    ]);
  };

  saveData() {

    console.log('dataTurnaround', this.dataTurnaround);

    const observable: any[] = [];

    if (this.isCopyId) {
      this.dataTurnaround.id = this.isCopyId;
      this.dataTurnaround.isEdit = false;
      delete this.dataTurnaround['createBy'];
      delete this.dataTurnaround['createDate'];
      delete this.dataTurnaround['updateBy'];
      delete this.dataTurnaround['updateDate'];
    }

    // Insert
    if (this.dataTurnaround.isEdit === false) {
      observable.push(this.dataService.create(this.dataTurnaround));
    }
    // update
    else {
      observable.push(this.dataService.update(this.dataTurnaround));
    }

    forkJoin(observable).subscribe(
      (res) => {
        this.loaderService.hide();
        Swal.fire({
          title: '',
          text: 'บันทึกสำเร็จ',
          icon: 'success',
          showConfirmButton: false,
          // confirmButtonText: 'ปิด'
          timer: 1000,
        })

        this.router.navigate([
          'customer-constrain',
          'turn-around',
        ]);

        // this.retrieveData();
      },
      (error) => {
        // console.log("error >>> ", error);
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: error.error.message,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
          //timer: 1000
        });
      }
    );
  }
}
