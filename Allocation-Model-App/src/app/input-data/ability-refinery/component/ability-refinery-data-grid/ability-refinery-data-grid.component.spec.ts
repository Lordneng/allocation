import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityRefineryDataGridComponent } from './ability-refinery-data-grid.component';

describe('AbilityRefineryDataGridComponent', () => {
  let component: AbilityRefineryDataGridComponent;
  let fixture: ComponentFixture<AbilityRefineryDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityRefineryDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityRefineryDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
