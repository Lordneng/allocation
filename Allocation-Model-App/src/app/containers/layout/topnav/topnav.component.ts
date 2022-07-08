import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService, ISidebar } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { BaseService } from 'src/app/service/base.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
})
export class TopnavComponent implements OnInit, OnDestroy {
  buyUrl = '';
  adminRoot = '';
  sidebar: ISidebar;
  subscription: Subscription;
  // displayName = 'Sarah Cortney';
  displayName = '';
  // languages: Language[];
  currentLanguage: string;
  isSingleLang;
  isFullScreen = false;
  isDarkModeActive = false;
  searchKey = '';

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
    //private langService: LangService
  ) {
    // this.languages = this.langService.supportedLanguages;
    // this.currentLanguage = this.langService.languageShorthand;
    // this.isSingleLang = this.langService.isSingleLang;
    // this.isDarkModeActive = getThemeColor().indexOf('dark') > -1 ? true : false;
  }

  onDarkModeChange(event): void {
    // let color = getThemeColor();
    // if (color.indexOf('dark') > -1) {
    //   color = color.replace('dark', 'light');
    // } else if (color.indexOf('light') > -1) {
    //   color = color.replace('light', 'dark');
    // }
    // setThemeColor(color);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 200);
  }

  fullScreenClick(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  handleFullscreen(event): void {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  onLanguageChange(lang): void {
    // this.langService.language = lang.code;
    // this.currentLanguage = this.langService.languageShorthand;
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      const userProfile = this.authService.getUserProfile();
      // console.log("userProfile :: ", userProfile);
      this.displayName = userProfile?.fullName;
      // if (await this.authService.getUserProfile()) {
      //   this.displayName = await this.authService.getUserProfile().then((user) => {
      //     return user.displayName;
      //   });
      // }
    }, 100);

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

  mobileMenuButtonClick = (
    event: { stopPropagation: () => void },
    containerClassnames: string
  ) => {
    if (event) {
      event.stopPropagation();
    }
    this.sidebarService.clickOnMobileMenu(containerClassnames);
  }

  onSignOut(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  searchKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    } else if (event.key === 'Escape') {
      const input = document.querySelector('.mobile-view');
      if (input && input.classList) {
        input.classList.remove('mobile-view');
      }
      this.searchKey = '';
    }
  }

  searchAreaClick(event): void {
    event.stopPropagation();
  }
  searchClick(event): void {
    // if (window.innerWidth < environment.menuHiddenBreakpoint) {
    //   let elem = event.target;
    //   if (!event.target.classList.contains('search')) {
    //     if (event.target.parentElement.classList.contains('search')) {
    //       elem = event.target.parentElement;
    //     } else if (
    //       event.target.parentElement.parentElement.classList.contains('search')
    //     ) {
    //       elem = event.target.parentElement.parentElement;
    //     }
    //   }

    //   if (elem.classList.contains('mobile-view')) {
    //     this.search();
    //     elem.classList.remove('mobile-view');
    //   } else {
    //     elem.classList.add('mobile-view');
    //   }
    // } else {
    //   this.search();
    // }
    // event.stopPropagation();
  }

  search(): void {
    if (this.searchKey && this.searchKey.length > 1) {
      this.router.navigate([this.adminRoot + '/#'], {
        queryParams: { key: this.searchKey.toLowerCase().trim() },
      });
      this.searchKey = '';
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event): void {
    const input = document.querySelector('.mobile-view');
    if (input && input.classList) {
      input.classList.remove('mobile-view');
    }
    this.searchKey = '';
  }
}
