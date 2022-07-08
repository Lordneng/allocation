import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LRByLegalHistoryComponent } from './lr-by-legal-history.component';

describe('LRByLegalHistoryComponent', () => {
  let component: LRByLegalHistoryComponent;
  let fixture: ComponentFixture<LRByLegalHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LRByLegalHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LRByLegalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
