import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedReportsComponent } from './submitted-reports.component';

describe('SubmittedReportsComponent', () => {
  let component: SubmittedReportsComponent;
  let fixture: ComponentFixture<SubmittedReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
