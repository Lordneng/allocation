import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionSettingComponent } from './condition-setting.component';

describe('ConditionSettingComponent', () => {
  let component: ConditionSettingComponent;
  let fixture: ComponentFixture<ConditionSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
