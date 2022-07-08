import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPentaneComponent } from './ability-pentane.component';

describe('AbilityPentaneComponent', () => {
  let component: AbilityPentaneComponent;
  let fixture: ComponentFixture<AbilityPentaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPentaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPentaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
