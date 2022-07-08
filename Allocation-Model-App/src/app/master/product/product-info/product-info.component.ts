import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { MasterProductGradeService } from 'src/app/service/master-product-grade.service'
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../service/auth.service';

@Component({
   selector: 'app-product-info',
   templateUrl: './product-info.component.html',
   styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {

   @Input() dataInfo: any = {};
   dataList: any = [];
   popupVisible = false;
   accessMenu: any;

   constructor(
      private loaderService: NgxSpinnerService,
      private dataProductService: MasterProductsService,
      private dataProductGradeService: MasterProductGradeService,
      private authService: AuthService
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

   gradeAddClick() {
      if (!this.dataList) {
         this.dataList = [];
      }
      let id = uuid();
      if (this.dataInfo.gradeData.lenth > 1) {
         id = _.max(_.map(this.dataList, 'id'));
      }
      this.dataInfo.gradeData.push({ id: id, productGrade: this.dataInfo.productGrade });
      this.dataInfo.productGrade = '';
   }

   deleteClick(event, data) {
      _.remove(this.dataInfo.gradeData, (item) => {
         return item.id == data.id;
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

      const observable: any[] = [];
      const dataProduct: any = {};
      const dataGrade: any = [];

      dataProduct.id = this.dataInfo.id;
      dataProduct.productCode = this.dataInfo.productCode;
      dataProduct.productName = this.dataInfo.productName;
      dataProduct.productShortName = this.dataInfo.productShortName;
      dataProduct.remark = this.dataInfo.remark;
      dataProduct.activeStatus = 'Active';

      _.each(this.dataInfo.gradeData, (item, index) => {
         dataGrade.push({
            productId: this.dataInfo.id,
            productGrade: item.productGrade,
            rowOrder: (index + 1)
         });
      });

      console.log("dataProduct :: ", dataProduct);
      console.log("dataGrade :: ", dataGrade);

      // create
      if (this.dataInfo.isEdit === false) {
         observable.push(this.dataProductService.create(dataProduct));
         observable.push(this.dataProductGradeService.create(dataGrade));
      }
      // update
      else {
         dataProduct.id = this.dataInfo.id;
         dataProduct.rowOrder = (this.dataInfo.rowOrder + 1)
         observable.push(this.dataProductService.update(dataProduct));
         observable.push(this.dataProductGradeService.create(dataGrade));
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
            text: error.error.message,
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด'
            //timer: 1000
         })
      });

   }

   popupCancelClick = () => {
      this.dataInfo = {};
      this.hide();
   }

}
