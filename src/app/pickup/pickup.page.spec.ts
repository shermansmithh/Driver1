import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupPage } from './pickup.page';

describe('PickupPage', () => {
  let component: PickupPage;
  let fixture: ComponentFixture<PickupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
