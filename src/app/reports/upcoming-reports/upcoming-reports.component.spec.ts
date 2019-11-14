import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingReportsComponent } from './upcoming-reports.component';

describe('UpcomingReportsComponent', () => {
  let component: UpcomingReportsComponent;
  let fixture: ComponentFixture<UpcomingReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
