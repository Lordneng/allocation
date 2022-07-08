import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeHistoryComponent } from './Volume-history.component';

describe('VolumeHistoryComponent', () => {
  let component: VolumeHistoryComponent;
  let fixture: ComponentFixture<VolumeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
