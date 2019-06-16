import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomsheetAttachmentsComponent } from './bottomsheetAttachments.component';

describe('BottomsheetAttachmentsComponent', () => {
  let component: BottomsheetAttachmentsComponent;
  let fixture: ComponentFixture<BottomsheetAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomsheetAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomsheetAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
