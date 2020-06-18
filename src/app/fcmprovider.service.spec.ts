import { TestBed } from '@angular/core/testing';

import { FcmproviderService } from './fcmprovider.service';

describe('FcmproviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FcmproviderService = TestBed.get(FcmproviderService);
    expect(service).toBeTruthy();
  });
});
