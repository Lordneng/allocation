import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePriceComponent } from './reference-price.component';

describe('ReferencePriceComponent', () => {
  let component: ReferencePriceComponent;
  let fixture: ComponentFixture<ReferencePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
