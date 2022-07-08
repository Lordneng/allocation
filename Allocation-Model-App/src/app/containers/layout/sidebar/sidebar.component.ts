import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SidebarService, ISidebar } from './sidebar.service';
import menuItems, { IMenuItem } from 'src/app/constants/menu';
import { Subscription } from 'rxjs';
import { MasterMenuService } from 'src/app/service/master-menu.service';
import * as _ from 'lodash';
import { PermissionService } from 'src/app/service/permision.service';
import { AuthService } from 'src/app/service/auth.service';
import { AppComponent } from '../../../app.component';
// import { _ } from 'ag-grid-community';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  // menuItems: IMenuItem[] = menuItems;
  menuItems: IMenuItem[];
  selectedParentMenu = '';
  viewingParentMenu = '';
  currentUrl: string;
  userProfile: any;

  sidebar: ISidebar;
  subscription: Subscription;
  closedCollapseList = [];
  currentMenu: string = null;

  currentUser = null;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private masterMenuService: MasterMenuService,
    private permissionService: PermissionService,
    private authService: AuthService
  ) {
    // this.authService.getUser().then((user) => {
    //   this.currentUser = user;
    // });

    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe((event) => {
        const path = this.router.url.split('?')[0];
        const paramtersLen = Object.keys(event.snapshot.params).length;
        const pathArr = path
          .split('/')
          .slice(0, path.split('/').length - paramtersLen);
        this.currentUrl = pathArr.join('/');
      });

    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const { containerClassnames } = this.sidebar;
        this.selectMenu();
        this.toggle();
        this.sidebarService.setContainerClassnames(
          1,
          containerClassnames,
          this.sidebar.selectedMenuHasSubItems
        );
        window.scrollTo(0, 0);
      });
  }

  async ngOnInit(): Promise<void> {
    this.getMenus(() => {

    });
    this.userProfile = this.authService.getUserProfile();

    console.log('this.userProfile', this.userProfile);

    // setTimeout(() => {
    //   this.selectMenu();
    //   const { containerClassnames } = this.sidebar;
    //   const nextClasses = this.getMenuClassesForResize(containerClassnames);
    //   this.sidebarService.setContainerClassnames(
    //     1,
    //     nextClasses.join(' '),
    //     this.sidebar.selectedMenuHasSubItems
    //   );
    //   this.isCurrentMenuHasSubItem();
    // }, 100);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      setTimeout(() => {
        this.selectMenu();
        const { containerClassnames } = this.sidebar;
        const nextClasses = this.getMenuClassesForResize(containerClassnames);
        this.sidebarService.setContainerClassnames(
          1,
          nextClasses.join(' '),
          this.sidebar.selectedMenuHasSubItems
        );
        this.isCurrentMenuHasSubItem();
      }, 100);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  waitForOneSecond() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('I promise to return after one second!');
      }, 1000);
    });
  }

  async getMenus(calback): Promise<void> {

    this.authService.menuAll$.subscribe(res => {
      if (res) {
        let resData: any = [];
        if (res && res.length > 0) {

          console.log('res[0]', res[0]);

          _.each(res[0].menuLvel1, (menu1) => {
            let iMenu: any = [];
            iMenu.id = menu1['menulevel1Id'];
            iMenu.icon = menu1['menuIcon'];
            iMenu.label = menu1['menuName'];
            iMenu.to = menu1['menuUrl'];
            iMenu.subs = [];

            let level2 = _.filter(_.cloneDeep(res[0].menuLvel2), {
              menulevel1Id: menu1['menulevel1Id'],
            });

            _.each(level2, (menu2) => {
              let iMenu2: any = [];
              iMenu2.id = menu2['menulevel2Id'];
              iMenu2.icon = menu2['menuIcon'];
              iMenu2.label = menu2['menuName'];
              iMenu2.to = menu2['menuUrl'];
              iMenu2.subs = [];

              let level3 = _.filter(_.cloneDeep(res[0].menuLvel3), {
                menulevel2Id: menu2['menulevel2Id'],
              });

              _.each(level3, (menu3) => {
                let iMenu3: any = [];
                iMenu3.id = menu3['menulevel3Id'];
                iMenu3.icon = menu3['menuIcon'];
                iMenu3.label = menu3['menuName'];
                iMenu3.to = menu3['menuUrl'];

                iMenu2.subs.push(iMenu3);
              });

              iMenu.subs.push(iMenu2);
            });

            resData.push(iMenu);
          });

        }
        this.menuItems = resData;
        if (calback) {
          calback();
        }
      }

    });

  }

  selectMenu(): void {
    this.selectedParentMenu = this.findParentInPath(this.currentUrl) || '';
    this.isCurrentMenuHasSubItem();
  }

  findParentInPath(path): any {
    if (!(this.menuItems && this.menuItems.length > 0)) {
      return undefined;

    }
    const foundedMenuItem = this.menuItems.find((x) => x.to === path);
    if (!foundedMenuItem) {
      if (path && path.split('/').length > 1) {
        const pathArr = path.split('/');
        return this.findParentInPath(
          pathArr.slice(0, pathArr.length - 1).join('/')
        );
      } else {
        return undefined;
      }
    } else {
      return path;
    }
  }

  isCurrentMenuHasSubItem(): boolean {
    const { containerClassnames } = this.sidebar;
    if (!this.menuItems) {
      return false;
    }
    const menuItem = this.menuItems.find(
      (x) => x.to === this.selectedParentMenu
    );
    const isCurrentMenuHasSubItem =
      menuItem && menuItem.subs && menuItem.subs.length > 0 ? true : false;
    if (isCurrentMenuHasSubItem !== this.sidebar.selectedMenuHasSubItems) {
      if (!isCurrentMenuHasSubItem) {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          false
        );
      } else {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          true
        );
      }
    }
    return isCurrentMenuHasSubItem;
  }

  changeSelectedParentHasNoSubmenu(parentMenu: string): void {
    const { containerClassnames } = this.sidebar;
    this.selectedParentMenu = parentMenu;
    this.viewingParentMenu = parentMenu;
    this.sidebarService.changeSelectedMenuHasSubItems(false);
    this.sidebarService.setContainerClassnames(0, containerClassnames, false);
  }

  openSubMenu(
    event: { stopPropagation: () => void },
    menuItem: IMenuItem
  ): void {
    if (event) {
      event.stopPropagation();
    }
    const { containerClassnames, menuClickCount } = this.sidebar;

    // ซ่อน sub menu หากกดเมนูเดิมซ้ำ
    this.currentMenu = (!this.currentMenu ? menuItem.id : this.currentMenu);
    if (this.currentMenu === menuItem.id) {
      this.sidebarService.setContainerClassnames(
        0,
        'menu-default sub-hidden',
        null
      );
    }

    this.currentMenu = menuItem.id;
    const selectedParent = menuItem.to;
    const hasSubMenu = menuItem.subs && menuItem.subs.length > 0;
    this.sidebarService.changeSelectedMenuHasSubItems(hasSubMenu);
    if (!hasSubMenu) {
      this.viewingParentMenu = selectedParent;
      this.selectedParentMenu = selectedParent;
      this.toggle();
    } else {
      const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter((x) => x !== '')
        : '';

      if (!currentClasses.includes('menu-mobile')) {
        if (
          currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          this.sidebarService.setContainerClassnames(
            3,
            containerClassnames,
            hasSubMenu
          );
        } else if (
          currentClasses.includes('menu-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.sidebarService.setContainerClassnames(
            2,
            containerClassnames,
            hasSubMenu
          );
        } else if (
          currentClasses.includes('menu-default') &&
          !currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          // console.log("containerClassnames >> ", containerClassnames);
          this.sidebarService.setContainerClassnames(
            0,
            containerClassnames,
            hasSubMenu
          );
        }
      } else {
        this.sidebarService.addContainerClassname(
          'sub-show-temporary',
          containerClassnames
        );
      }
      this.viewingParentMenu = selectedParent;
    }
  }

  toggle(): void {
    const { containerClassnames, menuClickCount } = this.sidebar;
    const currentClasses = containerClassnames
      .split(' ')
      .filter((x) => x !== '');
    if (currentClasses.includes('menu-sub-hidden') && menuClickCount === 3) {
      this.sidebarService.setContainerClassnames(
        2,
        containerClassnames,
        this.sidebar.selectedMenuHasSubItems
      );
    } else if (
      currentClasses.includes('menu-hidden') ||
      currentClasses.includes('menu-mobile')
    ) {
      if (!(menuClickCount === 1 && !this.sidebar.selectedMenuHasSubItems)) {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          this.sidebar.selectedMenuHasSubItems
        );
      }
    }
  }

  toggleCollapse(id: string): void {
    if (this.closedCollapseList.includes(id)) {
      this.closedCollapseList = this.closedCollapseList.filter((x) => x !== id);
    } else {
      this.closedCollapseList.push(id);
    }
  }

  getMenuClassesForResize(classes: string): string[] {
    let nextClasses = classes.split(' ').filter((x: string) => x !== '');
    const windowWidth = window.innerWidth;

    if (windowWidth < this.sidebarService.menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile');
    } else if (windowWidth < this.sidebarService.subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden');
      }
    } else {
      nextClasses = nextClasses.filter((x: string) => x !== 'menu-mobile');
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter(
          (x: string) => x !== 'menu-sub-hidden'
        );
      }
    }
    return nextClasses;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event): void {
    this.viewingParentMenu = '';
    this.selectMenu();
    this.toggle();
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(event): void {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = this.sidebar;
    const nextClasses = this.getMenuClassesForResize(containerClassnames);
    this.sidebarService.setContainerClassnames(
      1,
      nextClasses.join(' '),
      this.sidebar.selectedMenuHasSubItems
    );
    this.isCurrentMenuHasSubItem();
  }

  menuClicked(e: MouseEvent): void {
    e.stopPropagation();
  }

  // tslint:disable-next-line:no-shadowed-variable
  filteredMenuItems(menuItems: IMenuItem[]): IMenuItem[] {
    return menuItems ? menuItems : [];
  }

  menuButtonClick = (
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string
  ) => {
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
}
