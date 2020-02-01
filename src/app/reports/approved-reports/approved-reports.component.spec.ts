import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedReportsComponent } from './approved-reports.component';

describe('ApprovedReportsComponent', () => {
  let component: ApprovedReportsComponent;
  let fixture: ComponentFixture<ApprovedReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
