import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSectionsComponent } from './report-sections.component';

describe('ReportSectionsComponent', () => {
  let component: ReportSectionsComponent;
  let fixture: ComponentFixture<ReportSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
