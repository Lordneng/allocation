import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePriceDataGridComponent } from './reference-price-data-grid.component';

describe('ReferencePriceDataGridComponent', () => {
  let component: ReferencePriceDataGridComponent;
  let fixture: ComponentFixture<ReferencePriceDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencePriceDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePriceDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
