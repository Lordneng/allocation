import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { MasterReferenceSmartPricesService } from 'src/app/service/master-reference-smart-price.service';
import { MasterConditionOfSaleSmartPriceService } from 'src/app/service/master-condition-of-sale-smart-price.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smart-price-data-grid',
  templateUrl: './smart-price-data-grid.component.html',
  styleUrls: ['./smart-price-data-grid.component.css']
})
export class SmartPriceDataGridComponent implements OnInit {
  dataList: any = [];
  masterData: any = {};
  dynamicColumns: any[] = [];
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = 2022
  month: any = 1;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  dataInfo: any = {};

  @Output() onEventClick = new EventEmitter();
  @ViewChild('dataGridSmartPrice', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private masterRefPricesService: MasterReferenceSmartPricesService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private masterConditionOfSaleSmartPriceService: MasterConditionOfSaleSmartPriceService) { }

  ngOnInit(): void {
  }

  onYearChange(month: any, year: any) {
    this.month = month;
    this.year = year;
    this.retrieveMasterData().subscribe(res => {
      this.masterData.masterSmartPrice = res[0];
      this.retrieveData();
    });
  }

  retrieveMasterData(): Observable<any> {
    const masterSmartPrice = this.masterConditionOfSaleSmartPriceService.getListFromDb(this.year);
    return forkJoin([masterSmartPrice]);
  }

  retrieveData(isRetrospective: any = true) {
    if (this.masterData.masterSmartPrice && this.masterData.masterSmartPrice.length === 0 && isRetrospective === true) {
      this.retrieveMasterData().subscribe(res => {
        this.masterData.masterCostSmartPrice = res[0];
        this.retrieveData(false);
      });
    }

    this.dataList = this.masterData.masterSmartPrice;
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
    this.masterConditionOfSaleSmartPriceService.getYear(this.month, this.year).subscribe(res => {
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
}
