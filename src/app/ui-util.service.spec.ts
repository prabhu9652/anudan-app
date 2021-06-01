import { TestBed } from '@angular/core/testing';

import { UiUtilService } from './ui-util.service';

describe('UiUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UiUtilService = TestBed.get(UiUtilService);
    expect(service).toBeTruthy();
  });
});
