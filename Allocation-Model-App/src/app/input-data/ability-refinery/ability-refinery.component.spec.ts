import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityRefineryComponent } from './ability-refinery.component';

describe('AbilityRefineryComponent', () => {
  let component: AbilityRefineryComponent;
  let fixture: ComponentFixture<AbilityRefineryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityRefineryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityRefineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
