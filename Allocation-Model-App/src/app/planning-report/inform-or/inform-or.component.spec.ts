import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformORComponent } from './inform-or.component';

describe('InformORComponent', () => {
  let component: InformORComponent;
  let fixture: ComponentFixture<InformORComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformORComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
