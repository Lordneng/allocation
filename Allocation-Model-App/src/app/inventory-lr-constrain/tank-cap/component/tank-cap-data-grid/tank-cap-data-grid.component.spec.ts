import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankCapDataGridComponent } from './tank-cap-data-grid.component';

describe('TankCapDataGridComponent', () => {
  let component: TankCapDataGridComponent;
  let fixture: ComponentFixture<TankCapDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankCapDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankCapDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
