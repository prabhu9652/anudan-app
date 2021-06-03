import { TestBed } from '@angular/core/testing';

import { WfvalidationService } from './wfvalidation.service';

describe('WfvalidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WfvalidationService = TestBed.get(WfvalidationService);
    expect(service).toBeTruthy();
  });
});
