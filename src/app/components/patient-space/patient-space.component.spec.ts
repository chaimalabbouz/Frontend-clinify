import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSpaceComponent } from './patient-space.component';

describe('PatientSpaceComponent', () => {
  let component: PatientSpaceComponent;
  let fixture: ComponentFixture<PatientSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
