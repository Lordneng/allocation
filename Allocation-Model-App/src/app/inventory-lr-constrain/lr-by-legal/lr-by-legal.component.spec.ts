import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LRByLegalComponent } from './lr-by-legal.component';

describe('LRByLegalComponent', () => {
  let component: LRByLegalComponent;
  let fixture: ComponentFixture<LRByLegalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LRByLegalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LRByLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
