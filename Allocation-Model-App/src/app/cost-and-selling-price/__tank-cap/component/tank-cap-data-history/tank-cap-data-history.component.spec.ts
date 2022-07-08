import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankCapDataHistoryComponent } from './tank-cap-data-history.component';

describe('TankCapDataHistoryComponent', () => {
  let component: TankCapDataHistoryComponent;
  let fixture: ComponentFixture<TankCapDataHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankCapDataHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankCapDataHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
