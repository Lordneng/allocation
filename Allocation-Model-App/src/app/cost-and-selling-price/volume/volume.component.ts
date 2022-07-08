
import { CostsService } from './../../service/costs.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


import * as _ from 'lodash';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { forkJoin } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { VolumeDataGridComponent } from './components/volume-data-grid/volume-data-grid.component';
import { VolumeHistoryComponent } from './components/volume-history/volume-history.component';
import { VolumeMarginPerUnitComponent } from './components/volume-margin-per-unit/volume-margin-per-unit.component';
import { VolumeSellingPriceComponent } from './components/volume-selling-price/volume-selling-price.component';
@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.css']
})
export class VolumeComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  numberBoxReadOnly = true;
  numberBoxFormat = "#,##0";
  configDrop = {
    url: 'https://httpbin.org/post',
    thumbnailWidth: 160,
    // tslint:disable-next-line: max-line-length
    previewTemplate: '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>'
  };
  form: FormGroup;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild('VolumeDataGrid') VolumeDataGrid: VolumeDataGridComponent;
  @ViewChild('VolumeMarginPerUnit') VolumeMarginPerUnit: VolumeMarginPerUnitComponent;
  @ViewChild('VolumeSellingPrice') VolumeSellingPrice: VolumeSellingPriceComponent;
  @ViewChild('VolumeHistory') VolumeHistory: VolumeHistoryComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  //costHistory
  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  masterData: any = {};
  year: any = '';
  version: any = 0;
  date: any;
  dataInfo:any = {};
  isTabDataAction = true;
  isTabHistoryAction = false;
  maxVersion: any = 0;
  constructor(private hotkeysService: HotkeysService,
    private router: Router, private modalService: BsModalService
    , private loaderService: NgxSpinnerService
    , private costsService: CostsService) {
    this.date = moment();
    this.year = moment().format('yyyy');
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      this.onSave();
      return false;
    }));
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.yearChange();
  }

  onUploadError(event): void {
    console.log(event);
  }

  onUploadSuccess(event): void {
    console.log(event);
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getCellCssClass(date) {
    var cssClass = "";

    // if(this.isWeekend(date))
    //     cssClass = "weekend";

    // this.holydays.forEach(function(item) {
    //     if(date.getDate() === item[0] && date.getMonth() === item[1]) {
    //         cssClass = "holyday";
    //         return false;
    //     }
    // });

    return cssClass;
  }

  onSave() {
    this.numberBoxReadOnly = true;
    Swal.fire({
      title: '<h3>คุณต้องการบันทึกหรือไม่</h3>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: 'red'

    }).then((result) => {

      if (result.isConfirmed) {
        // let datasave = this.VolumeDataGrid.getDataSave();
        let dataVersion: any = {};
        let versionSave = this.maxVersion + 1;
        dataVersion.year = this.year;
        dataVersion.version = versionSave;
        dataVersion.action = versionSave === 1 ? 'Insert' : 'Update';
        dataVersion.updateBy = 'Admin';
        dataVersion.pathFile = '';
        dataVersion.remark = this.dataInfo.remark;
        const observable: any[] = [];

        // observable.push(this.costsService.create(datasave));
        observable.push(this.costsService.saveVersion(dataVersion));

        forkJoin(observable).subscribe(res => {
          this.yearChange();
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
            showConfirmButton: false,
            // confirmButtonText: 'ปิด'
            timer: 1000
          })
        });

      } else {
        console.log('Cancel');
      }
    });
  }
  onYearChange($event) {
    console.log('$event', $event)
    this.year = moment($event.value).format('yyyy');
    this.yearChange();
  }
  yearChange() {
    // this.costHistory.onYearChange(this.year, (dataInfo) => {
      // this.dataInfo = dataInfo;
      this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      this.maxVersion = this.version;
      this.VolumeDataGrid.onYearChange(this.year, this.version,this.maxVersion);
    // })
  }
  onVersionChange($event) {


  }

  onHistoryClick($event){
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    // this.costDataGrid.onYearChange(this.year, this.version,this.maxVersion);
  }
}
