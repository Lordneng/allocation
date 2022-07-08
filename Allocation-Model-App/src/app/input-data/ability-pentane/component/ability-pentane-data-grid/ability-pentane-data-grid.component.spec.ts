import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPentaneDataGridComponent } from './ability-pentane-data-grid.component';

describe('AbilityPentaneDataGridComponent', () => {
  let component: AbilityPentaneDataGridComponent;
  let fixture: ComponentFixture<AbilityPentaneDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPentaneDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPentaneDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
