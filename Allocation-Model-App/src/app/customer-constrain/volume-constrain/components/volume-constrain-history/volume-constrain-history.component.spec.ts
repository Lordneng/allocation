import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeConstrainHistoryComponent } from './volume-constrain-history.component';

describe('VolumeConstrainHistoryComponent', () => {
  let component: VolumeConstrainHistoryComponent;
  let fixture: ComponentFixture<VolumeConstrainHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeConstrainHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeConstrainHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
