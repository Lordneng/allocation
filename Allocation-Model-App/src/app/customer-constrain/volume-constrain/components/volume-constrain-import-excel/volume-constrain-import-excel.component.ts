import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import * as _ from 'lodash';

import { environment } from '../../../../../environments/environment';
import { ExcelsService } from '../../../../service/excels.service';

@Component({
  selector: 'app-volume-constrain-import-excel',
  templateUrl: './volume-constrain-import-excel.component.html',
  styleUrls: ['./volume-constrain-import-excel.component.css']
})
export class VolumeConstrainImportExcelComponent implements OnInit {

  apiUrlService = '';
  @Input() dataInfo: any = {};

  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = false;
  uploadMode = 'useForm';
  uploadData: any = [];
  @Input() yearImport: any = 2021;
  @Input() monthImport: any = 2021;
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
      const observable: any[] = [];
      observable.push(this.excelsService.uploadVolumeConstrainMeter(formData));
      observable.push(this.excelsService.uploadVolumeConstrainKT(formData));

      forkJoin(observable).subscribe((res: any) => {
        if (res && res.length > 0) {
          const errorCode = _.find(res, (item) => {
            return item.body.errCode === '404';
          });
          if (!errorCode) {
            console.log('res',res)
            this.dataInfo.filePath = res[0].body.path;
            this.dataInfo.fileName = res[0].body.fileName;
            let data: any = {};
            data.Meter = res[0].body.data;
            data.KT = res[1].body.data;
            this.uploadFile = [];
            this.onEventImport.emit({ data: data, dataInfo: this.dataInfo });
          } else {
            this.loaderService.hide();
            Swal.fire({
              title: 'ไม่สามารถ Import Excel ได้',
              text: errorCode.body.errDesc,
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'ปิด'
            })
          }
        }
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
