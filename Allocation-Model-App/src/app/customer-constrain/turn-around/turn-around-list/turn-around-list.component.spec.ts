import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnAroundListComponent } from './turn-around-list.component';

describe('TurnAroundListComponent', () => {
  let component: TurnAroundListComponent;
  let fixture: ComponentFixture<TurnAroundListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnAroundListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnAroundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
