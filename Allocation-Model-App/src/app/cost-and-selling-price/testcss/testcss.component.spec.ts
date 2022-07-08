import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcssComponent } from './testcss.component';

describe('TestcssComponent', () => {
  let component: TestcssComponent;
  let fixture: ComponentFixture<TestcssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
