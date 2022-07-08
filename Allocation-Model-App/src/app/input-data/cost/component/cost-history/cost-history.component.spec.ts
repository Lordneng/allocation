import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostHistoryComponent } from './cost-history.component';

describe('CostHistoryComponent', () => {
  let component: CostHistoryComponent;
  let fixture: ComponentFixture<CostHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
