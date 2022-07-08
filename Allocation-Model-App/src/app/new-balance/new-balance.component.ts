import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-new-balance',
  templateUrl: './new-balance.component.html',
  styleUrls: ['./new-balance.component.css']
})
export class NewBalanceComponent implements OnInit {

  sidebar: ISidebar;
  subscription: Subscription;
  dataInfo: any = {};
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor(
    private hotkeysService: HotkeysService,
    private router: Router,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private sidebarService: SidebarService,) { }

  ngOnInit(): void {
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
  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }
  searchClick() {
    this.loaderService.show();

    this.modalRef.hide();
  }
  searchCancelClick() {
    // this.date = this.dateOld;
    this.modalRef.hide();
  }
}
