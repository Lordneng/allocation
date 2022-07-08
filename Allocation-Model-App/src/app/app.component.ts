import { Renderer2, Component } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import {
  SidebarService,
  ISidebar,
} from 'src/app/containers/layout/sidebar/sidebar.service';
import AutoComplete from 'devextreme/ui/autocomplete';
import DataGrid from 'devextreme/ui/data_grid';
import DateBox from 'devextreme/ui/date_box';
import Lookup from 'devextreme/ui/lookup';
import NumberBox from 'devextreme/ui/number_box';
import SelectBox from 'devextreme/ui/select_box';
import TagBox from 'devextreme/ui/tag_box';
import TextArea from 'devextreme/ui/text_area';
import TextBox from 'devextreme/ui/text_box';
import { AuthService } from './service/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { MasterMenuService } from './service/master-menu.service';
import { PermissionService } from './service/permision.service';
import * as _ from 'lodash';
import { IdleService } from './service/Idle-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sidebar: ISidebar;
  subscription: Subscription;
  title = 'App';
  userProfile: any = {};
  isAuthorized: boolean = false;
  dxUIDefaultOptions: any = {
    DateBox: {
      showClearButton: true,
      calendarOptions: {
        showTodayButton: true,
      },
      openOnFieldClick: false,
      useMaskBehavior: true,
      displayFormat: 'dd/MM/yyyy',
      dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
      onFocusIn: (e: any) => {
        // console.log('onFocusIn:e', e);
        if (e.element) {
          // console.log('onFocusIn-element', e.element);
          const htmlElm: HTMLElement = e.element as HTMLElement;
          // console.log('onFocusIn-htmlElm', htmlElm);
          const htmlInputElm: HTMLInputElement | null = htmlElm.querySelector(
            'input.dx-texteditor-input'
          );
          if (htmlInputElm && htmlInputElm.type !== 'hidden') {
            // console.log('onFocusIn-htmlInputElm', htmlInputElm);
            htmlInputElm.setSelectionRange(0, htmlInputElm.value.length);
            htmlInputElm.select();
          }
        }
      },
      onEnterKey: (e: any) => {
        if (e.component) {
          e.component.blur();
        }
      },
      onClosed: (e: any) => {
        if (e.component) {
          e.component.blur();
        }
      },
      // onFocusOut: function(e: any) {
      //   //  console.log('onFocusOut:e', e);
      //   setTimeout(function() {
      //     //  console.log('onFocusOut:e.component', e.component);
      //     e.component.close();
      //   }, 10);
      // }
    },

    SelectBox: {
      // displayExpr: (item: any) => {
      //   return item && '(' + item.Code + ')     ' + item.Name;
      // },
      itemTemplate: 'item',
      valueExpr: 'ID',
      placeholder: 'กรุณาเลือกข้อมูล',
      showClearButton: true,
      searchEnabled: true,
      readOnly: false,
    },
    Lookup: {
      placeholder: 'กรุณาเลือกข้อมูล',
      showClearButton: true,
      searchEnabled: true,
      readOnly: false,
      searchTimeout: 1,
      showDataBeforeSearch: true,
      showCancelButton: true,
      popupHeight: '300px',
      position: undefined,
    },
    TagBox: {
      showSelectionControls: true,
      applyValueMode: 'useButtons',
      displayExpr: 'Name',
      valueExpr: 'ID',
      placeholder: 'กรุณาเลือกข้อมูล',
      showClearButton: true,
      searchEnabled: true,
      readOnly: false,
    },
    TextBox: {
      showClearButton: true,
      placeholder: '',
      readOnly: false,
      onFocusIn: (e: any) => {
        // console.log('onFocusIn-1', e);
        if (e.element) {
          // console.log('onFocusIn-element', e.element);
          const htmlElm: HTMLElement = e.element as HTMLElement;
          // console.log('onFocusIn-htmlElm', htmlElm);
          const htmlInputElm: HTMLInputElement | null = htmlElm.querySelector(
            'input.dx-texteditor-input'
          );
          if (htmlInputElm && htmlInputElm.type !== 'hidden') {
            // console.log('onFocusIn-htmlInputElm', htmlInputElm);
            htmlInputElm.setSelectionRange(0, htmlInputElm.value.length);
            htmlInputElm.select();
          }
        }
      },
    },
    TextArea: {
      showClearButton: true,
      placeholder: '',
      readOnly: false,
      minHeight: '85px',
      stylingMode: 'outlined',
      autoResizeEnabled: true,
      onFocusIn: (e: any) => {
        // console.log('onFocusIn-1', e);
        if (e.element) {
          // console.log('onFocusIn-element', e.element);
          const htmlElm: HTMLElement = e.element as HTMLElement;
          // console.log('onFocusIn-htmlElm', htmlElm);
          const htmlInputElm: HTMLInputElement | null = htmlElm.querySelector(
            'input.dx-texteditor-input'
          );
          if (htmlInputElm && htmlInputElm.type !== 'hidden') {
            // console.log('onFocusIn-htmlInputElm', htmlInputElm);
            htmlInputElm.setSelectionRange(0, htmlInputElm.value.length);
            htmlInputElm.select();
          }
        }
      },
    },
    NumberBox: {
      step: 1,
      // format: '#,##0.00',
      onFocusIn: (e: any) => {
        // console.log('onFocusIn-1', e);
        if (e.element) {
          // console.log('onFocusIn-element', e.element);
          const htmlElm: HTMLElement = e.element as HTMLElement;
          // console.log('onFocusIn-htmlElm', htmlElm);
          const htmlInputElm: HTMLInputElement | null = htmlElm.querySelector(
            'input.dx-texteditor-input'
          );
          if (htmlInputElm && htmlInputElm.type !== 'hidden') {
            // console.log('onFocusIn-htmlInputElm', htmlInputElm);
            htmlInputElm.setSelectionRange(0, htmlInputElm.value.length);
            htmlInputElm.select();
          }
        }
      },
    },
    DataGrid: {
      allowColumnReordering: true,
      allowColumnResizing: true,
      showBorders: true,
      showColumnLines: true,
      showRowLines: true,
      focusedRowEnabled: true,
      columnAutoWidth: true,
      columnResizingMode: 'nextColumn',
      hoverStateEnabled: true,
      sorting: { mode: 'multiple' },
      // rowAlternationEnabled: false,
      // wordWrapEnabled: true,
      keyExpr: 'id',
      noDataText: 'ไม่มีข้อมูล กดค้นหาเพื่อแสดงข้อมูล',
      scrolling: {
        useNative: true,
      },
      export: {
        enabled: true,
      },
      loadPanel: {
        enabled: false,
      },
      groupPanel: {
        visible: false,
        emptyPanelText: 'ลากคอลัมน์มาวางที่นี่ เพื่อจัดกรุ๊ปข้อมูล',
      },
      editing: {
        texts: {
          addRow: 'เพิ่มรายการ',
          confirmDeleteTitle: 'ยืนยันลบ!',
          confirmDeleteMessage: 'คุณต้องการลบข้อมูลรายการนี้ ใช่หรือไม่?',
          saveRowChanges: 'OK',
        },
      },
      headerFilter: {
        visible: true,
      },
      filterRow: {
        visible: true,
      },
      columnChooser: {
        enabled: true,
        emptyPanelText: 'ลากคอลัมน์มาวางที่นี่ เพื่อซ่อน',
        title: 'เลือกคอลัมน์ที่ต้องการซ่อน',
      },
      showInColumnChooser: { enabled: false },
      // summary: {
      //   recalculateWhileEditing: true,
      //   groupItems: [
      //     {
      //       column: 'NetAmount',
      //       displayFormat: '{0}',
      //       showInGroupFooter: true,
      //       summaryType: 'sum',
      //       valueFormat: '#,##0.00'
      //     }
      //   ],
      //   totalItems: [
      //     {
      //       column: 'NetAmount',
      //       displayFormat: '{0}',
      //       summaryType: 'sum',
      //       valueFormat: '#,##0.00'
      //     }
      //   ]
      // },
      selection: {
        mode: 'none',
      },
      paging: {
        enabled: true,
        pageSize: 10,
      },
      pager: {
        visible: true,
        showPageSizeSelector: true,
        allowedPageSizes: [10, 20, 50],
        showInfo: true,
      },
    },
    Switch: {
      width: '50px',
    },
    AutoComplete: {
      placeholder: 'กรุณาเลือกข้อมูล',
      showClearButton: true,
      readOnly: false,
      minSearchLength: 0,
      searchTimeout: 1,
      openOnFieldClick: true,
      onFocusIn: (e: any) => {
        // console.log('onFocusIn-1', e);
        if (e.element) {
          // console.log('onFocusIn-element', e.element);
          const htmlElm: HTMLElement = e.element as HTMLElement;
          // console.log('onFocusIn-htmlElm', htmlElm);
          const htmlInputElm: HTMLInputElement | null = htmlElm.querySelector(
            'input.dx-texteditor-input'
          );
          if (htmlInputElm && htmlInputElm.type !== 'hidden') {
            // console.log('onFocusIn-htmlInputElm', htmlInputElm);
            htmlInputElm.setSelectionRange(0, htmlInputElm.value.length);
            htmlInputElm.select();
          }
        }
      },
    },
  };
  constructor(
    private renderer: Renderer2,
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private permissionService: PermissionService,
    private idleService: IdleService
  ) {
    this.authService.isAuthorized$.subscribe((nextValue) => {
      this.isAuthorized = nextValue ? nextValue : false;
      if (!this.isAuthorized) {
        this.router.navigate(['login']);
      } else {
      }
    });

    // this.authService.checkAuthorizedUser().subscribe((result) => {
    //   console.log('checkAuthorizedUser', result);
    // });
    this.setDxUIDefaultOptions();

    const idleTimeoutInSeconds: number = 30;
    this.idleService.startWatching(idleTimeoutInSeconds).subscribe((isTimeOut: boolean) => {
      if (isTimeOut) {
        console.log("checking session expire.");
        this.authService.checkAuthorizedUser().subscribe((result) => {
          // console.log('checkAuthorizedUser', result);
          if (!result) {
            this.idleService.stopTimer();
            this.authService.logout().subscribe(() => {
              this.router.navigate(['login']);
            });
          }
        });
      }
    });
  }

  ngOnInit(): void {

    this.setMenu();
    //Access Menu Redirect to root url
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }
  setMenu() {
    this.router.events.subscribe(async (e) => {
      if (e instanceof NavigationEnd) {
        console.log('e.url', e.url);

        if (e.url == '/login') { this.idleService.stopTimer(); return; }
        this.authService.menu$.subscribe(res => {
          if (res && res.length > 0) {
            let menuUrl: any = e.url.split('/');
            if (menuUrl.length > 3) {
              // menuUrl = menuUrl[1] + '/' + menuUrl[2] + '/' + menuUrl[3];
              menuUrl = '/' + menuUrl[1] + '/' + menuUrl[2];
            }
            else {
              menuUrl = e.url;
            }

            // let level1 = _.filter(_.cloneDeep(res[0].menuLvel1), { menuUrl: e.url.split(';')[0], });
            // let level2 = _.filter(_.cloneDeep(res[0].menuLvel2), { menuUrl: e.url.split(';')[0], });
            // let level3 = _.filter(_.cloneDeep(res[0].menuLvel3), { menuUrl: e.url.split(';')[0], });
            let thisMenu;
            let level1 = _.filter(_.cloneDeep(res[0].menuLvel1), { menuUrl: menuUrl.split(';')[0], });
            let level2 = _.filter(_.cloneDeep(res[0].menuLvel2), { menuUrl: menuUrl.split(';')[0], });
            let level3 = _.filter(_.cloneDeep(res[0].menuLvel3), { menuUrl: menuUrl.split(';')[0], });

            if (level1.length == 1) {
              thisMenu = level1;
            }

            if (level2.length == 1) {
              thisMenu = level2;
            }

            if (level3.length == 1) {
              thisMenu = level3;
            }

            if (level1.length == 0 && level2.length == 0 && level3.length == 0) {
              //this.router.navigate(['/']);
            }

            console.log('this.thisMenu ----> ', menuUrl.split(';')[0]);

            if (thisMenu && thisMenu.length) {
              this.authService.menuAll.currentMenu = thisMenu[0];
            }
            this.authService.menuAll$.next(this.authService.menuAll);
          }

        })


      }
    });
  }
  retrieveMasterData(): Observable<any> {
    // if (!this.userProfile) {
    //   window.location.reload();
    // }
    const masterPermission = this.permissionService.getbyUserGruopId(this.userProfile.userId);
    return forkJoin([masterPermission]);
  }

  setDxUIDefaultOptions() {
    Lookup.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.Lookup,
    });

    TextBox.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.TextBox,
    });

    TextArea.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.TextArea,
    });

    NumberBox.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.NumberBox,
    });

    SelectBox.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.SelectBox,
    });

    DateBox.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.DateBox,
    });

    TagBox.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.TagBox,
    });

    DataGrid.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.DataGrid,
    });

    AutoComplete.defaultOptions({
      device: { deviceType: 'desktop' },
      options: this.dxUIDefaultOptions.AutoComplete,
    });
  }
}
