import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPentaneDataHistoryComponent } from './ability-pentane-data-history.component';

describe('AbilityPentaneDataHistoryComponent', () => {
  let component: AbilityPentaneDataHistoryComponent;
  let fixture: ComponentFixture<AbilityPentaneDataHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPentaneDataHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPentaneDataHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
