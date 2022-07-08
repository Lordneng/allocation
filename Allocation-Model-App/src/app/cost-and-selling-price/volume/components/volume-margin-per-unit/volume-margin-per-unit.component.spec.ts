import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeMarginPerUnitComponent } from './Volume-margin-per-unit.component';

describe('VolumeMarginPerUnitComponent', () => {
  let component: VolumeMarginPerUnitComponent;
  let fixture: ComponentFixture<VolumeMarginPerUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeMarginPerUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeMarginPerUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
