import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-space',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-space.component.html',
  styleUrls: ['./patient-space.component.css']
})
export class PatientSpaceComponent implements OnInit {
  patient: any;

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let patientId = this.route.snapshot.paramMap.get('id');

    if (!patientId) {
      // ✅ Aucun ID dans l’URL, on prend l'ID du patient connecté
      patientId = this.authService.getPatientId();
    }

    console.log('ID du patient utilisé:', patientId);

    const parsedId = patientId ? Number(patientId) : null;

    if (parsedId && !isNaN(parsedId)) {
      this.patientService.getPatientById(parsedId).subscribe({
        next: (data) => {
          this.patient = data;
          console.log('Patient récupéré', this.patient);
        },
        error: (err) => {
          console.error('Erreur récupération patient', err);
        }
      });
    } else {
      console.error('ID du patient invalide:', patientId);
    }
  }
}
