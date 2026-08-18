import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentComunication } from './component-comunication';

describe('ComponentComunication', () => {
  let component: ComponentComunication;
  let fixture: ComponentFixture<ComponentComunication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentComunication],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentComunication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
