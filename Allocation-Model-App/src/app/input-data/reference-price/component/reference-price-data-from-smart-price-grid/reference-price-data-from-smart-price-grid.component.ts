import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { MasterReferenceSmartPricesService } from 'src/app/service/master-reference-smart-price.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reference-price-data-from-smart-price-grid',
  templateUrl: './reference-price-data-from-smart-price-grid.component.html',
  styleUrls: ['./reference-price-data-from-smart-price-grid.component.css']
})
export class ReferencePriceDataFromSmartPriceGridComponent implements OnInit {
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
  @ViewChild('referencePriceDataSmartPriceGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private masterRefPricesService: MasterReferenceSmartPricesService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  onYearChange(year: any, callbak) {
    this.year = year;
    this.retrieveMasterData().subscribe(res => {
      this.masterData.masterSmartRefPrices = res[0];
      this.dataInfo = this.masterData.masterSmartRefPrices[0];
      this.retrieveData();
      if (callbak) {
        callbak(this.dataInfo);
      }
    });
  }

  retrieveMasterData(): Observable<any> {
    const masterRefPrices = this.masterRefPricesService.getListFromDb(this.year);
    return forkJoin([masterRefPrices]);
  }


  retrieveData(isRetrospective: any = true) {
    if (this.masterData.masterSmartRefPrices && this.masterData.masterSmartRefPrices.length === 0 && isRetrospective === true) {
      this.retrieveMasterData().subscribe(res => {
        this.masterData.masterSmartRefPrices = res[0];
        this.retrieveData(false);
      });
    }

    this.dataList = this.masterData.masterSmartRefPrices;
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
    this.masterRefPricesService.getYear(this.year).subscribe(res => {
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
    this.masterRefPricesService.getYearForecast(this.year).subscribe((res: any) => {
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
