import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterContractComponent } from './master-contract.component';

describe('MasterContractComponent', () => {
  let component: MasterContractComponent;
  let fixture: ComponentFixture<MasterContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
