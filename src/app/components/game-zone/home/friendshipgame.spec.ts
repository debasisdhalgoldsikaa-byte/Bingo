import { TestBed } from '@angular/core/testing';

import { Friendshipgame } from './friendshipgame';

describe('Friendshipgame', () => {
  let service: Friendshipgame;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Friendshipgame);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
