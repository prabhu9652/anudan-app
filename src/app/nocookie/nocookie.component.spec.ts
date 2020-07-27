import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NocookieComponent } from './nocookie.component';

describe('NocookieComponent', () => {
  let component: NocookieComponent;
  let fixture: ComponentFixture<NocookieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NocookieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NocookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
