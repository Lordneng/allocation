import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeConstrainComponent } from './volume-constrain.component';

describe('VolumeConstrainComponent', () => {
  let component: VolumeConstrainComponent;
  let fixture: ComponentFixture<VolumeConstrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeConstrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeConstrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
