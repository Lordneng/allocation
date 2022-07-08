import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PentaneComponent } from './pentane.component';

describe('PentaneComponent', () => {
  let component: PentaneComponent;
  let fixture: ComponentFixture<PentaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PentaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PentaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
