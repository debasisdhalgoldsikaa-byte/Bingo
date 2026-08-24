import { TestBed } from '@angular/core/testing';

import { Dotmaster } from './dotmaster';

describe('Dotmaster', () => {
  let service: Dotmaster;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dotmaster);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
