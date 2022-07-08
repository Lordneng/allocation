import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankCapComponent } from './tank-cap.component';

describe('TankCapComponent', () => {
  let component: TankCapComponent;
  let fixture: ComponentFixture<TankCapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankCapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
