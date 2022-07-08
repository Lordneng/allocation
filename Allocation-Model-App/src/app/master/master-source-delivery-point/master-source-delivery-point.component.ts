import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-master-source-delivery-point',
  templateUrl: './master-source-delivery-point.component.html',
  styleUrls: ['./master-source-delivery-point.component.css']
})
export class MasterSourceDeliveryPointComponent implements OnInit {

  sidebar: ISidebar;
  subscription: Subscription;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {

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

}
