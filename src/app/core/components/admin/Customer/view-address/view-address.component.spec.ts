import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddressComponent } from './view-address.component';

describe('ViewAddressComponent', () => {
  let component: ViewAddressComponent;
  let fixture: ComponentFixture<ViewAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
