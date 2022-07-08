import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { CostsService } from './../../service/costs.service';
import { ExcelsService } from './../../service/excels.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { forkJoin, Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/service/auth.service';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { OptimizationVersionComponent } from './component/optimization-version/optimization-version.component';
import { OptimizationDataGridC2Component } from './component/optimization-data-grid-c2/optimization-data-grid-c2.component';
import { AbilityPlanRayongService } from '../../service/ability-plan-rayong.service';
import { AbilityPlanKhmService } from '../../service/ability-plan-khm.service';
import { AbilityRefineryService } from '../../service/ability-refinery.service';
import { AbilityPentaneService } from '../../service/ability-pentane.service';
import { CalMarginService } from '../../service/cal-margin.service';
import { DepotManagementMeterService } from '../../service/depot-management.service';
import { TankCapService } from '../../service/tankcap.service';
import { VolumeConstrainService } from '../../service/volume-constrain.service';
import { LRByLegalService } from '../../service/lr-by-legal.service';
import { OptimizationsService } from 'src/app/service/optimizations.service';
import { OptimizationDataGridC3lpgComponent } from './component/optimization-data-grid-c3lpg/optimization-data-grid-c3lpg.component';
import { OptimizationDataGridNglComponent } from './component/optimization-data-grid-ngl/optimization-data-grid-ngl.component';
import { OptimizationDataGridCo2Component } from './component/optimization-data-grid-co2/optimization-data-grid-co2.component';
import { OptimizationDataGridPantaneComponent } from './component/optimization-data-grid-pantane/optimization-data-grid-pantane.component';
import { OptimizationDataGridLrMonthlyComponent } from './component/optimization-data-grid-lr-monthly/optimization-data-grid-lr-monthly.component';
import { debounceTime } from 'rxjs/operators';
import { MasterUnitService } from '../../service/master-unit.service';
import { MasterContractService } from '../../service/master-contract.service';
import { OptimizationDataGridVolumnComponent } from './component/optimization-data-grid-volumn/optimization-data-grid-volumn.component';

