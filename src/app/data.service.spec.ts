import { TestBed, inject } from '@angular/core/testing';

import { GrantDataService } from './grant.data.service';

describe('GrantDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrantDataService]
    });
  });

  it('should be created', inject([GrantDataService], (service: GrantDataService) => {
    expect(service).toBeTruthy();
  }));
});
