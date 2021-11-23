import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmtNavbarComponent } from './amt-navbar.component';

describe('AmtNavbarComponent', () => {
  let component: AmtNavbarComponent;
  let fixture: ComponentFixture<AmtNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmtNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmtNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
