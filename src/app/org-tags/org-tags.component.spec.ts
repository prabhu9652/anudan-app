import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantTagsComponent } from './grant-tags.component';

describe('GrantTagsComponent', () => {
  let component: GrantTagsComponent;
  let fixture: ComponentFixture<GrantTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrantTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
