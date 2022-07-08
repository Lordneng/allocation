import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReferencePriceDataFromSmartPriceGridComponent } from '../reference-price-data-from-smart-price-grid/reference-price-data-from-smart-price-grid.component';

@Component({
  selector: 'app-reference-price-data-from-smart-price',
  templateUrl: './reference-price-data-from-smart-price.component.html',
  styleUrls: ['./reference-price-data-from-smart-price.component.css']
})
export class ReferencePriceDataFromSmartPriceComponent implements OnInit {

  date: any;
  dateOld: any;
  modalRef: BsModalRef;
  year: any = 2022;
  month: any = '';
  dataInfo: any = {};
  @Output() onEventClick = new EventEmitter();

  @ViewChild('referencePriceDataSmartPriceGrid') referencePriceDataSmartPriceGrid: ReferencePriceDataFromSmartPriceGridComponent;

  constructor(private loaderService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  onYearChange($event) {
    this.year = $event;
    this.yearChange();
  }

  yearChange() {
    this.referencePriceDataSmartPriceGrid.onYearChange(this.year, (dataInfo) => {
        this.dataInfo = dataInfo
    } );
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format('yyyy');
    this.dateOld = this.date;
    this.yearChange();
    this.modalRef.hide();
  }
  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }
  onSmartPriceForecastClick(data) {
    this.onEventClick.emit(data);

  }
}
