import { TestBed } from '@angular/core/testing';

import { DisplayContactService } from './display-contact.service';

describe('DisplayContactService', () => {
  let service: DisplayContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
