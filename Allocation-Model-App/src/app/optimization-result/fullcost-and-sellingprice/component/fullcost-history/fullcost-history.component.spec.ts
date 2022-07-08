import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcostHistoryComponent } from './fullcost-history.component';

describe('FullcostHistoryComponent', () => {
  let component: FullcostHistoryComponent;
  let fixture: ComponentFixture<FullcostHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullcostHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullcostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
