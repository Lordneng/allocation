import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { MasterCostsSmartPriceService } from 'src/app/service/master-costs-smart-price.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cost-smart-price-data-grid',
  templateUrl: './cost-smart-price-data-grid.component.html',
  styleUrls: ['./cost-smart-price-data-grid.component.css']
})
export class CostSmartPriceDataGridComponent implements OnInit {
  dataList: any = [];
  masterData: any = {};
  dynamicColumns: any[] = [];
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = 2022

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  dataInfo: any = {};

  @Output() onEventClick = new EventEmitter();
  @ViewChild('costDataSmartPriceGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(
    private masterCostService: MasterCostsSmartPriceService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  onYearChange(year: any) {
    this.year = year;
    this.retrieveMasterData().subscribe(res => {
      console.log("res >>", res);
      this.masterData.masterCostSmartPrice = res[0];
      this.retrieveData();
    });
  }

  retrieveMasterData(): Observable<any> {
    const masterCost = this.masterCostService.getListFromDb(this.year);
    return forkJoin([masterCost]);
  }

  retrieveData(isRetrospective: any = true) {
    if (this.masterData.masterCostSmartPrice && this.masterData.masterCostSmartPrice.length === 0 && isRetrospective === true) {
      this.retrieveMasterData().subscribe(res => {
        this.masterData.masterCostSmartPrice = res[0];
        this.retrieveData(false);
      });
    }

    this.dataList = this.masterData.masterCostSmartPrice;
    if (!this.dataInfo) {
      this.dataInfo = {};
    }
    this.loaderService.hide();
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  onGetData() {
    this.loaderService.show();
    this.masterCostService.getYear(this.year).subscribe(res => {
      this.loaderService.hide();
      this.retrieveData();
      Swal.fire({
        title: '',
        text: 'ดึงข้อมูลสำเร็จ',
        icon: 'success',
        showConfirmButton: false,
        // confirmButtonText: 'ปิด'
        timer: 1000
      })
    }, error => {
      Swal.fire({
        title: 'ดึงข้อมูบไม่สำเร็จ',
        text: error.message,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
        //timer: 1000
      })
    });
  }

  onGetDataForecast() {
    this.loaderService.show();
    this.masterCostService.getYearForecast(this.year).subscribe((res: any) => {
      this.loaderService.hide();
      console.log('res', res)
      if ((res && res.length === 0)) {
        Swal.fire({
          title: 'ดึงข้อมูลไม่สำเร็จ',
          text: 'ไม่มีข้อมูล Forecast จาก Smart Prices ของปี ' + this.year,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
        })
        return;
      } else {
        this.onEventClick.emit(res);
      }
      Swal.fire({
        title: '',
        text: 'ดึงข้อมูลสำเร็จ',
        icon: 'success',
        showConfirmButton: false,
        // confirmButtonText: 'ปิด'
        timer: 1000
      })
    }, error => {
      Swal.fire({
        title: 'ดึงข้อมูลไม่สำเร็จ',
        text: error.message,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
        //timer: 1000
      })
    });
  }
}
