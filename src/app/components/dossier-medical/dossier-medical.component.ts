import { Component, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dossier-medical',
  standalone: true,
  imports: [CommonModule, RouterModule,SidebarComponent],
  templateUrl: './dossier-medical.component.html',
  styleUrls: ['./dossier-medical.component.css']
})
export class DossierMedicalComponent implements OnInit {
  showSidebar: boolean = true;
  dossierList: any[] = [];
  isLoading = true;
  errorMessage = '';
  patientId: number | null = null;
  showForm = false;

  constructor(
    private dossierMedicalService: DossierMedicalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger l'ID du patient à partir de l'authentification
    this.loadPatientId();
  
    if (this.patientId) {
      this.loadDossiers();
    }
  
  }

  // Charger l'ID du patient depuis le service d'authentification
  loadPatientId(): void {
    const patientId = this.authService.getPatientId();
    this.patientId = patientId ? Number(patientId) : null;
    if (!this.patientId) {
      this.errorMessage = 'ID du patient non trouvé, veuillez vous reconnecter';
    }
  }
    // Charger les dossiers médicaux du patient connecté
    loadDossiers(): void {
      this.isLoading = true;
      if (this.patientId) {
        this.dossierMedicalService.getDossiersByPatientId(this.patientId).subscribe({
          next: (data) => {
            this.dossierList = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erreur:', err);
            this.errorMessage = 'Erreur lors du chargement des dossiers médicaux';
            this.isLoading = false;
          }
        });
      }
    }

}
