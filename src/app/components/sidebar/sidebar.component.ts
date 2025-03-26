import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  patient: any;

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    let patientId = this.authService.getPatientId();
  
    if (patientId) {
      const parsedId = Number(patientId);
  
      if (!isNaN(parsedId)) {
        this.patientService.getPatientById(parsedId).subscribe({
          next: (data) => {
            this.patient = data;
          },
          error: (err) => {
            console.error('Erreur lors de la récupération du patient', err);
          }
        });
      } else {
        console.error('ID du patient invalide:', patientId);
      }
    }
  }
  
}