@Component({
  selector: 'app-optimization-result-list',
  templateUrl: './optimization-result-list.component.html',
  styleUrls: ['./optimization-result-list.component.css']
})
export class OptimizationResultListComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };
  numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  form: FormGroup;
  isOpen: any = true;
  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild('optimizationVersion', { static: false }) optimizationVersion: OptimizationVersionComponent;
  @ViewChild('optimizationDataGridC2', { static: false }) optimizationDataGridC2: OptimizationDataGridC2Component;
  @ViewChild('optimizationDataGridC3LPG', { static: false }) optimizationDataGridC3LPG: OptimizationDataGridC3lpgComponent;
  @ViewChild('optimizationDataGridNGL', { static: false }) optimizationDataGridNGL: OptimizationDataGridNglComponent;
  // @ViewChild('optimizationDataGridCo2', { static: false }) optimizationDataGridCo2: OptimizationDataGridCo2Component;
  // @ViewChild('optimizationDataGridPantane', { static: false }) optimizationDataGridPantane: OptimizationDataGridPantaneComponent;
  @ViewChild('optimizationDataGridLrMonthly', { static: false }) optimizationDataGridLrMonthly: OptimizationDataGridLrMonthlyComponent;
  @ViewChild('optimizationDataGridVolumn', { static: false }) optimizationDataGridVolumn: OptimizationDataGridVolumnComponent;
  @ViewChild('tabSet') tabSet: TabsetComponent;
  @ViewChild('tabSetProduct') tabSetProduct: TabsetComponent;
  @ViewChild('abilityPlanRayongSelectBox', { static: false }) abilityPlanRayongSelectBox: DxSelectBoxComponent;
  @ViewChild('abilityPlanRayongOldSelectBox', { static: false }) abilityPlanRayongOldSelectBox: DxSelectBoxComponent;

  //costHistory
  sidebar: ISidebar;
  subscription: Subscription;
  dataList: any = [];
  listMonth: any = [];
  revisionMonth: any = [];
  isCollapsedAnimated = false;

  masterData: any = {};
  year: any = 2021;
  month: any = 0;
  monthSave: any = 0;
  version: any = 0;
  versionSave: any = 0;
  versionSaveNew: any = 0;
  versionNew: any = 0;
  versionName: any = ' ';
  versionNameNew: any = ' ';
  date: any;
  dateOld: any;
  dataInfo: any = {};
  dataSaveC2: any = {};
  dataSaveC3LPG: any = {};
  dataSaveNGL: any = {};
  dataSaveCO2: any = {};
  dataSavePantane: any = {};
  dataSaveVolumn: any = {};
  dataSaveLrMonthly: any = {};
  dataVersion: any = {};
  isTabDataAction = true;
  isTabHistoryAction = false;

  maxVersion: any = 0;
  dataFileUpload: any = [];
  apiUrlService = '';
  urlWeb = '';
  popupVisible = false;
  popupFull = true;
  accessMenu: any;

  dataInfoOld: any = {};
  remarkPopupVisible = false;
  isSave = true;
  numberBoxDigi = 0;
  dateDisplay: string;

  isShowFilterBlock = true;
  dataMaster: any = [];
  isWithOutDemandAI: boolean = false;

  formatMonthName = 'MMM-yyyy';
  subject: Subject<any> = new Subject();
  dynamicColumnProductions: any[] = [];
  dynamicColumnProductionUnits: any[] = [];
  dynamicColumnProductionUnitSources: any[] = [];
  dynamicColumnsSupply: any[] = [];
  dynamicColumnsDemand: any[] = [];
  dynamicColumnsCustomerDemand: any[] = [];
  dynamicColumnsVolumns: any[] = [];

  isViewC2 = true;
  isViewLR = true;
  isViewC3LPG = true;
  isViewNGL = true;
  isViewCo2 = true;
  isViewPantane = true;
  constructor(
    private hotkeysService: HotkeysService,
    private router: Router,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private costsService: CostsService,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private abilityPlanRayongService: AbilityPlanRayongService,
    private abilityPlanKhmService: AbilityPlanKhmService,
    private abilityRefineryService: AbilityRefineryService,
    private abilityPentaneService: AbilityPentaneService,
    private depotManagementMeterService: DepotManagementMeterService,
    private lRByLegalService: LRByLegalService,
    private volumeConstrainService: VolumeConstrainService,
    private tankCapService: TankCapService,
    private calMarginService: CalMarginService,
    private unitService: MasterUnitService,
    private masterContractService: MasterContractService,
    private optimizationsService: OptimizationsService
  ) {
    this.date = moment();
    this.dateOld = this.date;
    this.year = moment().year();
    this.month = moment().month() + 1;
    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        this.onSave();
        return false;
      })
    );

    this.hotkeysService.add(
      new Hotkey('ctrl+shift+s', (event: KeyboardEvent): boolean => {
        this.onSaveAs();
        return false;
      })
    );
  }

  ngOnInit(): void {
    this.apiUrlService = environment.apiUrlService;
    this.urlWeb = environment.urlWab;
    // let data = 'az AZ 01 กฮ ไอ้ # -_()[]{}';
    // console.log('data Rep', data.replace(/[^a-z^0-9^ก-๙]/gi,''));
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.accessMenuList();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    // this.loaderService.show();
    setTimeout(() => {
      this.yearChange();
    }, 100);
  }
  registerEvent() {
    this.unregisterEvent();
    setTimeout(() => {
      if (this.abilityPlanRayongSelectBox && this.abilityPlanRayongSelectBox.instance) {
        this.abilityPlanRayongSelectBox.instance.option('onValueChanged', this.onAbilityPlanRayongValueChanged);
      }
      if (this.abilityPlanRayongOldSelectBox && this.abilityPlanRayongOldSelectBox.instance) {
        this.abilityPlanRayongOldSelectBox.instance.option('onValueChanged', this.onAbilityPlanRayongOldValueChanged);
      }
      //
    }, 200);
  }

  unregisterEvent() {
    if (this.abilityPlanRayongSelectBox && this.abilityPlanRayongSelectBox.instance) {
      this.abilityPlanRayongSelectBox.instance.option('onValueChanged', null);
    }
    if (this.abilityPlanRayongOldSelectBox && this.abilityPlanRayongOldSelectBox.instance) {
      this.abilityPlanRayongOldSelectBox.instance.option('onValueChanged', null);
    }
  }
  menuButtonClick = (
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string
  ) => {
    console.log('ee', e);
    if (e) {
      e.stopPropagation();
    }

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems
    );
  }

  accessMenuList() {
    // 1 : Add,Edit, 2 : View Only
    this.authService.menuAll$.subscribe(res => {
      if (res && res.currentMenu) {
        this.accessMenu = res.currentMenu.actionMenu;
      }
    });
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getCellCssClass(date) {
    var cssClass = '';

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
    if (this.accessMenu == 1) {

      if (this.dataInfo.isWithOutDemandAI) {
        const withOutDemandAIVersion = this.optimizationVersion.getVersionAI();
        if (!withOutDemandAIVersion) {
          this.versionSave = 1;
          this.versionName = 'Optimization (AI) ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
        else {
          this.versionSave = withOutDemandAIVersion;
          this.versionName = 'Optimization (AI) ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
      }
      else {
        const versionNarmal = this.optimizationVersion.getVersionNarmal();
        if (!versionNarmal) {
          this.versionSave = 1;
          this.versionName = 'Optimization ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
        else {
          this.versionSave = versionNarmal;
          this.versionName = 'Optimization ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
      }

      this.getDataSaveAll(false, this.dataInfo.isWithOutDemandAI, this.versionSave);

      this.dataSaveC2.optimizationVersion = {
        year: _.toNumber(this.year),
        month: _.toNumber(this.month),
        version: this.versionSave,
        versionName: this.versionName,
        abilityPlanRayongId: this.dataInfo.abilityPlanRayongId || null,
        abilityPlanRayongOldId: this.dataInfo.abilityPlanRayongOldId || null,
        abilityPentaneId: this.dataInfo.abilityPentaneId || null,
        abilityPlanKhmId: this.dataInfo.abilityPlanKhmId || null,
        abilityRefineryId: this.dataInfo.abilityRefineryId || null,
        calMarginId: this.dataInfo.calMarginId || null,
        tankCapId: this.dataInfo.tankCapId || null,
        lRbyLegalId: this.dataInfo.lRbyLegalId || null,
        depotConstrainId: this.dataInfo.depotConstrainId || null,
        volumeConstrainId: this.dataInfo.volumeConstrainId || null,
        isWithOutDemandAI: this.dataInfo.isWithOutDemandAI,
        jsonToModel: this.dataInfo.jsonToModel,
        jsonFormModel: this.dataInfo.jsonFormModel
      }

      console.log("data save <> ", this.dataSaveC2);
      this.saveData();

    } else {
      Swal.fire({
        title: 'Access Denied',
        text: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจาก ไม่มีสิทธิ์',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        //timer: 1000
      });
    }
  }

  onSaveAs() {
    if (this.accessMenu == 1) {

      if (this.dataInfo.isWithOutDemandAI) {
        const withOutDemandAIVersion = this.optimizationVersion.getVersionAI();
        console.log("withOutDemandAIVersion>> ", withOutDemandAIVersion);
        if (!withOutDemandAIVersion) {
          this.versionSave = 1;
          this.versionName = 'Optimization (AI) ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
        else {
          this.versionSave = (withOutDemandAIVersion + 1);
          this.versionName = 'Optimization (AI) ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
      }
      else {
        const versionNarmal = this.optimizationVersion.getVersionNarmal();
        if (!versionNarmal) {
          this.versionSave = 1;
          this.versionName = 'Optimization ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
        else {
          this.versionSave = (versionNarmal + 1);
          this.versionName = 'Optimization ปี ' + this.year + ' เดือน ' + this.month + ' Rev ' + (this.versionSave - 1);
        }
      }

      this.getDataSaveAll(true, this.dataInfo.isWithOutDemandAI, this.versionSave);

      this.dataSaveC2.optimizationVersion = {
        year: _.toNumber(this.year),
        month: _.toNumber(this.month),
        version: this.versionSave,
        versionName: this.versionName,
        abilityPlanRayongId: this.dataInfo.abilityPlanRayongId || null,
        abilityPlanRayongOldId: this.dataInfo.abilityPlanRayongOldId || null,
        abilityPentaneId: this.dataInfo.abilityPentaneId || null,
        abilityPlanKhmId: this.dataInfo.abilityPlanKhmId || null,
        abilityRefineryId: this.dataInfo.abilityRefineryId || null,
        calMarginId: this.dataInfo.calMarginId || null,
        tankCapId: this.dataInfo.tankCapId || null,
        lRbyLegalId: this.dataInfo.lRbyLegalId || null,
        depotConstrainId: this.dataInfo.depotConstrainId || null,
        volumeConstrainId: this.dataInfo.volumeConstrainId || null,
        isWithOutDemandAI: this.dataInfo.isWithOutDemandAI
      }

      console.log("data save as <> ", this.dataSaveC2);
      this.saveData();

    } else {
      Swal.fire({
        title: 'Access Denied',
        text: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจาก ไม่มีสิทธิ์',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
        //timer: 1000
      });
    }
  }

  getDataSaveAll(isSaveAs: boolean, isWithOutDemandAI?: boolean, versionSave?: number) {

    this.dataSaveC2 = this.optimizationDataGridC2.getDataSave(isSaveAs, isWithOutDemandAI, versionSave);
    this.dataSaveC3LPG = this.optimizationDataGridC3LPG.getDataSave(isSaveAs, isWithOutDemandAI, versionSave);
    this.dataSaveNGL = this.optimizationDataGridNGL.getDataSave(isSaveAs, isWithOutDemandAI, versionSave);
    // this.dataSaveCO2 = this.optimizationDataGridCo2.getDataSave(isSaveAs, isWithOutDemandAI, versionSave);
    // this.dataSavePantane = this.optimizationDataGridPantane.getDataSave(isSaveAs, isWithOutDemandAI, versionSave);
    this.dataSaveLrMonthly = this.optimizationDataGridLrMonthly.getDataSave(isSaveAs, isWithOutDemandAI, versionSave);
    this.dataSaveVolumn = this.optimizationDataGridVolumn.getDataSave(isSaveAs, isWithOutDemandAI, versionSave);
    this.monthSave = this.month;
  }

  saveDataLast(isSaveAs) {
    // กรณีบันทึกข้อมูลย้อนหลังเช่นปัจจุบันอยู่ที่ 2022 แต่ๆไปบันทึกข้อมูล 2021
    // column month = 13 เสมอ ส่วน version จะบวกไปเรื่อย
    this.monthSave = 13;
    this.versionName = 'Cost ปี ' + this.year + ' Back version Rev 0';
    this.versionSave = this.version;

    if (this.checkDataManual() === true) {
      if (isSaveAs === true) {
        this.getMaxVerionSave();
      } else {
        this.versionSaveNew = 1;
      }
      this.versionNameNew = 'Cost ปี ' + this.year + ' Back version Rev ' + (this.versionSaveNew);
    }
  }

  saveDataFuture(isSaveAs) {
    // กรณีบันทึกข้อมูลล่วงหน้าเช่นปัจจุบันอยู่ที่ 2022 แต่ๆไปบันทึกข้อมูล 2023
    // column month = 0 เสมอ ส่วน version จะบวกไปเรื่อย
    this.monthSave = 0;
    // this.versionName = 'Cost ปี ' + this.year + ' Draft version Rev 0';
    this.versionName = 'Cost ปี ' + this.year + ' เดือน ' + this.month + ' Rev 0';
    this.versionSave = this.version;

    if (this.checkDataManual() === true) {
      if (isSaveAs === true) {
        this.getMaxVerionSave();
      } else {
        this.versionSaveNew = 1;
      }
      // this.versionNameNew = 'Cost ปี ' + this.year + ' Draft version Rev ' + (this.versionSaveNew);
      this.versionName = 'Cost ปี ' + this.year + ' เดือน ' + this.month + ' Rev' + (this.versionSaveNew);
    }

  }

  saveDataNow(isSaveAs) {
    // กรณีบันทึกข้อมูลล่วงหน้าเช่นปัจจุบันอยู่ที่ 2022 แต่ๆไปบันทึกข้อมูล 2023
    // column month = 0 เสมอ ส่วน version จะบวกไปเรื่อย
    this.monthSave = this.month;
    this.versionName = 'Cost ปี ' + this.year + ' เดือน ' + this.monthSave + ' Rev 0';
    this.versionSave = this.version;
    if (this.checkDataManual() === true) {
      if (isSaveAs === true) {
        this.getMaxVerionSave();
      } else {
        this.versionSaveNew = (this.version === 0 ? 1 : this.version);
      }

      this.versionNameNew = 'Cost ปี ' + this.year + ' เดือน ' + this.monthSave + ' Rev ' + (this.versionSaveNew);
    }

  }
  getMaxVerionSave() {
    const dataMaxVersion = _.filter(this.dataVersion, (item) => {
      return item.month === _.toNumber(this.monthSave);
    });

    if (dataMaxVersion.length > 0) {
      this.versionSaveNew = _.max(_.map(dataMaxVersion, 'version'));
      this.versionSaveNew += 1;
    } else {
      this.versionSaveNew = 1;
    }
  }

  checkDataManual() {
    if (this.dataSaveC2.dataManual && this.dataSaveC2.dataManual.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  saveData() {
    let textConfirmSave = this.versionName;
    if (this.checkDataManual() === true) {
      textConfirmSave += '<br/>' + this.versionNameNew;
    }

    Swal.fire({
      title: '<h3>คุณต้องการบันทึกหรือไม่</h3>',
      icon: 'question',
      html: textConfirmSave,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {

        this.loaderService.show();
        const observable: any[] = [];
        let dataSaveAll = {
          ...this.dataSaveC2,
          ...this.dataSaveC3LPG,
          ...this.dataSaveNGL,
          ...this.dataSaveCO2,
          ...this.dataSavePantane,
          ...this.dataSaveLrMonthly,
          ...this.dataSaveVolumn
        }

        console.log("dataSaveAll >> ", dataSaveAll);
        observable.push(this.optimizationsService.saveAll(dataSaveAll));

        forkJoin(observable).subscribe(
          (res) => {
            Swal.fire({
              title: '',
              text: 'บันทึกสำเร็จ',
              icon: 'success',
              showConfirmButton: false,
              // confirmButtonText: 'ปิด'
              timer: 1000,
            });

            this.yearChange();
            this.tabSetProduct.tabs[0].active = true;
            this.loaderService.hide();

          },
          (error) => {
            Swal.fire({
              title: 'บันทึกไม่สำเร็จ',
              text: error.message,
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'ปิด',
              //timer: 1000
            });
          }
        );
      } else {
        console.log('Cancel');
      }
    });
  }

  setColumn() {
    const columnProduction = {
      dataField: 'production',
      code: 'production',
      caption: 'Production',
      fixed: true,
      fixedPosition: 'left',
      width: '250'
    };

    const columnUnit = {
      dataField: 'unit',
      code: 'unit',
      caption: 'Unit',
      fixed: true,
      fixedPosition: 'left',
      width: '100',
      alignment: 'center'
    };

    const columnsSource = {
      dataField: 'source',
      code: 'source',
      caption: 'Source',
      fixed: true,
      fixedPosition: 'left',
      width: '120',
    };

    const columnsDemand = {
      dataField: 'demand',
      code: 'demand',
      caption: 'Demand',
      fixed: true,
      fixedPosition: 'left',
      width: '120',
    };

    const columnsDliveryPoint = {
      dataField: 'deliveryPoint',
      code: 'deliveryPoint',
      caption: 'Delivery Point',
      fixed: true,
      fixedPosition: 'left',
      width: '120',
    };
    const columnsCustomerType = {
      dataField: 'customerType',
      code: 'customerType',
      caption: 'Customer Type',
      fixed: true,
      fixedPosition: 'left',
      width: '150',
    };
    const columnsProductName = {
      dataField: 'productName',
      code: 'product',
      caption: 'Product',
      // groupIndex: 0,
      // width: 180,
      fixed: true,
      fixedPosition: 'left'
    };
    const columnsUnitName = {
      dataField: 'unitName',
      code: 'unit',
      caption: 'Unit',
      fixed: true,
      fixedPosition: 'left',
      alignment: 'center'
    };
    const columnsSourceName = {
      dataField: 'sourceName',
      code: 'sourceName',
      caption: 'Source',
      fixed: true,
      fixedPosition: 'left',
      width: '180',
      alignment: 'center'
    };
    const columnsDemandName = {
      dataField: 'demandName',
      code: 'demandName',
      caption: 'Demand',
      fixed: true,
      fixedPosition: 'left',
      width: '180',
      alignment: 'center'
    };
    const columnsDeliveryName = {
      dataField: 'deliveryName',
      code: 'deliveryName',
      caption: 'Delivery Point',
      fixed: true,
      fixedPosition: 'left',
      width: '180',
      alignment: 'center'
    };


    this.dynamicColumnProductionUnits = [];
    this.dynamicColumnProductions = [];
    this.dynamicColumnsDemand = [];
    this.dynamicColumnProductionUnitSources = [];
    this.dynamicColumnsSupply = [];
    this.dynamicColumnsCustomerDemand = [];
    this.dynamicColumnsVolumns = [];
    this.dynamicColumnProductions.push(columnProduction);
    this.dynamicColumnProductionUnits.push(columnProduction);
    this.dynamicColumnProductionUnits.push(columnUnit);
    this.dynamicColumnsDemand.push(columnsSource);
    this.dynamicColumnsDemand.push(columnsDemand);
    this.dynamicColumnsDemand.push(columnsDliveryPoint);
    this.dynamicColumnProductionUnitSources.push(columnProduction);
    this.dynamicColumnProductionUnitSources.push(columnUnit);
    this.dynamicColumnProductionUnitSources.push(columnsSource);
    this.dynamicColumnsSupply.push(columnsSource);
    this.dynamicColumnsCustomerDemand.push(columnsCustomerType);
    this.dynamicColumnsCustomerDemand.push(columnsSource);
    this.dynamicColumnsCustomerDemand.push(columnsDemand);
    this.dynamicColumnsCustomerDemand.push(columnsDliveryPoint);
    this.dynamicColumnsVolumns.push(columnsProductName);
    this.dynamicColumnsVolumns.push(columnsUnitName);
    this.dynamicColumnsVolumns.push(columnsSourceName);
    this.dynamicColumnsVolumns.push(columnsDemandName);
    this.dynamicColumnsVolumns.push(columnsDeliveryName);


    const columnMonth: any = [];
    _.each(this.listMonth, (item, index) => {
      columnMonth.push({
        dataField: 'M' + item.Month + item.Year,
        name: 'M' + item.Month + item.Year,
        code: index,
        caption: item.MonthName,
        dataType: 'number',
        cellTemplate: 'cellTemplate',
        month: item.Month,
        year: item.Year
      });

      this.revisionMonth['listRevision' + 'M' + item.Month + item.Year] = [];
    })
    this.dynamicColumnProductionUnits = _.concat(this.dynamicColumnProductionUnits, _.cloneDeep(columnMonth));
    this.dynamicColumnProductions = _.concat(this.dynamicColumnProductions, _.cloneDeep(columnMonth));
    this.dynamicColumnsDemand = _.concat(this.dynamicColumnsDemand, _.cloneDeep(columnMonth));
    this.dynamicColumnProductionUnitSources = _.concat(this.dynamicColumnProductionUnitSources, _.cloneDeep(columnMonth));
    this.dynamicColumnsSupply = _.concat(this.dynamicColumnsSupply, _.cloneDeep(columnMonth));
    this.dynamicColumnsCustomerDemand = _.concat(this.dynamicColumnsCustomerDemand, _.cloneDeep(columnMonth));
    this.dynamicColumnsVolumns = _.concat(this.dynamicColumnsVolumns, _.cloneDeep(columnMonth));
  }
  yearChange() {
    this.loaderService.show();
    this.versionSave = 0;
    this.versionSaveNew = 0;
    this.listMonth = [];
    this.dateDisplay = moment(this.date).format('MMM-yyyy');
    this.year = moment(this.date).year();
    this.month = moment(this.date).month() + 1;
    let dateStart = moment(this.year + '-' + this.month + '-01');
    dateStart = moment(dateStart).add(1, 'M');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index < 13; index++) {
      const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: dateStart.format(this.formatMonthName), visible: true }
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }
    this.setColumn();
    this.optimizationVersion.onYearChange(this.year, this.month, (dataInfo) => {
      this.dataInfo = dataInfo;
      this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      this.maxVersion = this.dataInfo.maxVersion ? this.dataInfo.maxVersion : 0;
      this.versionName = this.dataInfo.versionName;
      this.isWithOutDemandAI = this.dataInfo.isWithOutDemandAI || false;

      this.retrieveMasterData().subscribe(res => {
        this.dataMaster.masterAbilityPlanRayong = res[0];
        this.dataMaster.masterAbilityPlanKhm = res[1];
        this.dataMaster.masterAbilityRefinery = res[2];
        this.dataMaster.masterAbilityPentane = res[3];
        this.dataMaster.masterCalMargin = res[4];
        this.dataMaster.masterDepotManagement = res[5];
        this.dataMaster.masterLRByLegal = res[6];
        this.dataMaster.masterVolumeConstrain = res[7];
        this.dataMaster.masterTankCap = res[8];
        this.dataMaster.masterContract = res[9];
        this.dataMaster.masterUnit = res[10];
        this.dataMaster.optimizationDataPantane = res[11];
        this.dataMaster.optimizationRevisionDataPantane = res[12];
        this.dataMaster.optimizationDataNgl = res[13];
        this.dataMaster.optimizationRevisionDataNgl = res[14];
        this.dataMaster.optimizationDataLrMonthly = res[15];
        this.dataMaster.optimizationDataCo2 = res[16];
        this.dataMaster.optimizationRevisionDataCo2 = res[17];
        this.dataMaster.optimizationDataC3Lpg = res[18];
        this.dataMaster.optimizationRevisionDataC3Lpg = res[19];
        this.dataMaster.optimizationDataC2 = res[20];
        this.dataMaster.optimizationRevisionDataC2 = res[21];
        this.dataMaster.optimizationVolumn = res[22];
        this.calDataToDataGrid(() => {
          setTimeout(() => {
            let data: any = null;
            let isCallEvent = false;
            if (!this.dataInfo.abilityPlanRayongId) {
              isCallEvent = true;
              data = _.find(this.dataMaster.masterAbilityPlanRayong, 'id', 0);
              if (data)
                this.dataInfo.abilityPlanRayongId = data.id;
            }

            if (!this.dataInfo.abilityPlanRayongOldId) {
              data = _.find(this.dataMaster.masterAbilityPlanRayong, 'id', 1);
              if (data)
                this.dataInfo.abilityPlanRayongOldId = data.id;
            }

            if (!this.dataInfo.abilityPlanKhmId) {
              data = _.find(this.dataMaster.masterAbilityPlanKhm, 'id', 0);
              if (data)
                this.dataInfo.abilityPlanKhmId = data.id;
            }
            if (!this.dataInfo.abilityRefineryId) {
              data = _.find(this.dataMaster.masterAbilityRefinery, 'id', 0);
              if (data)
                this.dataInfo.abilityRefineryId = data.id;
            }
            if (!this.dataInfo.abilityPentaneId) {
              data = _.find(this.dataMaster.masterAbilityPentane, 'id', 0);
              if (data)
                this.dataInfo.abilityPentaneId = data.id;
            }
            if (!this.dataInfo.calMarginId) {
              data = _.find(this.dataMaster.masterCalMargin, 'id', 0);
              if (data)
                this.dataInfo.calMarginId = data.id;
            }
            if (!this.dataInfo.depotConstrainId) {
              data = _.find(this.dataMaster.masterDepotManagement, 'id', 0);
              if (data)
                this.dataInfo.depotConstrainId = data.id;
            }
            if (!this.dataInfo.lRbyLegalId) {
              data = _.find(this.dataMaster.masterLRByLegal, 'id', 0);
              if (data)
                this.dataInfo.lRbyLegalId = data.id;
            }
            if (!this.dataInfo.volumeConstrainId) {
              data = _.find(this.dataMaster.masterVolumeConstrain, 'id', 0);
              if (data)
                this.dataInfo.volumeConstrainId = data.id;
            }
            if (!this.dataInfo.tankCapId) {
              data = _.find(this.dataMaster.masterTankCap, 'id', 0);
              if (data)
                this.dataInfo.tankCapId = data.id;
            }
            if (isCallEvent) {
              this.onAbilityPlanRayongValueChanged(null);

            } else {

              this.loaderService.hide();
            }
            this.registerEvent();
          }, 100);
        })

      })


    });
  }

  calDataToDataGrid = (callBack) => {

    this.gridOnYearChange().subscribe(() => {
      callBack();
    })
  }
  gridOnYearChange(): Observable<any> {
    // const sellingPrice = this.calMarginService.getList(this.month, this.year, this.version, conditionHeader.costProductTypeId, conditionHeader.costVersionId, conditionHeader.referencePriceVersionId);
    const optimizationDataGridC2 = this.optimizationDataGridC2.onYearChange(this.year, this.month, this.version, this.maxVersion, this.isWithOutDemandAI, this.listMonth, this.dynamicColumnProductionUnits, this.revisionMonth, this.dataMaster.optimizationDataC2, this.dataMaster.optimizationRevisionDataC2, this.dataMaster.masterUnit);
    const optimizationDataGridC3LPG = this.optimizationDataGridC3LPG.onYearChange(this.year, this.month, this.version, this.maxVersion, this.isWithOutDemandAI, this.listMonth, this.dynamicColumnProductionUnits, this.revisionMonth, this.dataMaster.optimizationDataC3Lpg, this.dataMaster.optimizationRevisionDataC3Lpg, this.dataMaster.masterUnit, this.dataMaster.masterContract, this.dynamicColumnsSupply, this.dynamicColumnsCustomerDemand, this.dynamicColumnsDemand);

    const optimizationDataGridNGL = this.optimizationDataGridNGL.onYearChange(this.year, this.month, this.version, this.maxVersion, this.isWithOutDemandAI, this.listMonth, this.dynamicColumnProductionUnits, this.revisionMonth, this.dataMaster.optimizationDataNgl, this.dataMaster.optimizationRevisionDataNgl, this.dataMaster.masterUnit);
    // const optimizationDataGridCo2 = this.optimizationDataGridCo2.onYearChange(this.year, this.month, this.version, this.maxVersion, this.isWithOutDemandAI, this.listMonth, this.dynamicColumnProductions, this.revisionMonth, this.dataMaster.optimizationDataCo2, this.dataMaster.optimizationRevisionDataCo2, this.dataMaster.masterUnit, this.dynamicColumnsDemand);
    // const optimizationDataGridPantane = this.optimizationDataGridPantane.onYearChange(this.year, this.month, this.version, this.maxVersion, this.isWithOutDemandAI, this.listMonth, this.dynamicColumnProductionUnits, this.revisionMonth, this.dataMaster.optimizationDataPantane, this.dataMaster.optimizationRevisionDataPantane, this.dataMaster.masterUnit, this.dynamicColumnsDemand);
    const optimizationDataGridLrMonthly = this.optimizationDataGridLrMonthly.onYearChange(this.year, this.month, this.version, this.maxVersion, this.isWithOutDemandAI, this.listMonth, this.dynamicColumnProductionUnits, this.revisionMonth, this.dataMaster.optimizationDataLrMonthly, null, this.dataMaster.masterUnit, this.dataMaster.masterContract);

    const optimizationDataGridVolumn = this.optimizationDataGridVolumn.onYearChange(this.year, this.month, this.version, this.maxVersion, this.isWithOutDemandAI, this.listMonth, this.dynamicColumnsVolumns, this.revisionMonth, this.dataMaster.optimizationVolumn, null, this.dataMaster.masterUnit, this.dataMaster.masterContract);
    return forkJoin([[optimizationDataGridC2], [optimizationDataGridC3LPG], [optimizationDataGridNGL]
      //, [optimizationDataGridCo2], [optimizationDataGridPantane]
      , [optimizationDataGridLrMonthly], [optimizationDataGridVolumn]]);
  }

  onHistoryClick($event) {

    this.loaderService.show();

    this.tabSet.tabs[0].active = true;
    this.tabSetProduct.tabs[0].active = true;
    this.dataInfo = $event;
    this.version = this.dataInfo.version ? this.dataInfo.version : 0;

    this.month = this.dataInfo.month;
    this.isWithOutDemandAI = this.dataInfo.isWithOutDemandAI;
    this.date = moment(this.dataInfo.year + '-' + this.dataInfo.month + '-01');
    this.dateDisplay = moment(this.date).format('MMM-yyyy');
    this.retrieveMasterData().subscribe(res => {
      this.dataMaster.masterAbilityPlanRayong = res[0];
      this.dataMaster.masterAbilityPlanKhm = res[1];
      this.dataMaster.masterAbilityRefinery = res[2];
      this.dataMaster.masterAbilityPentane = res[3];
      this.dataMaster.masterCalMargin = res[4];
      this.dataMaster.masterDepotManagement = res[5];
      this.dataMaster.masterLRByLegal = res[6];
      this.dataMaster.masterVolumeConstrain = res[7];
      this.dataMaster.masterTankCap = res[8];
      this.dataMaster.masterContract = res[9];
      this.dataMaster.masterUnit = res[10];
      this.dataMaster.optimizationDataPantane = res[11];
      this.dataMaster.optimizationRevisionDataPantane = res[12];
      this.dataMaster.optimizationDataNgl = res[13];
      this.dataMaster.optimizationRevisionDataNgl = res[14];
      this.dataMaster.optimizationDataLrMonthly = res[15];
      this.dataMaster.optimizationDataCo2 = res[16];
      this.dataMaster.optimizationRevisionDataCo2 = res[17];
      this.dataMaster.optimizationDataC3Lpg = res[18];
      this.dataMaster.optimizationRevisionDataC3Lpg = res[19];
      this.dataMaster.optimizationDataC2 = res[20];
      this.dataMaster.optimizationRevisionDataC2 = res[21];
      this.dataMaster.optimizationVolumn = res[22];
      this.calDataToDataGrid(() => {
        setTimeout(() => {
          this.loaderService.hide();
        }, 100);
      })

    })
  }

  onEventImport($event) {
    let importYear = 2022//moment(this.costImportExcel.date).year();
    // console.log("importYear :: ", importYear);
    if (_.toNumber(this.year) == _.toNumber(importYear)) {
      this.tabSet.tabs[0].active = true;
      //  this.costDataGrid.setData($event);
      this.popupVisible = false;

      setTimeout(() => {
        this.loaderService.hide();
      }, 500);

      Swal.fire({
        title: '',
        text: 'Import Excel สำเร็จ',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
      });
    } else {
      this.year = importYear;
      // this.optimizationVersion.onYearChange(this.year, this.month, (dataInfo) => {
      //   this.dataInfo = dataInfo;
      //   this.version = this.dataInfo.version ? this.dataInfo.version : 0;
      //   this.maxVersion = this.dataInfo.maxVersion
      //     ? this.dataInfo.maxVersion
      //     : 0;
      //   this.versionName = this.dataInfo.versionName;
      //   this.costDataGrid.onYearChange(
      //     this.year,
      //     this.month,
      //     this.version,
      //     this.maxVersion,
      //     $event,
      //     (res) => {
      //       this.tabSet.tabs[0].active = true;
      //       this.popupVisible = false;

      //       setTimeout(() => {
      //         this.loaderService.hide();
      //       }, 500);

      //       Swal.fire({
      //         title: '',
      //         html: 'Import Excel สำเร็จ',
      //         icon: 'success',
      //         showConfirmButton: true,
      //         confirmButtonText: 'ปิด',
      //       });
      //     }
      //   );
      // });
    }
  }

  importExcelClick(event) {
    this.popupVisible = true;
  }

  remarkPopupClick(event) {
    this.dataInfoOld = _.cloneDeep(this.dataInfo);
    this.remarkPopupVisible = true;
  }

  fullClick = () => {
    this.popupFull = !this.popupFull;
  };

  onRemarkPopupSubmit() {
    this.remarkPopupVisible = false;
  }

  onRemarkPopupCancel() {
    this.dataInfo = _.clone(this.dataInfoOld);
    this.remarkPopupVisible = false;
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).year();

    this.dateOld = this.date;
    this.yearChange();
    this.modalRef.hide();
  }
  searchCancelClick() {
    // this.date = this.dateOld;
    this.modalRef.hide();
  }
  retrieveMasterData(): Observable<any> {

    const masterAbilityPlanRayong = this.abilityPlanRayongService.getVersionByYear(this.year);
    const masterAbilityPlanKhmService = this.abilityPlanKhmService.getVersionByYear(this.year);
    const masterAbilityRefineryService = this.abilityRefineryService.getVersionByYear(this.year);
    const masterAbilityPentaneService = this.abilityPentaneService.getVersionByYear(this.year);
    const masterCalMarginService = this.calMarginService.getVersionByYear(this.year);
    const masterDepotManagement = this.depotManagementMeterService.getVersionByYear(this.year);
    const masterLRByLegal = this.lRByLegalService.getVersionByYear(this.year);
    const masterVolumeConstrain = this.volumeConstrainService.getVersionByYear(this.year);
    const masterTankCap = this.tankCapService.getVersionByYear(this.year);

    const masterContract = this.masterContractService.getGen(this.year, this.month);
    const masterUnit = this.unitService.getList();

    const optimizationDataPantane = this.optimizationsService.getListPantane(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationRevisionDataPantane = this.optimizationsService.getRevisionListPantane(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationDataNgl = this.optimizationsService.getListNgl(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationRevisionDataNgl = this.optimizationsService.getRevisionListNgl(this.year, this.month, this.version, this.isWithOutDemandAI);

    const optimizationDataLrMonthly = this.optimizationsService.getListLrMonthly(this.year, this.month, this.version, this.isWithOutDemandAI);
    // const optimizationRevisionData = this.optimizationsService.getRevisionListLrMonthly(this.year, this.month, this.version, this.isWithOutDemandAI);

    const optimizationDataCo2 = this.optimizationsService.getListCo2(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationRevisionDataCo2 = this.optimizationsService.getRevisionListCo2(this.year, this.month, this.version, this.isWithOutDemandAI);

    const optimizationDataC3Lpg = this.optimizationsService.getListC3Lpg(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationRevisionDataC3Lpg = this.optimizationsService.getRevisionListC3Lpg(this.year, this.month, this.version, this.isWithOutDemandAI);


    const optimizationDataC2 = this.optimizationsService.getList(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationRevisionDataC2 = this.optimizationsService.getRevisionList(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationDataVolumn = this.optimizationsService.getListVolumn(this.year, this.month, this.version, this.isWithOutDemandAI);

    return forkJoin([masterAbilityPlanRayong, masterAbilityPlanKhmService, masterAbilityRefineryService, masterAbilityPentaneService, masterCalMarginService
      , masterDepotManagement, masterLRByLegal, masterVolumeConstrain, masterTankCap
      , masterContract, masterUnit, optimizationDataPantane, optimizationRevisionDataPantane, optimizationDataNgl, optimizationRevisionDataNgl
      , optimizationDataLrMonthly, optimizationDataCo2, optimizationRevisionDataCo2, optimizationDataC3Lpg, optimizationRevisionDataC3Lpg, optimizationDataC2, optimizationRevisionDataC2, optimizationDataVolumn
    ]);
  }

  onAbilityPlanRayongValueChanged = (event) => {

    this.loaderService.show();
    this.subject
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        if (this.dataInfo.abilityPlanRayongItem) {
          this.abilityPlanRayongService.getList(this.dataInfo.abilityPlanRayongItem.year, this.dataInfo.abilityPlanRayongItem.month, this.dataInfo.abilityPlanRayongItem.version).subscribe(res => {
            if (res) {
              const dataC2 = _.filter(res, (item) => { return item.product === 'C2' })
              this.optimizationDataGridC2.setAbility(_.cloneDeep(dataC2))
              res = null;
            }
          })
        } else if (!this.dataInfo.abilityPlanRayongItem) {
          this.optimizationDataGridC2.setAbility([])
        }

        this.loaderService.hide();
      });

    this.subject.next(event);

  }

  onAbilityPlanRayongOldValueChanged = (event) => {

    this.loaderService.show();
    this.subject
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        if (this.dataInfo.abilityPlanRayongOldItem) {
          this.abilityPlanRayongService.getList(this.dataInfo.abilityPlanRayongOldItem.year, this.dataInfo.abilityPlanRayongOldItem.month, this.dataInfo.abilityPlanRayongOldItem.version).subscribe(res => {
            if (res) {
              const dataC2 = _.filter(res, (item) => { return item.product === 'C2' })//C2
              this.optimizationDataGridC2.setAbilityOld(_.cloneDeep(dataC2))
              res = null;
            }
          })
        } else if (!this.dataInfo.abilityPlanRayongOldItem) {
          this.optimizationDataGridC2.setAbilityOld([])
        }

        this.loaderService.hide();
      });

    this.subject.next(event);

  }

  tabC2Change($event) {

    this.isViewC2 = true;
    this.isViewLR = false;
    this.isViewC3LPG = false;
    this.isViewNGL = false;
    this.isViewCo2 = false;
    this.isViewPantane = false;
    this.loaderService.show();
    setTimeout(() => {
      this.optimizationDataGridC2.gridRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }
  tabC3LPGChange($event) {

    this.isViewC2 = false;
    this.isViewLR = false;
    this.isViewC3LPG = true;
    this.isViewNGL = false;
    this.isViewCo2 = false;
    this.isViewPantane = false;
    this.loaderService.show();
    setTimeout(() => {
      this.optimizationDataGridC3LPG.gridRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }

  tabNGLChange($event) {
    this.isViewC2 = false;
    this.isViewLR = false;
    this.isViewC3LPG = false;
    this.isViewNGL = true;
    this.isViewCo2 = false;
    this.isViewPantane = false;
    this.loaderService.show();
    setTimeout(() => {
      this.optimizationDataGridNGL.gridRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }

  tabCO2Change($event) {
    this.isViewC2 = false;
    this.isViewLR = false;
    this.isViewC3LPG = false;
    this.isViewNGL = false;
    this.isViewCo2 = true;
    this.isViewPantane = false;
    this.loaderService.show();
    setTimeout(() => {
      // this.optimizationDataGridCo2.gridRefresh(() => {
      //   this.loaderService.hide();
      // });
    }, 100);
  }

  tabPantaneChange($event) {
    this.isViewC2 = false;
    this.isViewLR = false;
    this.isViewC3LPG = false;
    this.isViewNGL = false;
    this.isViewCo2 = false;
    this.isViewPantane = true;
    this.loaderService.show();
    setTimeout(() => {
      // this.optimizationDataGridPantane.gridRefresh(() => {
      //   this.loaderService.hide();
      // });
    }, 100);
  }

  tabLRMonthlyChange($event) {
    this.isViewC2 = false;
    this.isViewLR = true;
    this.isViewC3LPG = false;
    this.isViewNGL = false;
    this.isViewCo2 = false;
    this.isViewPantane = false;
    this.loaderService.show();
    setTimeout(() => {
      const dataSend = this.optimizationDataGridC3LPG.getDataToLrMonthly();
      this.optimizationDataGridLrMonthly.gridRefresh(dataSend, () => {
        this.loaderService.hide();
      });
    }, 100);
  }
  tabVolumnChange($event) {
    this.loaderService.show();
    setTimeout(() => {
      this.optimizationDataGridVolumn.gridRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }

  showHideClick(isShow) {
    this.isShowFilterBlock = isShow
    if (this.isShowFilterBlock === true) {
      this.registerEvent();
    }
  }
  onOptimization() {

    if (this.accessMenu == 1) {
      this.loaderService.show();
      let optimizationCondition: any = {
        month: this.month,
        year: this.year,
        version: this.version,
        abilities: {
          rayong: this.dataInfo.abilityPlanRayongId,
          pentane: this.dataInfo.abilityPentaneId,
          khm: this.dataInfo.abilityPlanKhmId,
          refinery: this.dataInfo.abilityRefineryId,
        },
        calMrgin: this.dataInfo.calMarginId,
        constrain: {
          tankCap: this.dataInfo.tankCapId,
          lrByLegal: this.dataInfo.lRbyLegalId,
          depotConstrain: this.dataInfo.depotConstrainId,
          volumeConstrain: this.dataInfo.volumeConstrainId,
        }
      };

      this.optimizationsService.getDataToModel(optimizationCondition).subscribe((dataSend: any) => {

        let dataToModel = _.cloneDeep(dataSend);
        this.dataInfo.jsonToModel = dataToModel.fileName;
        const dataListSCG = _.cloneDeep(this.optimizationDataGridC2.dataListSCG);
        const dataLPGPetro = _.cloneDeep(this.optimizationDataGridC3LPG.dataListBalanceLPGPetro);
        const dataC3 = _.cloneDeep(this.optimizationDataGridC3LPG.dataListBalanceC3);
        const dataC3LPG = _.cloneDeep(this.optimizationDataGridC3LPG.dataListBalanceC3LPG);
        const dataLRCLOSINGSTOCK = _.cloneDeep(this.optimizationDataGridLrMonthly.dataListCLOSINGSTOCK);//dataListMTBRP
        const dataLRMTBRP = _.cloneDeep(this.optimizationDataGridLrMonthly.dataListMTBRP);//dataListMTBRP
        const dataListIMPORTCARCO = _.cloneDeep(this.optimizationDataGridLrMonthly.dataListIMPORTCARCO);//dataListMTBRP
        const date = dataToModel.addition['c3/lpg'].allocate_c2scg.date;

        dataToModel.addition['c3/lpg'].cross_c3_lpg = {};
        dataToModel.addition['c3/lpg'].cross_dom = {};
        dataToModel.addition['c3/lpg'].wait_sell = {};
        dataToModel.addition['c3/lpg'].unknow_untax = {};
        dataToModel.addition['c3/lpg'].brp_ending_inventory = {};
        dataToModel.addition['c3/lpg'].mt_sphere_end_inventory = {};
        dataToModel.addition['c3/lpg'].mt_c3_end_inventory = {};
        dataToModel.addition['c3/lpg'].mt_c4_end_inventory = {};
        dataToModel.addition['c3/lpg'].mt_c3_end_inventory_life = {};
        dataToModel.addition['c3/lpg'].mt_c4_end_inventory_life = {};
        dataToModel.addition['c3/lpg'].Import_cargo_ptt = {};
        dataToModel.addition['c3/lpg'].cross_c3_lpg.date = date;
        dataToModel.addition['c3/lpg'].cross_dom.date = date;
        dataToModel.addition['c3/lpg'].wait_sell.date = date;
        dataToModel.addition['c3/lpg'].unknow_untax.date = date;
        dataToModel.addition['c3/lpg'].brp_ending_inventory.date = date;
        dataToModel.addition['c3/lpg'].mt_sphere_end_inventory.date = date;
        dataToModel.addition['c3/lpg'].mt_c3_end_inventory.date = date;
        dataToModel.addition['c3/lpg'].mt_c4_end_inventory.date = date;
        dataToModel.addition['c3/lpg'].mt_c3_end_inventory_life.date = date;
        dataToModel.addition['c3/lpg'].mt_c4_end_inventory_life.date = date;
        dataToModel.addition['c3/lpg'].Import_cargo_ptt.date = date;

        let dataCross_c3_lpg = _.find(dataC3, (item) => {
          return _.toUpper(item.production) === 'CROSS TO LPG (NORMAL CROSS C3 TO AEROSOL 1,000 TON/เดือน)';
        })
        let dataCross_dom = _.find(dataLPGPetro, (item) => {
          return _.toUpper(item.production) === 'LPG PETRO CROSS TO LPG DOM';
        })
        let dataWait_sell = _.find(dataC3LPG, (item) => {
          return _.toUpper(item.production) === 'รอจำหน่าย';
        })
        let dataUnknow_untax = _.find(dataC3LPG, (item) => {
          return _.toUpper(item.production) === 'ดึง UNKNOW UNTAX';
        })
        // rowOrder: 1,
        // production: "Closing stock @GSP+MT+BRP (LR) (min กม. 22.03--> 33.21 KT/ internal LR 39.03 --> 50.21 KT)",
        let dataBrp_ending_inventory = _.find(dataLRCLOSINGSTOCK, (item) => {
          return item.rowOrder === 1;
        })

        let dataMt_sphere_end_inventory = _.find(dataLRMTBRP, (item) => {
          return _.toUpper(item.production) === 'MT-SPHERE ENDING INVENTORY';
        })
        //rowOrder: 13,
        //production: "MT-C3 Refig Ending Inventory",
        let dataMt_c3_end_inventory = _.find(dataLRMTBRP, (item) => {
          return item.rowOrder === 13;
        })
        let dataMt_c4_end_inventory = _.find(dataLRMTBRP, (item) => {
          return item.rowOrder === 14;
        })
        let dataMt_c3_end_inventory_life = _.find(dataLRMTBRP, (item) => {
          return item.rowOrder === 15;
        })
        let dataMt_c4_end_inventory_life = _.find(dataLRMTBRP, (item) => {
          return item.rowOrder === 16;
        })
        let dataImport_cargo_ptt = _.find(dataListIMPORTCARCO, (item) => {
          return _.toUpper(item.production) === 'IMPORT CARGO OF PTT';
        })

        let dataSCG = _.find(dataListSCG, (item) => {
          return item.rowOrder === 2;
        })
        let volumeCross_c3_lpg: any = [];
        let volumeCross_dom: any = [];
        let volumeWait_sell: any = [];
        let volumeUnknow_untax: any = [];
        let volumeBrp_ending_inventory: any = [];
        let volumeMt_sphere_end_inventory: any = [];
        let volumeMt_c3_end_inventory: any = [];
        let volumeMt_c4_end_inventory: any = [];
        let volumeMt_c3_end_inventory_life: any = [];
        let volumeMt_c4_end_inventory_life: any = [];
        let volumeImport_cargo_ptt: any = [];
        let volumeSCG: any = [];
        _.each(this.listMonth, (item) => {
          volumeCross_c3_lpg.push(dataCross_c3_lpg['M' + item.Month + item.Year]);
          volumeCross_dom.push(dataCross_dom['M' + item.Month + item.Year]);
          volumeWait_sell.push(dataWait_sell['M' + item.Month + item.Year]);
          volumeUnknow_untax.push(dataUnknow_untax['M' + item.Month + item.Year]);
          volumeBrp_ending_inventory.push(dataBrp_ending_inventory['M' + item.Month + item.Year]);
          volumeMt_sphere_end_inventory.push(dataMt_sphere_end_inventory['M' + item.Month + item.Year]);
          volumeMt_c3_end_inventory.push(dataMt_c3_end_inventory['M' + item.Month + item.Year]);
          volumeMt_c4_end_inventory.push(dataMt_c4_end_inventory['M' + item.Month + item.Year]);
          volumeMt_c3_end_inventory_life.push(dataMt_c3_end_inventory_life['M' + item.Month + item.Year]);
          volumeMt_c4_end_inventory_life.push(dataMt_c4_end_inventory_life['M' + item.Month + item.Year]);
          volumeImport_cargo_ptt.push(dataImport_cargo_ptt['M' + item.Month + item.Year]);
          volumeSCG.push(dataSCG['M' + item.Month + item.Year]);
        })
        dataToModel.addition['c3/lpg'].cross_c3_lpg.volume = volumeCross_c3_lpg;
        dataToModel.addition['c3/lpg'].cross_dom.volume = volumeCross_dom;
        dataToModel.addition['c3/lpg'].wait_sell.volume = volumeWait_sell;
        dataToModel.addition['c3/lpg'].unknow_untax.volume = volumeUnknow_untax;
        dataToModel.addition['c3/lpg'].brp_ending_inventory.volume = volumeBrp_ending_inventory;
        dataToModel.addition['c3/lpg'].mt_sphere_end_inventory.volume = volumeMt_sphere_end_inventory;
        dataToModel.addition['c3/lpg'].mt_c3_end_inventory.volume = volumeMt_c3_end_inventory;
        dataToModel.addition['c3/lpg'].mt_c4_end_inventory.volume = volumeMt_c4_end_inventory;
        dataToModel.addition['c3/lpg'].mt_c3_end_inventory_life.volume = volumeMt_c3_end_inventory_life;
        dataToModel.addition['c3/lpg'].mt_c4_end_inventory_life.volume = volumeMt_c4_end_inventory_life;
        dataToModel.addition['c3/lpg'].Import_cargo_ptt.volume = volumeImport_cargo_ptt;
        dataToModel.fix_volume_month[0].volume = volumeSCG;

        let observable: any = [];
        observable.push(this.optimizationsService.sendOptimize(dataToModel));
        observable.push(this.optimizationsService.sendOptimizeNGLShip(dataToModel));

        forkJoin(observable).subscribe(
          (res: any) => {
            if (res && res[0].status_code !== 200) {
              this.loaderService.hide();
              Swal.fire({
                title: 'error',
                text: 'ไม่สามารถคำนวนค่าได้ error : ' + res[0].detail,
                icon: 'error',
                showConfirmButton: true,
                confirmButtonText: 'ปิด',
                //timer: 1000
              });
              return;
            }
            if (res && res[1].status_code !== 200) {
              this.loaderService.hide();
              Swal.fire({
                title: 'error',
                text: 'ไม่สามารถคำนวนค่าได้ error : ' + res[1].detail,
                icon: 'error',
                showConfirmButton: true,
                confirmButtonText: 'ปิด',
                //timer: 1000
              });
              return;
            }
            console.log("sendDataPentane :: ", res);
            this.renderDataFromMergeAllocation(res[0]);
            this.genVolumn(res[0].data, dataToModel, res[1].data);
            this.optimizationDataGridVolumn.setData(this.dataMaster.volumn);
            this.loaderService.hide();

            Swal.fire({
              title: '',
              text: 'Optimization สำเร็จ',
              icon: 'success',
              showConfirmButton: false,
              // confirmButtonText: 'ปิด'
              timer: 1000,
            });

          },
          (error) => {
            this.loaderService.hide();
            Swal.fire({
              title: 'Error',
              text: 'ไม่สามารถคำนวนค่าได้ : error ' + error ? error.message : '',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'ปิด',
              //timer: 1000
            });
          }
        );

      }, (error: any) => {
        this.loaderService.hide();
        Swal.fire({
          title: 'Error',
          text: 'ไม่สามารถคำนวนค่าได้ : error ' + error ? error.message : '',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
          //timer: 1000
        });
      })
    }
  }

  respExample() {

    const res = {
      "status_code": 200,
      "success": true,
      "data": {
        "Propane": {
          "demand": [
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "C3 Import Reversed Pipeline",
                "demand": "**gReversedPip",
                "delivery_point": "GSP RY",
                "product_type": "reversed"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "product": "Propane",
                "source": "C3 Import Reversed Pipeline",
                "demand": "C3 - SCG (Tier 1 : 0 - 48 KT)",
                "delivery_point": "GSP RY",
                "product_type": "reversed"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "product": "Propane",
                "source": "C3 Import Reversed Pipeline",
                "demand": "C3 - SCG (Tier 2 : 48.001 - 400 KT)",
                "delivery_point": "GSP RY",
                "product_type": "reversed"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "C3 Import Reversed Pipeline",
                "demand": "GC",
                "delivery_point": "GSP RY",
                "product_type": "reversed"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "C3 Import Reversed Pipeline",
                "demand": "Substitued C3 - MOC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "C3 Import Split Cargo @SCG",
                "demand": "**gSplitCargo",
                "delivery_point": "SCG",
                "product_type": "splitcargo"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "product": "Propane",
                "source": "C3 Import Split Cargo @SCG",
                "demand": "C3 - SCG (Tier 1 : 0 - 48 KT)",
                "delivery_point": "SCG",
                "product_type": "splitcargo"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "product": "Propane",
                "source": "C3 Import Split Cargo @SCG",
                "demand": "C3 - SCG (Tier 2 : 48.001 - 400 KT)",
                "delivery_point": "SCG",
                "product_type": "splitcargo"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "C3 Import Split Cargo @SCG",
                "demand": "Substitued C3 - MOC",
                "delivery_point": "SCG",
                "product_type": ""
              }
            },
            {
              "volume": [
                30,
                30,
                30,
                30,
                30,
                30,
                30,
                30,
                30,
                30,
                30,
                30
              ],
              "key": {
                "source": "GSP RY",
                "demand": "**gC3ROC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                30,
                18,
                0,
                0,
                0,
                0,
                30,
                18,
                0,
                0,
                0,
                0
              ],
              "key": {
                "product": "Propane",
                "source": "GSP RY",
                "demand": "SCG Tier 1 : 0 - 48 KT",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                12,
                30,
                30,
                30,
                30,
                0,
                12,
                30,
                30,
                30,
                30
              ],
              "key": {
                "product": "Propane",
                "source": "GSP RY",
                "demand": "SCG Tier 2 : 48.001 - 400 KT",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                28.8,
                28.8,
                28.8,
                28.8,
                28.8,
                28.8,
                28.8,
                28.8,
                28.8,
                28.8,
                28.8,
                28.8
              ],
              "key": {
                "source": "GSP RY",
                "demand": "GC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                33,
                33,
                33,
                33,
                33,
                33,
                33,
                33,
                33,
                33,
                33,
                33
              ],
              "key": {
                "source": "GSP RY",
                "demand": "HMC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                58.356164,
                21.6,
                21.6,
                21.6,
                21.6,
                21.6,
                55.643836,
                21.6,
                21.6,
                21.6,
                21.6,
                21.6
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTAC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTOR (C3) truck",
                "delivery_point": "GSP RY",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                1.7279358,
                0.047743316,
                0.46126203,
                1.4464945,
                0.0053805882,
                0.10107671,
                0.52291444,
                0.47230983,
                0.52291444,
                0.65423461,
                0.6760424,
                0.46524064
              ],
              "key": {
                "source": "GSP RY",
                "demand": "Ssubstitued C3 - SCG",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "Import",
                "demand": "HMC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "Import",
                "demand": "PTTAC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            }
          ],
          "tank": [
            {
              "volume": [
                5.4102,
                5.4102,
                5.4102,
                5.4102,
                5.4102,
                5.4102,
                9.19734,
                9.19734,
                9.19734,
                8.60136,
                7.40136,
                9.19734
              ],
              "key": {
                "product": "C3",
                "type": "tank"
              }
            }
          ]
        },
        "Ethane": {
          "demand": [
            {
              "volume": [
                34.758,
                34.968,
                28.728,
                15,
                32.67,
                33.759,
                32.736,
                29.568,
                32.736,
                33.12,
                34.224,
                34.2
              ],
              "key": {
                "source": "GSP RY",
                "demand": "C2 - OLE1",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                35.347491,
                32.491164,
                33.554145,
                34.869041,
                32.779147,
                32.58183,
                33.298955,
                34.292927,
                33.298955,
                33.882199,
                33.559272,
                33.560909
              ],
              "key": {
                "source": "GSP RY",
                "demand": "C2 - OLE2",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                0.124,
                0.124,
                0.12,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "C2 - OLE3 (Hybrid) supplement C2",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "C2 - OLE3 (Vol >274T/Hr)",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                72.294,
                124.45,
                111.206,
                100.94759,
                121.5923,
                124.12078,
                111.9965,
                96.941677,
                111.9965,
                100.91969,
                105.73601,
                105.73
              ],
              "key": {
                "source": "GSP RY",
                "demand": "C2 - OLE3",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                11.16,
                11.16,
                10.8,
                11.16,
                10.8,
                11.16,
                11.16,
                10.08,
                11.16,
                10.8,
                11.16,
                10.8
              ],
              "key": {
                "source": "GSP RY",
                "demand": "C2 - SCG",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            }
          ],
          "tank": [],
          "merge_allocation": {
            "GSP C2 Production": {
              "Total C2 Ability": [
                {
                  "value": [
                    150.746,
                    203.11200000000002,
                    183.62400000000002,
                    159.517588,
                    197.83230500000002,
                    201.44977599999999,
                    188.3025,
                    170.079677,
                    188.3025,
                    177.609688,
                    183.530012,
                    183.49999999999997
                  ],
                  "unit": "KT"
                },
                {
                  "value": [
                    202.61559139784944,
                    273.00000000000006,
                    255.03333333333336,
                    214.40536021505375,
                    274.7670902777778,
                    270.76582795698926,
                    253.09475806451613,
                    253.09475744047617,
                    253.09475806451613,
                    246.6801222222222,
                    246.68012365591397,
                    254.86111111111106
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "Total C2 low Ability": [
                {
                  "value": [
                    48.36,
                    48.36,
                    46.8,
                    46.692414,
                    45.186207,
                    47.526207,
                    47.526207,
                    42.926897,
                    47.526207,
                    45.993103,
                    47.526207,
                    47.5
                  ],
                  "unit": "KT"
                },
                {
                  "value": [
                    65,
                    65,
                    65,
                    62.75862096774193,
                    62.75862083333334,
                    63.879310483870974,
                    63.879310483870974,
                    63.879311011904754,
                    63.879310483870974,
                    63.87930972222221,
                    63.879310483870974,
                    65.97222222222223
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "Total C2 to GC": [
                {
                  "value": [
                    260,
                    260,
                    260,
                    260,
                    260,
                    260,
                    260,
                    260,
                    260,
                    260,
                    260,
                    260
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "C2 Low CO2 to SCG": [
                {
                  "value": [
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "GSP C2 Low CO2 Production < 65 Ton/hr": [
                {
                  "value": [
                    -72.38440860215056,
                    -1.9999999999999432,
                    -19.96666666666664,
                    -60.59463978494625,
                    -0.23290972222218898,
                    -4.234172043010744,
                    -21.905241935483872,
                    -21.905242559523828,
                    -21.905241935483872,
                    -28.319877777777805,
                    -28.319876344086026,
                    -20.138888888888943
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "GC": [
                {
                  "value": [
                    -68.43616813294234,
                    -1.8909090909090371,
                    -18.87757575757573,
                    -57.28947761485827,
                    -0.22020555555552412,
                    -4.003217204301067,
                    -20.71041055718475,
                    -20.710411147186164,
                    -20.71041055718475,
                    -26.775157171717197,
                    -26.77515581622679,
                    -19.04040404040409
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "SCG": [
                {
                  "value": [
                    -3.948240469208212,
                    -0.10909090909090599,
                    -1.0890909090909076,
                    -3.305162170087977,
                    -0.012704166666664853,
                    -0.23095483870967695,
                    -1.1948313782991202,
                    -1.1948314123376633,
                    -1.1948313782991202,
                    -1.5447206060606073,
                    -1.5447205278592377,
                    -1.0984848484848513
                  ],
                  "unit": "Ton/hr"
                }
              ]
            },
            "C2 SCG": {
              "SCG Demand": [
                {
                  "value": [
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15,
                    15
                  ],
                  "unit": "Ton/hr"
                },
                {
                  "value": [
                    360,
                    360,
                    360,
                    360,
                    360,
                    360,
                    360,
                    360,
                    360,
                    360,
                    360,
                    360
                  ],
                  "unit": "Ton/day"
                },
                {
                  "value": [
                    11160,
                    11160,
                    10800,
                    11160,
                    10800,
                    11160,
                    11160,
                    10080,
                    11160,
                    10800,
                    11160,
                    10800
                  ],
                  "unit": "Ton"
                },
                {
                  "value": [
                    11.16,
                    11.16,
                    10.8,
                    11.16,
                    10.8,
                    11.16,
                    11.16,
                    10.08,
                    11.16,
                    10.8,
                    11.16,
                    10.8
                  ],
                  "unit": "KT"
                }
              ],
              "Allo C2 Low CO2 to SCG": [
                {
                  "value": [
                    11.05175953079179,
                    14.890909090909092,
                    13.910909090909092,
                    11.694837829912023,
                    14.987295833333334,
                    14.76904516129032,
                    13.80516862170088,
                    13.805168587662338,
                    13.80516862170088,
                    13.455279393939392,
                    13.45527947214076,
                    13.901515151515149
                  ],
                  "unit": "Ton/hr"
                },
                {
                  "value": [
                    265.24222873900294,
                    357.38181818181823,
                    333.8618181818182,
                    280.67610791788854,
                    359.6951,
                    354.45708387096767,
                    331.3240469208211,
                    331.32404610389614,
                    331.3240469208211,
                    322.9267054545454,
                    322.9267073313782,
                    333.63636363636357
                  ],
                  "unit": "Ton/day"
                },
                {
                  "value": [
                    8222.50909090909,
                    11078.836363636365,
                    10015.854545454546,
                    8700.959345454545,
                    10790.853000000001,
                    10988.169599999997,
                    10271.045454545454,
                    9277.073290909091,
                    10271.045454545454,
                    9687.801163636363,
                    10010.727927272725,
                    10009.090909090906
                  ],
                  "unit": "Ton"
                },
                {
                  "value": [
                    8.22250909090909,
                    11.078836363636364,
                    10.015854545454546,
                    8.700959345454544,
                    10.790853,
                    10.988169599999997,
                    10.271045454545455,
                    9.27707329090909,
                    10.271045454545455,
                    9.687801163636363,
                    10.010727927272725,
                    10.009090909090906
                  ],
                  "unit": "KT"
                }
              ]
            },
            "C2 GC": {
              "Allo C2 Low CO2 to GC": [
                {
                  "value": [
                    35.34749090909091,
                    32.49116363636364,
                    33.554145454545456,
                    34.86904065454546,
                    32.779147,
                    32.5818304,
                    33.29895454545455,
                    34.29292670909091,
                    33.29895454545455,
                    33.882198836363635,
                    33.559272072727275,
                    33.56090909090909
                  ],
                  "unit": "KT"
                },
                {
                  "value": [
                    35347.490909090906,
                    32491.16363636364,
                    33554.145454545454,
                    34869.04065454546,
                    32779.147000000004,
                    32581.830400000003,
                    33298.95454545455,
                    34292.926709090905,
                    33298.95454545455,
                    33882.198836363634,
                    33559.272072727275,
                    33560.909090909096
                  ],
                  "unit": "Ton"
                },
                {
                  "value": [
                    47.510068426197456,
                    43.670918866080164,
                    46.6029797979798,
                    46.86699012707723,
                    45.526593055555566,
                    43.79278279569893,
                    44.75665933528837,
                    51.03114093614718,
                    44.75665933528837,
                    47.058609494949486,
                    45.10654848484848,
                    46.61237373737374
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "Allo C2 High CO2 to GC": [
                {
                  "value": [
                    82.902,
                    136.152,
                    114.912,
                    82.69184100000001,
                    133.78609799999998,
                    134.434902,
                    128.748293,
                    116.28878,
                    128.748293,
                    119.256585,
                    123.23180500000001,
                    123.1
                  ],
                  "unit": "KT"
                },
                {
                  "value": [
                    82902,
                    136152,
                    114912,
                    82691.84100000001,
                    133786.09799999997,
                    134434.902,
                    128748.29299999999,
                    116288.78,
                    128748.29299999999,
                    119256.585,
                    123231.80500000001,
                    123100
                  ],
                  "unit": "Ton"
                },
                {
                  "value": [
                    111.42741935483872,
                    183,
                    159.6,
                    111.14494758064518,
                    185.81402499999993,
                    180.69207258064515,
                    173.04878091397848,
                    173.04877976190474,
                    173.04878091397848,
                    165.63414583333335,
                    165.63414650537635,
                    170.9722222222222
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "Total Allo to GC": [
                {
                  "value": [
                    118.24949090909091,
                    168.64316363636362,
                    148.46614545454545,
                    117.56088165454547,
                    166.56524499999998,
                    167.0167324,
                    162.04724754545452,
                    150.5817067090909,
                    162.04724754545452,
                    153.13878383636364,
                    156.7910770727273,
                    156.6609090909091
                  ],
                  "unit": "KT"
                },
                {
                  "value": [
                    118249.4909090909,
                    168643.16363636364,
                    148466.14545454545,
                    117560.88165454548,
                    166565.24499999997,
                    167016.7324,
                    162047.24754545453,
                    150581.70670909088,
                    162047.24754545453,
                    153138.78383636364,
                    156791.0770727273,
                    156660.9090909091
                  ],
                  "unit": "Ton"
                },
                {
                  "value": [
                    158.93748778103617,
                    226.67091886608017,
                    206.2029797979798,
                    158.0119377077224,
                    231.3406180555555,
                    224.4848553763441,
                    217.80544024926684,
                    224.07992069805192,
                    217.80544024926684,
                    212.69275532828283,
                    210.74069499022482,
                    217.58459595959593
                  ],
                  "unit": "Ton/hr"
                }
              ],
              "Balance Total C2": [
                {
                  "value": [
                    24.274000000000008,
                    23.390000000000036,
                    25.142000000000024,
                    33.25574699999998,
                    20.476207000000045,
                    23.44487399999999,
                    15.98420700000003,
                    10.22089699999999,
                    15.98420700000003,
                    14.783102999999999,
                    16.728206999999983,
                    16.829999999999977
                  ],
                  "unit": "KT"
                }
              ],
              "Balance C2 Low CO2": [
                {
                  "value": [
                    4.790000000000001,
                    4.789999999999997,
                    3.229999999999995,
                    3.1224139999999974,
                    1.616207000000001,
                    3.956207000000001,
                    3.9562069999999956,
                    -0.643103,
                    3.9562069999999956,
                    2.4231029999999993,
                    3.956206999999999,
                    3.9300000000000015
                  ],
                  "unit": "KT"
                }
              ]
            }
          }
        },
        "LPG": {
          "demand": [
            {
              "volume": [
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5
              ],
              "key": {
                "source": "Export",
                "demand": "TBU",
                "delivery_point": "MT",
                "product_type": "",
                "year_contract_id": "PTTORLPG20220000044"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "Atlas",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "Atlas",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "BCP",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "BCP",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "ESSO",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "ESSO",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "IRPC",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "IRPC",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "Orchid",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PAP",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PAP",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PAP",
                "delivery_point": "PTT TANK (Truck)",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PAP",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PTTOR",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PTTOR",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PTTOR",
                "delivery_point": "PTT TANK (Truck)",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "PTTOR",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "WP",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GC",
                "demand": "WP",
                "delivery_point": "PTT TANK",
                "product_type": ""
              }
            },
            {
              "volume": [
                13.95,
                8.99,
                14.66,
                15,
                15.5,
                15,
                15.08,
                14.87,
                14,
                15.5,
                15,
                15.5
              ],
              "key": {
                "source": "GSP KHM",
                "demand": "PTTOR",
                "delivery_point": "GSP KHM",
                "product_type": ""
              }
            },
            {
              "volume": [
                38.939214,
                10,
                33.1,
                16.7,
                9,
                44.4514,
                24.6486,
                48.7514,
                31.6,
                26.7,
                25.3,
                26.7
              ],
              "key": {
                "source": "GSP RY",
                "demand": "**LPG_ROC",
                "delivery_point": "GSP RY",
                "product_type": "petro"
              }
            },
            {
              "volume": [
                38.939214,
                10,
                33.1,
                16.7,
                9,
                44.4514,
                24.6486,
                48.7514,
                31.6,
                26.7,
                25.3,
                26.7
              ],
              "key": {
                "product": "LPG",
                "source": "GSP RY",
                "demand": "SCG LPG : 48 - 240 KT",
                "delivery_point": "GSP RY",
                "product_type": "petro"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "product": "LPG",
                "source": "GSP RY",
                "demand": "SCG Additional LPG Tier 1 : 1 - 384 KT",
                "delivery_point": "GSP RY",
                "product_type": "petro"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "product": "LPG",
                "source": "GSP RY",
                "demand": "SCG Additional LPG Tier 2 : 384.001 - 720 KT",
                "delivery_point": "GSP RY",
                "product_type": "petro"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "Atlas",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "Atlas",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "BCP",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "BCP",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "Big gas",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "Big gas",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "Chevron",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                341.07924,
                302.60355,
                327,
                0,
                361.1,
                323.64256,
                359.90724,
                318.09598,
                341.1,
                346.80402,
                349.7,
                331.18639
              ],
              "key": {
                "source": "GSP RY",
                "demand": "ESSO",
                "delivery_point": "BRP",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                347.95744,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "ESSO",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "ESSO",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                7.8486,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "GSP (LPG) to GC",
                "delivery_point": "GSP RY",
                "product_type": "petro"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "IRPC",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "IRPC",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "Orchid",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PAP",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PAP",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PAP",
                "delivery_point": "PTT TANK (Truck)",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PAP",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTOR",
                "delivery_point": "BRP",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTOR",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTOR",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTOR",
                "delivery_point": "PTT TANK (Truck)",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTOR",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2
              ],
              "key": {
                "source": "GSP RY",
                "demand": "PTTOR (orderless)",
                "delivery_point": "GSP RY",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                10,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "SGP",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "UGP",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "UNO",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "WP",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "GSP RY",
                "demand": "WP",
                "delivery_point": "PTT TANK",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                1.2,
                0,
                1.2,
                1.2,
                1.2,
                1.2,
                1.2,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "IRPC",
                "demand": "Atlas",
                "delivery_point": "IRPC",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "IRPC",
                "demand": "PTTOR",
                "delivery_point": "IRPC",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "IRPC",
                "demand": "WP",
                "delivery_point": "IRPC",
                "product_type": ""
              }
            },
            {
              "volume": [
                85,
                71.260989,
                85,
                85,
                85,
                85,
                85,
                85,
                85,
                85,
                85,
                70.890411
              ],
              "key": {
                "source": "Import",
                "demand": "Import (LPG) to GC",
                "delivery_point": "GSP RY",
                "product_type": ""
              }
            },
            {
              "volume": [
                90,
                90,
                90,
                90,
                90,
                90,
                90,
                90,
                90,
                90,
                90,
                90
              ],
              "key": {
                "source": "Import",
                "demand": "PTTOR",
                "delivery_point": "BRP",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "Import",
                "demand": "PTTOR",
                "delivery_point": "MT",
                "product_type": "dom"
              }
            },
            {
              "volume": [
                44,
                34,
                0,
                44,
                44,
                0,
                44,
                44,
                44,
                44,
                44,
                44
              ],
              "key": {
                "source": "Import",
                "demand": "SGP",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                44,
                0,
                0,
                44,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "Import",
                "demand": "UGP",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                5.55,
                5.735,
                5.735,
                5.55,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735
              ],
              "key": {
                "source": "PTTEP",
                "demand": "PTTOR",
                "delivery_point": "PTTEP",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "SPRC",
                "demand": "Atlas",
                "delivery_point": "SPRC",
                "product_type": ""
              }
            },
            {
              "volume": [
                5.78,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12
              ],
              "key": {
                "source": "SPRC",
                "demand": "PAP",
                "delivery_point": "SPRC",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "SPRC",
                "demand": "PTTOR",
                "delivery_point": "SPRC",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "SPRC",
                "demand": "SGP",
                "delivery_point": "MT",
                "product_type": ""
              }
            },
            {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "key": {
                "source": "SPRC",
                "demand": "WP",
                "delivery_point": "SPRC",
                "product_type": ""
              }
            }
          ],
          "tank": [
            {
              "volume": [
                9.84636,
                36.6552,
                36.6552,
                17.89776,
                17.89776,
                28.6038,
                19.04796,
                12.30058,
                14.60058,
                10.99656,
                10.99656,
                14.00058
              ],
              "key": {
                "product": "LPG",
                "type": "tank"
              }
            },
            {
              "volume": [
                6.39576,
                25.1532,
                25.1532,
                6.39576,
                6.39576,
                25.1532,
                7.54596,
                8.84998,
                11.14998,
                7.54596,
                7.54596,
                10.54998
              ],
              "key": {
                "product": "LPG",
                "type": "dom"
              }
            },
            {
              "volume": [
                3.4506,
                11.502,
                11.502,
                11.502,
                11.502,
                3.4506,
                11.502,
                3.4506,
                3.4506,
                3.4506,
                3.4506,
                3.4506
              ],
              "key": {
                "product": "LPG",
                "type": "petro"
              }
            }
          ]
        },
        "c3lpg": {
          "merge_allocation": {
            "Balance_C3LPG": {
              "volume": [
                15.25656,
                42.0654,
                42.0654,
                23.30796,
                23.30796,
                34.013999999999996,
                28.2453,
                21.49792,
                23.79792,
                19.597920000000002,
                18.39792,
                23.19792
              ],
              "unit": "KT"
            },
            "Supply_Source": {
              "volume": [
                "Jul-21",
                "Aug-21",
                "Sep-21",
                "Oct-21",
                "Nov-21",
                "Dec-21",
                "Jan-21",
                "Feb-21",
                "Mar-21",
                "Apr-21",
                "May-21",
                "Jun-21"
              ],
              "unit": null
            },
            "C3LPG_Tank_capacity": {
              "volume": [
                3450.6,
                11502,
                11502,
                11502,
                11502,
                3450.6,
                11502,
                3450.6,
                3450.6,
                3450.6,
                3450.6,
                3450.6
              ],
              "unit": "Ton"
            },
            "C3LPG_End_Inventory": {
              "volume": [
                5410.2,
                5410.2,
                5410.2,
                5410.2,
                5410.2,
                5410.2,
                9197.34,
                9197.34,
                9197.34,
                8601.36,
                7401.360000000001,
                9197.34
              ],
              "unit": "Ton"
            },
            "%_C3LPG_Inventory": {
              "volume": [
                "221.0%",
                "182.8%",
                "182.8%",
                "101.3%",
                "101.3%",
                "492.8%",
                "122.7%",
                "311.5%",
                "344.8%",
                "283.9%",
                "266.5%",
                "336.1%"
              ],
              "unit": "%"
            },
            "Import_จ่ายแทน_GSP": {
              "volume": [
                134,
                124,
                134,
                134,
                134,
                134,
                134,
                134,
                134,
                134,
                134,
                134
              ],
              "unit": "KT"
            },
            "รอจำหน่าย": {
              "volume": [
                0,
                -2,
                0,
                0,
                0.5,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "ดึง_Unknow_untax": {
              "volume": [
                0,
                0,
                0,
                0,
                0.7,
                0.7,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Balance C3__Supply_Source": {
              "volume": [
                "Jul-21",
                "Aug-21",
                "Sep-21",
                "Oct-21",
                "Nov-21",
                "Dec-21",
                "Jan-21",
                "Feb-21",
                "Mar-21",
                "Apr-21",
                "May-21",
                "Jun-21"
              ],
              "unit": "KT"
            },
            "Balance C3__C3_Tank_capacity": {
              "volume": [
                3450.6,
                11502,
                11502,
                11502,
                11502,
                3450.6,
                11502,
                3450.6,
                3450.6,
                3450.6,
                3450.6,
                3450.6
              ],
              "unit": "KT"
            },
            "Balance C3__C3_End_Inventory": {
              "volume": [
                5410.2,
                5410.2,
                5410.2,
                5410.2,
                5410.2,
                5410.2,
                9197.34,
                9197.34,
                9197.34,
                8601.36,
                7401.360000000001,
                9197.34
              ],
              "unit": "KT"
            },
            "Balance C3__Cross_to_LPG_normal_cross_C3_to_aerosol_1000_Ton": {
              "volume": [
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000
              ],
              "unit": "Ton"
            },
            "Balance C3__%_Inventory_ไม่ต่ำกว่า_50%_ไม่เกิน_85%": {
              "volume": [
                "156.7%",
                "47.0%",
                "47.0%",
                "47.0%",
                "47.0%",
                "156.7%",
                "79.9%",
                "266.5%",
                "266.5%",
                "249.2%",
                "214.4%",
                "266.5%"
              ],
              "unit": "Ton"
            },
            "Balance LPG__Supply_Source": {
              "volume": [
                "Jul-21",
                "Aug-21",
                "Sep-21",
                "Oct-21",
                "Nov-21",
                "Dec-21",
                "Jan-21",
                "Feb-21",
                "Mar-21",
                "Apr-21",
                "May-21",
                "Jun-21"
              ],
              "unit": "KT"
            },
            "Balance LPG__LPG_Tank_capacity": {
              "volume": [
                3450.6,
                11502,
                11502,
                11502,
                11502,
                3450.6,
                11502,
                3450.6,
                3450.6,
                3450.6,
                3450.6,
                3450.6
              ],
              "unit": "Ton"
            },
            "Balance LPG__LPG_End_Inventory": {
              "volume": [
                9846.36,
                36655.2,
                36655.2,
                17897.760000000002,
                17897.760000000002,
                28603.8,
                19047.96,
                12300.58,
                14600.58,
                10996.560000000001,
                10996.560000000001,
                14000.58
              ],
              "unit": "Ton"
            },
            "Balance LPG__% Inventory_30%พิจารณาดึง_import_แทน_C3_Cross_to_LPG)": {
              "volume": [
                "285.3%",
                "318.6%",
                "318.6%",
                "155.6%",
                "155.6%",
                "828.9%",
                "165.6%",
                "356.4%",
                "423.1%",
                "318.6%",
                "318.6%",
                "405.7%"
              ],
              "unit": "%"
            },
            "Balance LPG Petro__Supply_Source": {
              "volume": [
                "Jul-21",
                "Aug-21",
                "Sep-21",
                "Oct-21",
                "Nov-21",
                "Dec-21",
                "Jan-21",
                "Feb-21",
                "Mar-21",
                "Apr-21",
                "May-21",
                "Jun-21"
              ],
              "unit": null
            },
            "Balance LPG Petro__LPG_Petro_Tank_capacity": {
              "volume": [
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502
              ],
              "unit": "Ton"
            },
            "Balance LPG Petro__LPG_Petro_End_Inventory": {
              "volume": [
                3450.6,
                11502,
                11502,
                11502,
                11502,
                3450.6,
                11502,
                3450.6,
                3450.6,
                3450.6,
                3450.6,
                3450.6
              ],
              "unit": "Ton"
            },
            "Balance LPG Petro__LPG_Petro_Cross_to_LPG_Dom": {
              "volume": [
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000,
                3000
              ],
              "unit": "Ton"
            },
            "Balance LPG Petro__%_LPG_Petro_Inventory_(>30%)": {
              "volume": [
                "30.0 %",
                "100.0 %",
                "100.0 %",
                "100.0 %",
                "100.0 %",
                "30.0 %",
                "100.0 %",
                "30.0 %",
                "30.0 %",
                "30.0 %",
                "30.0 %",
                "30.0 %"
              ],
              "unit": "%"
            },
            "Balance LPG Dom__Supply_Source": {
              "volume": [
                "Jul-21",
                "Aug-21",
                "Sep-21",
                "Oct-21",
                "Nov-21",
                "Dec-21",
                "Jan-21",
                "Feb-21",
                "Mar-21",
                "Apr-21",
                "May-21",
                "Jun-21"
              ],
              "unit": null
            },
            "Balance LPG Dom__LPG_Dom_Tank capacity": {
              "volume": [
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502,
                11502
              ],
              "unit": "Ton"
            },
            "Balance LPG Dom__LPG_Dom_End Inventory": {
              "volume": [
                6395.76,
                25153.199999999997,
                25153.199999999997,
                6395.76,
                6395.76,
                25153.199999999997,
                7545.96,
                8849.98,
                11149.98,
                7545.96,
                7545.96,
                10549.98
              ],
              "unit": "Ton"
            },
            "Balance LPG Dom__%_LPG_Dom_Inventory": {
              "volume": [
                "30.0 %",
                "100.0 %",
                "100.0 %",
                "30.0 %",
                "30.0 %",
                "100.0 %",
                "30.0 %",
                "41.51 %",
                "52.3 %",
                "30.0 %",
                "30.0 %",
                "49.49 %"
              ],
              "unit": "%"
            },
            "Supply__Supply_Source": {
              "volume": [
                "Jul-21",
                "Aug-21",
                "Sep-21",
                "Oct-21",
                "Nov-21",
                "Dec-21",
                "Jan-21",
                "Feb-21",
                "Mar-21",
                "Apr-21",
                "May-21",
                "Jun-21"
              ],
              "unit": null
            },
            "Supply__C3_GSP RY": {
              "volume": [
                52.300000000000004,
                97.30000000000001,
                91.8,
                90.1,
                91.69999999999999,
                93.9,
                92.4,
                83.5,
                92.4,
                89.5,
                92.4,
                92.4
              ],
              "unit": "KT"
            },
            "Supply__LPG_GSP RY": {
              "volume": [
                165.95,
                165.99,
                152.76,
                138.9,
                163.4,
                171.1,
                168.08,
                152.97,
                167,
                163.4,
                168,
                168.5
              ],
              "unit": "KT"
            },
            "Supply__LPG_GSP RY__Petro": {
              "volume": [
                "date",
                "volume"
              ],
              "unit": "KT"
            },
            "Supply__LPG_GSP RY__Dom": {
              "volume": [
                "date",
                "volume"
              ],
              "unit": "KT"
            },
            "Supply__C3/LPG_GSP RY": {
              "volume": [
                218.25,
                263.29,
                244.56,
                229,
                255.1,
                265,
                260.48,
                236.47,
                259.4,
                252.9,
                260.4,
                260.9
              ],
              "unit": "KT"
            },
            "Supply__IRPC": {
              "volume": [
                1.2,
                0,
                1.2,
                1.2,
                1.2,
                1.2,
                1.2,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Supply__GC": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Supply__SPRC": {
              "volume": [
                5.78,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12
              ],
              "unit": "KT"
            },
            "Supply__PTTEP/LKB": {
              "volume": [
                5.55,
                5.735,
                5.735,
                5.55,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735
              ],
              "unit": "KT"
            },
            "Supply__GSP_KHM": {
              "volume": [
                13.95,
                8.99,
                14.66,
                15,
                15.5,
                15,
                15.08,
                14.87,
                14,
                15.5,
                15,
                15.5
              ],
              "unit": "KT"
            },
            "Supply__Total_Supply": {
              "volume": [
                244.73,
                284.13500000000005,
                272.27500000000003,
                256.87,
                283.65500000000003,
                293.055,
                288.615,
                263.195,
                285.255,
                280.255,
                287.255,
                288.255
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_GC(C3/LPG)_GSP RY": {
              "volume": [
                58.8,
                66.6486,
                58.8,
                58.8,
                58.8,
                58.8,
                58.8,
                58.8,
                58.8,
                58.8,
                58.8,
                58.8
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_**LPG_ROC_GSP RY": {
              "volume": [
                38.939214,
                10,
                33.1,
                16.7,
                9,
                44.4514,
                24.6486,
                48.7514,
                31.6,
                26.7,
                25.3,
                26.7
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_SCG LPG : 48 - 240 KT_GSP RY": {
              "volume": [
                38.939214,
                10,
                33.1,
                16.7,
                9,
                44.4514,
                24.6486,
                48.7514,
                31.6,
                26.7,
                25.3,
                26.7
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_SCG Additional LPG Tier 1 : 1 - 384 KT_GSP RY": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_SCG Additional LPG Tier 2 : 384.001 - 720 KT_GSP RY": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_GSP (LPG) to GC_GSP RY": {
              "volume": [
                0,
                7.8486,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PTTOR_MT ก่อนหัก import_dom": {
              "volume": [
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_Atlas_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_Atlas_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_BCP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_BCP_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_Big gas_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_Big gas_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_Chevron_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_ESSO_BRP": {
              "volume": [
                341.07924,
                302.60355,
                327,
                0,
                361.1,
                323.64256,
                359.90724,
                318.09598,
                341.1,
                346.80402,
                349.7,
                331.18639
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_ESSO_MT": {
              "volume": [
                0,
                0,
                0,
                347.95744,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_ESSO_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_IRPC_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_IRPC_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_Orchid_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PAP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PAP_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PAP_PTT TANK (Truck)": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PTTOR_BRP": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PTTOR_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PTTOR_PTT TANK (Truck)": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_PTTOR (orderless)_GSP RY": {
              "volume": [
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                2
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_SGP_MT": {
              "volume": [
                0,
                10,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_UGP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_UNO_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_WP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP RY_WP_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__Export_TBU_MT": {
              "volume": [
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                5
              ],
              "unit": "KT"
            },
            "Demand__GC_Atlas_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_Atlas_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_BCP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_BCP_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_ESSO_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_ESSO_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_IRPC_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_IRPC_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_Orchid_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_PAP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_PAP_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_PAP_PTT TANK (Truck)": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_PTTOR_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_PTTOR_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_PTTOR_PTT TANK (Truck)": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_WP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GC_WP_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__GSP KHM_PTTOR_GSP KHM": {
              "volume": [
                13.95,
                8.99,
                14.66,
                15,
                15.5,
                15,
                15.08,
                14.87,
                14,
                15.5,
                15,
                15.5
              ],
              "unit": "KT"
            },
            "Demand__IRPC_Atlas_IRPC": {
              "volume": [
                1.2,
                0,
                1.2,
                1.2,
                1.2,
                1.2,
                1.2,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__IRPC_PTTOR_IRPC": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__IRPC_WP_IRPC": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__PTTEP_PTTOR_PTTEP": {
              "volume": [
                5.55,
                5.735,
                5.735,
                5.55,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735,
                5.735
              ],
              "unit": "KT"
            },
            "Demand__SPRC_Atlas_SPRC": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__SPRC_PAP_SPRC": {
              "volume": [
                5.78,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12,
                6.12
              ],
              "unit": "KT"
            },
            "Demand__SPRC_PTTOR_SPRC": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__SPRC_SGP_MT": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand__SPRC_WP_SPRC": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_M.7 C3+LPG Total Demand_All Delivery Point": {
              "volume": [
                376.55924,
                342.44855,
                363.71500000000003,
                384.82744,
                398.65500000000003,
                360.69756,
                397.04224,
                353.82098,
                375.95500000000004,
                383.15902,
                385.555,
                367.54139000000004
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_M.7 LPG Total Demand_PTT TANK": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_M.7 LPG Total Demand_MT+BRP": {
              "volume": [
                346.07924,
                317.60355,
                332,
                352.95744,
                366.1,
                328.64256,
                364.90724,
                323.09598,
                346.1,
                351.80402,
                354.7,
                336.18639
              ],
              "unit": "KT"
            },
            "Demand M.7__GSP RY_M.7 C3+LPG Total Demand_หน้า GSP RY": {
              "volume": [
                79.878428,
                29.8486,
                68.2,
                35.4,
                20,
                90.9028,
                51.2972,
                99.5028,
                65.2,
                55.4,
                52.6,
                55.4
              ],
              "unit": "KT"
            },
            "Demand M.7__SPRC+EP+KHM_M.7_All Refinery": {
              "volume": [
                452.43766800000003,
                368.29715,
                427.915,
                416.22744,
                414.65500000000003,
                447.60036,
                444.33944,
                449.32378,
                437.15500000000003,
                434.55902000000003,
                434.155,
                418.94139000000007
              ],
              "unit": "KT"
            },
            "Demand M.7__GSP RY_M.7 C3+LPG Total Demand_All Delivery Point": {
              "volume": [
                345.07924,
                316.60355,
                331,
                351.95744,
                365.1,
                327.64256,
                363.90724,
                322.09598,
                345.1,
                350.80402,
                353.7,
                335.18639
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_PTTOR C3+LPG Total Demand_All Delivery Point": {
              "volume": [
                23.5,
                18.725,
                24.395,
                24.55,
                25.235,
                24.735,
                24.814999999999998,
                24.604999999999997,
                23.735,
                25.235,
                24.735,
                25.235
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_PTTOR C3+LPG หัก C3 Truck/Ordourant_All Delivery Point": {
              "volume": [
                374.55924,
                340.44855,
                361.71500000000003,
                382.82744,
                396.65500000000003,
                358.69756,
                395.04224,
                351.82098,
                373.95500000000004,
                381.15902,
                383.555,
                365.54139000000004
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_SGP+UGP LPG Total Demand_All Delivery Point": {
              "volume": [
                0,
                10,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_WP LPG Total Demand_All Delivery Point": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_Chevron LPG Total Demand_All Delivery Point": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_BCP LPG Total Demand_All Delivery Point": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_Big Gas LPG Total Demand_All Delivery Point": {
              "volume": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7__All Source_Atlas LPG Total Demand_All Delivery Point": {
              "volume": [
                1.2,
                0,
                1.2,
                1.2,
                1.2,
                1.2,
                1.2,
                0,
                0,
                0,
                0,
                0
              ],
              "unit": "KT"
            },
            "Demand M.7_All Source_Total Demand Petro + M.7_All Delivery Point": {
              "volume": [
                636.3217678,
                513.744893316,
                573.77626203,
                563.0739345000001,
                560.0603805882001,
                593.1014367100001,
                624.30619044,
                595.19608983,
                583.0779144400001,
                580.61325461,
                580.2310424,
                564.80663064
              ],
              "unit": "KT"
            }
          }
        }
      },
      "detail": ""
    };


    this.renderDataFromMergeAllocation(res);
  }


  renderDataFromMergeAllocation(mergeAlloData: any) {

    console.log("mergeAlloData >> ", mergeAlloData);
    if (mergeAlloData?.data) {
      this.optimizationDataGridC2.renderDataFromMergeAllo(mergeAlloData?.data?.Ethane);
      this.optimizationDataGridC3LPG.renderDataFromMergeAllo(mergeAlloData?.data?.c3lpg);
    }

  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  genVolumn(dataFormModel: any, dataToModel: any, dataNGL: any) {

    this.dataMaster.volumn = _.unionBy(_.cloneDeep(this.dataMaster.masterContract), (item) => [item.productName, item.sourceName, item.demandName, item.deliveryName].join())
    _.each(this.dataMaster.volumn, (item) => {
      let productName = 'Ethane';
      if (!this.getDataFormModel(dataFormModel, item, productName)) {
        return;
      }
      productName = 'Propane';
      if (!this.getDataFormModel(dataFormModel, item, productName)) {
        return;
      }
      // productName = 'CO2';
      // if (!this.getDataFormModel(dataFormModel, item, productName)) {
      //   return;
      // }
      productName = 'LPG';
      if (!this.getDataFormModel(dataFormModel, item, productName)) {
        return;
      }
      productName = 'NGL';
      if (!this.getDataFormModel(dataNGL, item, productName)) {
        return;
      }
      if (!this.getDataFormModel(dataFormModel, item, productName)) {
        return;
      }
      // productName = 'Pentane';
      // if (!this.getDataFormModel(dataFormModel, item, productName)) {

      //   return;
      // }
    })
    const dataCO2 = _.filter(this.dataMaster.volumn, (item) => {
      return item.productName === 'CO2'
    });

    _.each(dataCO2, (item) => {
      const dataTo = _.find(dataToModel.monthly_constrains, (itemTo) => {
        return itemTo.id === item.contractConditionOfSaleId;
      })
      if (dataTo) {
        _.each(this.listMonth, (i, index) => {
          item["M" + i.Month + i.Year] = dataTo.max[index];
        });
      }
    })

    const dataPentane = _.filter(this.dataMaster.volumn, (item) => {
      return item.productName === 'Pentane'
    });

    _.each(dataPentane, (item) => {
      const dataTo = _.find(dataToModel.abilitys_monthly, (itemTo) => {
        return itemTo.key.type === item.demandName;
      })
      if (dataTo) {
        _.each(this.listMonth, (i, index) => {
          item["M" + i.Month + i.Year] = dataTo.volume[index];
        });
      }
    })
  }
  getDataFormModel(dataFormModel: any, data: any, productName: any) {
    if (dataFormModel[productName]) {
      if (dataFormModel[productName].demand) {
        const dataModel = _.find(dataFormModel[productName].demand, (itemData) => {
          return itemData.id === data.contractConditionOfSaleId
        });
        if (dataModel) {
          _.each(this.listMonth, (i, index) => {
            data["M" + i.Month + i.Year] = dataModel.volume[index];
          });
          return false;
        }
      }
    }
    return true;
  }
}

