import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { environment } from '../../../../../environments/environment';
import { ExcelsService } from '../../../../service/excels.service';
import { ReferencePriceDataGridComponent } from '../reference-price-data-grid/reference-price-data-grid.component';


@Component({
  selector: 'app-reference-price-import-excel',
  templateUrl: './reference-price-import-excel.component.html',
  styleUrls: ['./reference-price-import-excel.component.css']
})
export class ReferencepriceImportExcelComponent implements OnInit {


  apiUrlService = '';
  @Input() dataInfo: any = {};

  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = true;
  uploadMode = 'useButtons';
  uploadData: any = [];
  errorMessage: any = "";
  @Input() date: any;
  @Output() onEventImport = new EventEmitter();
  @ViewChild('referencePriceDataGrid') referencePriceDataGrid: ReferencePriceDataGridComponent;

  constructor(
    private loaderService: NgxSpinnerService
    , private excelsService: ExcelsService) {

    // this.yearImport = moment().format('yyyy');
  }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlService
  }

  onFileUploadValueChanged($event: any) {
    this.isImport = true;
  }

  onImportExcel(event) {
    this.loaderService.show();
    if (this.uploadFile) {
      const formData = new FormData();
      _.each(this.uploadFile, (item, index) => {
        formData.append('file' + (index + 1), item);
      })

      console.log('data', this.uploadFile);
      this.excelsService.uploadExcelReferencePrice(formData, moment(this.date).year()).subscribe((res: any) => {
        console.log('res', res);
        if (res && res.body && res.body.errCode !== '404') {

          for (let i = 1; i <= 3; i++) {
            const fileType =  res.body['fileType' + i];
            console.log('fileType',fileType);
            switch(fileType) { 
              case 'กบน.': { 
                this.dataInfo.isImportFile1 = true;
                this.dataInfo.filePath1 = res.body['filePath' + i];
                this.dataInfo.fileName1 = res.body['fileName' + i];
                break; 
              } 
              case 'LPG Forecast': {
                this.dataInfo.isImportFile2 = true;
                this.dataInfo.filePath2 = res.body['filePath' + i];
                this.dataInfo.fileName2 = res.body['fileName' + i];
                break; 
              } 
              case 'Summary': {
                this.dataInfo.isImportFile3 = true;
                this.dataInfo.filePath3 = res.body['filePath' + i];
                this.dataInfo.fileName3 = res.body['fileName' + i];
                break; 
             }
           }
          }

          console.log('this.dataInfo',this.dataInfo);

          // this.dataInfo.filePath1 = res.body.filePath1;
          // this.dataInfo.filePath2 = res.body.filePath2;
          // this.dataInfo.filePath3 = res.body.filePath3;
          // this.dataInfo.fileName1 = res.body.fileName1;
          // this.dataInfo.fileName2 = res.body.fileName2;
          // this.dataInfo.fileName3 = res.body.fileName3;
          // this.dataInfo.fileNameUser = this.uploadFile[0].name;

          let month = moment().month();
          month += 2;
          // set ข้อมลตั้งแต่ เดือนปัจจุบัน +1
          //this.referencePriceDataGrid.setData(res.body.data, month);
          this.uploadFile = [];
          this.errorMessage = "";
          this.onEventImport.emit(res.body.data);
        } else if (res.body) {
          this.loaderService.hide();
          this.errorMessage = res.body.errDesc;
          // Swal.fire({
          //   title: 'ไม่สามารถ Import Excel ได้',
          //   text: res.body.errDesc,
          //   icon: 'error',
          //   showConfirmButton: true,
          //   confirmButtonText: 'ปิด'
          // })
        }
      })
    }
  }

  /*onImportExcel(event) {
    this.loaderService.show();
    if (this.uploadFile && this.uploadFile.length === 1) {
      const formData = new FormData();
      formData.append('file', this.uploadFile[0]);
      console.log('data', this.uploadFile);
      this.excelsService.uploadExcelCost(formData).subscribe((res: any) => {
        if (res && res.body && res.body.errCode !== '404') {
          this.dataInfo.filePath = res.body.path;
          this.dataInfo.fileName = res.body.fileName;

          let month = moment().month();
          month += 2;
          // set ข้อมลตั้งแต่ เดือนปัจจุบัน +1
        // this.costDataGrid.setData(res.body.data, this.yearImport);
          this.uploadFile = [];
          this.onEventImport.emit(res.body.data);
        } else if (res.body) {
          this.loaderService.hide();
          Swal.fire({
            title: 'ไม่สามารถ Import Excel ได้',
            text: res.body.errDesc,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          })
        }
      })
    } else {
      Swal.fire({
        title: 'จำนวนไฟล์ในการ upload',
        text: 'ไฟล์ในการ upload  ต้องมี 1 ไฟล์เท่านั้นกรุณาลบไฟล์ที่ไม่เกี่ยวข้อง',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด'
      })
    }
  }*/
}
