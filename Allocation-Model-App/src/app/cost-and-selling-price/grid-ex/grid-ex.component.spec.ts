import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridExComponent } from './grid-ex.component';

describe('ReportComponent', () => {
  let component: GridExComponent;
  let fixture: ComponentFixture<GridExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
