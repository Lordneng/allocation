import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePriceHistoryComponent } from './reference-price-history.component';

describe('ReferencePriceHistoryComponent', () => {
  let component: ReferencePriceHistoryComponent;
  let fixture: ComponentFixture<ReferencePriceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencePriceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePriceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
