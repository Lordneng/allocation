import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { DxDataGridComponent } from "devextreme-angular";
import * as _ from "lodash";
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";
import { NgxSpinnerService } from "ngx-spinner";
import { forkJoin } from "rxjs";
import { TankCapService } from "src/app/service/tankcap.service";
import { ExcelsService } from "src/app/service/excels.service";
import Swal from "sweetalert2";
import { CostAndSellingPriceModule } from "../cost-and-selling-price.module";
import { TankCapDataGridComponent } from "./component/tank-cap-data-grid/tank-cap-data-grid.component";
import { TankCapDataHistoryComponent } from "./component/tank-cap-data-history/tank-cap-data-history.component";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-tank-cap",
  templateUrl: "./tank-cap.component.html",
  styleUrls: ["./tank-cap.component.css"],
})
export class TankCapComponent implements OnInit {
  dataInfo: any = {};
  dataList: any = [];
  listMonth = [];
  isCollapsedAnimated = false;
  masterData: any = {};
  year: any = "";
  version: any = 0;
  versionNew: any = 0;
  date: any;
  dateOld: any;
  dataInfoOld: any = {};
  dateDisplay: any = "";
  isTabDataAction = true;
  isTabHistoryAction = false;
  popupVisible = false;
  remarkPopupVisible = false;
  maxVersion: any = 0;
  apiUrlService = "";
  uploadFile: any = [];
  uploadFilesUrl = "";
  isMultiple = true;
  uploadMode = "useForm";
  uploadData: any = [];
  month: any = "";
  defaultVersion: boolean = true;
  activeTab: boolean = true;
  isNewMonthVersion: boolean = false;
  isHideSaveBtn: boolean = true;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-right",
  };
  messageValidate: string = "";
  numberBoxReadOnly = true;
  numberBoxFormat = "#,##0";
  configDrop = {
    url: "https://httpbin.org/post",
    thumbnailWidth: 160,
    // tslint:disable-next-line: max-line-length
    previewTemplate:
      '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>',
  };
  form: FormGroup;
  accessMenu: any;

  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild("myTable") table: any;
  @ViewChild("dxDataGridList") dxDataGridList: DxDataGridComponent;
  @ViewChild("TankCapDataGrid") TankCapDataGrid: TankCapDataGridComponent;
  @ViewChild("TankCapHistory") TankCapHistory: TankCapDataHistoryComponent;
  @ViewChild("tabSet") tabSet: TabsetComponent;

  constructor(
    private hotkeysService: HotkeysService,
    private router: Router,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private TankCapService: TankCapService,
    private excelsService: ExcelsService,
    private authService: AuthService
  ) {
    this.date = moment();
    this.year = moment().format("yyyy");
    this.month = moment().format("MM");
    this.hotkeysService.add(
      new Hotkey("ctrl+s", (event: KeyboardEvent): boolean => {

        if (this.accessMenu !== 1) {
          Swal.fire({
            title: 'Access Denied',
            text: 'ไม่สามารถทำรายการได้ เนื่องจาก ไม่มีสิทธิ์',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'ปิด',
          });

          return false;
        }

        this.onSave();
        return false;
      })
    );
  }

  ngOnInit(): void {
    this.accessMenuList();
  }

  ngAfterViewInit(): void {
    this.yearChange();
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

  onUploadError(event): void {
    console.log(event);
  }

  onUploadSuccess(event): void {
    console.log(event);
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format("yyyy");
    this.month = moment(this.date).format("MM");
    this.dateOld = this.date;

    console.log(this.month, moment().format("MM"));
    console.log(this.year, moment().format("yyyy"));

    if (this.month != moment().format("MM") || this.year != moment().format("yyyy")) {
      this.isHideSaveBtn = false;
      // Swal.fire({
      //   title: "แจ้งเตือน",
      //   text: "จะไม่นำส่งไป Optimize",
      //   icon: "question",
      //   showConfirmButton: true,
      //   confirmButtonText: "ปิด",
      //   //timer: 1000
      // });
    } else {
      this.isHideSaveBtn = true;
    }

    this.yearChange();
    this.modalRef.hide();
  }

  getCellCssClass(date) {
    var cssClass = "";
    return cssClass;
  }

  onYearChange($event) {
    console.log("$event", $event);
    this.dateOld = this.date;
    this.date = moment($event.value);
    // this.year = moment($event.value).format('yyyy');
    // this.month = moment($event.value).format('MM');
    // this.yearChange();
  }

  async yearChange() {
    setTimeout(() => {
      this.dateDisplay = moment(this.date).format("MMM-yyyy");
    }, 100);

    const lastVersion: any = await this.TankCapService.getMonthMaxVersion(
      this.year,
      this.month
    );
    if (lastVersion.length === 0) {
      this.isNewMonthVersion = true;
    } else {
      this.isNewMonthVersion = false;
    }

    this.TankCapHistory.onYearChange(this.year, this.month, (dataInfo) => {
      this.dataInfo = dataInfo;
      this.version = this.dataInfo ? this.dataInfo.version : 0;
      this.maxVersion = this.dataInfo ? this.dataInfo.maxVersion : 0;
      this.defaultVersion = this.dataInfo
        ? this.dataInfo.isApply
        : this.defaultVersion;
      this.TankCapDataGrid.onYearChange(
        this.year,
        this.month,
        this.version,
        this.maxVersion,
        this.defaultVersion,
        false
      );
    });
  }

  onSave() {

    if (this.month != moment().format("MM") || this.year != moment().format("yyyy")) {
      return;
    }

    this.numberBoxReadOnly = true;
    let datasave = this.TankCapDataGrid.getDataSave();
    let monthVersion = this.month;
    let yearVersion = this.year;
    let validateValue = this.validateData(datasave);

    if (!validateValue) {
      Swal.fire({
        title: "บันทึกไม่สำเร็จ",
        html: this.messageValidate,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "ปิด",
        //timer: 1000
      });

      return;
    }

    // if (_.toInteger(this.year) > moment().year()) {
    //   monthVersion = 0;
    // } else if (_.toInteger(this.year) < moment().year()) {
    //   monthVersion = 13;
    // }

    let saveNewVersion = false;

    let versionName =
      "Tank Cap ปี " +
      yearVersion +
      " เดือน " +
      monthVersion +
      " rev " +
      this.version; //version ที่จะ save
    let versionNameNew =
      "Tank Cap ปี " + yearVersion + " เดือน " + monthVersion + " rev "; //version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = "";

    if (datasave.dataList && datasave.dataList.length > 0) {
      textConfirm = versionName + "<br/>";
    }

    this.saveData(
      datasave,
      textConfirm,
      versionName,
      saveNewVersion,
      versionNameNew,
      monthVersion
    );
  }

  onSaveAs() {
    this.numberBoxReadOnly = true;
    let datasave = this.TankCapDataGrid.getDataSave();
    let monthVersion = this.month;
    let yearVersion = this.year;

    let validateValue = this.validateData(datasave);

    if (!validateValue) {
      Swal.fire({
        title: "บันทึกไม่สำเร็จ",
        html: this.messageValidate,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "ปิด",
        //timer: 1000
      });

      return;
    }

    // if (_.toInteger(this.year) > moment().year()) {
    //   monthVersion = 0;
    // } else if (_.toInteger(this.year) < moment().year()) {
    //   monthVersion = 13;
    // }
    let versionNameNew =
      "Tank Cap ปี " + yearVersion + " เดือน " + monthVersion + " rev "; //version ใหม่กรณี save ครั้งแรก หรือแก้ไขจาก version 0
    let textConfirm = "";
    let saveNewVersion = true;

    if (this.isNewMonthVersion) {
      this.versionNew = 0;
      this.version = 0;
    } else {
      this.versionNew = this.maxVersion + 1;
    }

    versionNameNew += this.versionNew;
    textConfirm += versionNameNew + "<br/>";

    this.saveData(
      datasave,
      textConfirm,
      "",
      saveNewVersion,
      versionNameNew,
      monthVersion
    );

    // if (datasave.dataManual && datasave.dataManual.length > 0) {
    //   saveNewVersion = true;

    // }
    // else {
    //   Swal.fire({
    //     title: 'ไม่สามารถบันทึกได้',
    //     text: 'เนื่องจากไม่มีการแก้ไขข้อมูลแบบ Manual',
    //     icon: 'error',
    //     showConfirmButton: true,
    //     confirmButtonText: 'ปิด'
    //     //timer: 1000
    //   })
    // }
  }

  saveData(
    datasave,
    textConfirm,
    versionName,
    saveNewVersion,
    versionNameNew,
    monthVersion
  ) {
    Swal.fire({
      title: "<h3>คุณต้องการบันทึกหรือไม่</h3>",
      icon: "question",
      html: textConfirm,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("result", result);
        console.log("saveData -> datasave", datasave);
        this.loaderService.show();
        let dataVersionSave: any = [];
        let dataVersion: any = this.dataInfo;
        let dataVersionNew: any = {};

        if (_.toInteger(dataVersion.month) !== _.toInteger(monthVersion)) {
          dataVersion.id = undefined;
        }
        dataVersion.year = this.year;
        dataVersion.month = monthVersion;
        dataVersion.versionName = versionName;
        dataVersion.version = this.version;
        dataVersion.isApply = true;

        if (saveNewVersion === true) {
          _.each(datasave.dataList, (item) => {
            item.version =
              this.versionNew === 0 ? this.version : this.versionNew;
          });

          _.each(datasave.dataForm, (item) => {
            item.version =
              this.versionNew === 0 ? this.version : this.versionNew;
          });

          dataVersionNew.year = this.year;
          dataVersionNew.month = monthVersion;
          dataVersionNew.versionName = versionNameNew;
          dataVersionNew.version = this.versionNew;
          dataVersionNew.isApply = true;
          dataVersionNew.remark = dataVersion.remark;
          dataVersionSave.push(dataVersionNew);
          dataVersion.isApply = false;
        }

        if (versionName !== "") {
          dataVersionSave.push(dataVersion);
        }

        const observable: any[] = [];
        // observable.push(this.TankCapService.save(datasave.dataList));
        // observable.push(this.TankCapService.saveVersion(dataVersionSave));
        // observable.push(this.TankCapService.saveForm(datasave.dataForm));
        observable.push(
          this.TankCapService.create({
            Data: datasave.dataList,
            FormData: datasave.dataForm,
            VersionData: dataVersionSave,
          })
        );

        forkJoin(observable).subscribe(
          (res) => {
            this.yearChange();

            this.loaderService.hide();
            Swal.fire({
              title: "",
              text: "บันทึกสำเร็จ",
              icon: "success",
              showConfirmButton: false,
              // confirmButtonText: 'ปิด'
              timer: 1000,
            }).then((result) => {
              if (result) {
                if (this.month != moment().format("MM") || this.year != moment().format("yyyy")) {
                  Swal.fire({
                    title: "แจ้งเตือน",
                    text: "จะไม่นำส่งไป Optimize",
                    icon: "question",
                    showConfirmButton: true,
                    confirmButtonText: "ปิด",
                    //timer: 1000
                  });
                }
              }
            });
          },
          (error) => {
            Swal.fire({
              title: "บันทึกไม่สำเร็จ",
              text: error.message,
              icon: "error",
              showConfirmButton: true,
              confirmButtonText: "ปิด",
              //timer: 1000
            });
          }
        );
      } else {
        console.log("Cancel");
      }
    });
  }

  onDefaultVersionChange($event) {
    this.defaultVersion = $event;
    this.dataInfo.isApply = $event;
  }

  onHistoryClick($event) {
    console.log(this.month);
    this.tabSet.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;
    this.year = this.dataInfo ? this.dataInfo.year : 0;
    this.month = this.dataInfo ? this.dataInfo.month : 0;
    this.defaultVersion = this.dataInfo
      ? this.dataInfo.isApply
      : this.defaultVersion;
    this.TankCapDataGrid.onYearChange(
      $event.year,
      $event.month,
      $event.version,
      this.maxVersion,
      this.defaultVersion,
      true
    );
  }

  validateData(data: any) {
    let result: boolean = true;

    _.each(data.dataList, (item) => {
      if (item.value === 0 || !item.value) {
        result = false;

        this.messageValidate += `กรุณากรอกข้อมูล ${item.product} เดือน ${item.monthValue} ปี ${item.yearValue} </br>`;
      }
    });

    return result;
  }

  onSelect(data: TabDirective): void {
    if (data.heading === "Data") {
      this.activeTab = true;
    } else {
      this.activeTab = false;
    }
  }

  importExcelClick(event) {
    this.popupVisible = true;
  }

  remarkPopupClick(event) {
    this.dataInfoOld = _.cloneDeep(this.dataInfo);
    this.remarkPopupVisible = true;
  }

  onRemarkPopupSubmit() {
    this.remarkPopupVisible = false;
  }

  onRemarkPopupCancel() {
    this.dataInfo = _.clone(this.dataInfoOld);
    this.remarkPopupVisible = false;
  }
}
