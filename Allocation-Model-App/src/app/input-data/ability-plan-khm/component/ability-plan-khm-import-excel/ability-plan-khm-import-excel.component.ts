import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { environment } from '../../../../../environments/environment';
import { ExcelsService } from '../../../../service/excels.service';

@Component({
  selector: 'app-ability-plan-khm-import-excel',
  templateUrl: './ability-plan-khm-import-excel.component.html',
  styleUrls: ['./ability-plan-khm-import-excel.component.css']
})
export class AbilityPlanKhmImportExcelComponent implements OnInit {

  apiUrlService = '';
  isImport = false;
  uploadFile: any = [];
  uploadFilesUrl = '';
  isMultiple = false;
  uploadMode = 'useForm';
  uploadData: any = [];

  @Input() yearImport: any = 2021;
  @Input() monthImport: any = moment().format('MM');
  @Input() dataInfo: any = {};
  @Output() onEventImport = new EventEmitter();

  constructor(private loaderService: NgxSpinnerService
    , private excelsService: ExcelsService) { }

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
      this.excelsService.uploadExcelAbilityPlanKHM(formData).subscribe((res: any) => {
        console.log('res', res);
        if (res && res.body && res.body.errCode !== '404') {
          // check year th/en
          const yearUpload : number = parseInt(moment(res.body.data[0]['year']).format('yyyy'));
          const yearNow : number = (parseInt(moment().format('yyyy')))

          console.log('yearUpload',yearUpload)
          console.log('yearNow',yearNow)


          if (yearUpload > yearNow) {
            this.loaderService.hide();
            Swal.fire({
              title: 'ไม่สามารถ Import Excel ได้กรุณาตรวจสอบปีที่ import',
              text: res.body.errDesc,
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'ปิด'
            })
            return;
          }

          this.dataInfo.filePath = res.body.path;
          this.dataInfo.fileName = res.body.fileName;

          // let month = moment().month();
          // month += 2;
          // set ข้อมลตั้งแต่ เดือนปัจจุบัน +1
          // this.abilityPlanKhmDataGrid.setData(res.body.data);
          this.uploadFile = [];
          this.onEventImport.emit(res.body);
          this.loaderService.hide();
        } else if (res.body) {
          this.loaderService.hide();
          Swal.fire({
            title: 'ไม่สามารถ Import Excel ได้',
            text: res.body.errDesc,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
          })
          this.onEventImport.emit([]);
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

      this.onEventImport.emit([]);
    }

    
  }

}
