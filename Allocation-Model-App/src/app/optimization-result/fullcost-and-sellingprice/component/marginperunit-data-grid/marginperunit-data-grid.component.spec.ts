import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginperunitDataGridComponent } from './marginperunit-data-grid.component';

describe('MarginperunitDataGridComponent', () => {
  let component: MarginperunitDataGridComponent;
  let fixture: ComponentFixture<MarginperunitDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginperunitDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginperunitDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
