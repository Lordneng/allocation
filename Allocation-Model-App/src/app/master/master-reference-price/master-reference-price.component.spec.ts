import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterReferencePriceComponent } from './master-reference-price.component';

describe('MasterReferencePriceComponent', () => {
  let component: MasterReferencePriceComponent;
  let fixture: ComponentFixture<MasterReferencePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterReferencePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterReferencePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
