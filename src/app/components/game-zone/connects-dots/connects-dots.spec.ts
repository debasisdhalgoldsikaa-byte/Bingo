import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectsDots } from './connects-dots';

describe('ConnectsDots', () => {
  let component: ConnectsDots;
  let fixture: ComponentFixture<ConnectsDots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectsDots],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectsDots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
