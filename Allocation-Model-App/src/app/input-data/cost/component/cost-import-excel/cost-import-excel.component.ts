import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { environment } from '../../../../../environments/environment';
import { ExcelsService } from '../../../../service/excels.service';

@Component({
  selector: 'app-cost-import-excel',
  templateUrl: './cost-import-excel.component.html',
  styleUrls: ['./cost-import-excel.component.css']
})
export class CostImportExcelComponent implements OnInit {


  apiUrlService = '';
  @Input() dataInfo: any = {};

  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = false;
  uploadMode = 'useForm';
  uploadData: any = [];
  @Input() date: any;
  @Output() onEventImport = new EventEmitter();

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
    if (this.uploadFile && this.uploadFile.length === 1) {
      const formData = new FormData();
      formData.append('file', this.uploadFile[0]);
      console.log('data', this.uploadFile);
      this.excelsService.uploadExcelCost(formData).subscribe((res: any) => {
        if (res && res.body && res.body.errCode !== '404') {
          this.dataInfo.filePath = res.body.path;
          this.dataInfo.fileName = res.body.fileName;
          this.dataInfo.fileNameUser = this.uploadFile[0].name;

          let month = moment().month();
          month += 2;
          // set ข้อมลตั้งแต่ เดือนปัจจุบัน +1
        // this.costDataGrid.setData(res.body.data, this.yearImport);
          this.uploadFile = [];
          console.log(res.body.data);
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
  }
}
