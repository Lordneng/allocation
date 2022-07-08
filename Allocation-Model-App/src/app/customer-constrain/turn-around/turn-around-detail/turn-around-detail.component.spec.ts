import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnAroundDetailComponent } from './turn-around-detail.component';

describe('TurnAroundDetailComponent', () => {
  let component: TurnAroundDetailComponent;
  let fixture: ComponentFixture<TurnAroundDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnAroundDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnAroundDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
