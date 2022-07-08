import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityRefineryHistoryComponent } from './ability-refinery-history.component';

describe('AbilityRefineryHistoryComponent', () => {
  let component: AbilityRefineryHistoryComponent;
  let fixture: ComponentFixture<AbilityRefineryHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityRefineryHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityRefineryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
