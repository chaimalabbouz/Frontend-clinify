import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
/*import { SidebarComponent } from '../sidebar/sidebar.component';*/
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-space',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './patient-space.component.html',
  styleUrls: ['./patient-space.component.css']
})
export class PatientSpaceComponent implements OnInit {
  patient: any;

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPatientData();
    this.hideFooter(); // Appel de la nouvelle fonction
  }

  private loadPatientData(): void {
    const patientId = this.authService.getPatientId();
    console.log('ID patient connecté:', patientId);

    if (patientId) {
      this.patientService.getPatientById(Number(patientId)).subscribe({
        next: (data) => {
          this.patient = data;
          console.log('Données patient:', data);
        },
        error: (err) => {
          console.error('Erreur chargement patient:', err);
          this.patient = {
            firstName: 'Utilisateur',
            lastName: '',
            email: ''
          };
        }
      });
    }
  }

  // Nouvelle fonction pour cacher le footer
  private hideFooter(): void {
    setTimeout(() => {
      const footer = document.getElementById('footer-section');
      if (footer) {
        footer.style.display = 'none';
        console.log('Footer caché avec succès');
      } else {
        console.warn('Footer non trouvé, vérifiez l\'ID');
      }
    }, 50); // Petit délai pour s'assurer que le DOM est chargé
  }
}