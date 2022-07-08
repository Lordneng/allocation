import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSourceListComponent } from './master-source-list.component';

describe('MasterSourceListComponent', () => {
  let component: MasterSourceListComponent;
  let fixture: ComponentFixture<MasterSourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSourceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
