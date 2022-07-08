import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid-ex',
  templateUrl: './grid-ex.component.html',
  styleUrls: ['./grid-ex.component.css'],
})
export class GridExComponent implements OnInit {
  columns = [{ name: 'Greeting', prop: 'name' }, { prop: 'details' }];
  rows = [
    { name: 'I am', details: 'Angular' },
    { name: 'Hello', details: 'Angular' },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
