import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeService } from './home.service';
import * as _ from 'lodash';
import { BehaviorSubject, pipe, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { ISidebar, SidebarService } from '../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, AfterViewInit {

  sidebar: ISidebar;
  subscription: Subscription;

  constructor(
    private loaderService: NgxSpinnerService,
    private dataService: HomeService,
    private sidebarService: SidebarService
  ) {
    // console.log('constructor');
  }
  ngOnInit() {
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );

    // console.log('ngOnInit');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.loaderService.hide();
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

  scroll(el: HTMLElement) {
    // console.log('scroll', el);
    el.scrollIntoView({ behavior: 'smooth' });
  }

}
