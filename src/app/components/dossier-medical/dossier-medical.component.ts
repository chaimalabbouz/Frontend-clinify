import { Component, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Medicament {
  id: number;
  nom: string;
  duree: string;
  frequence: string;
  posologie: string;
  instructions?: string;
}

interface Analyse {
  nom: string;
  resultat: string;
  date: string;
}

interface Patient {
  firstName: string;
  lastName: string;
}

interface Medecin {
  firstName: string;
  lastName: string;
  specialty: string;
}

interface DossierMedical {
  id: number;
  statut: string;
  createdAt: string;
  Patient: Patient;
  Medecin: Medecin;
  analyse: Analyse[];
  medicaments: Medicament[];
}

@Component({
  selector: 'app-dossier-medical',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dossier-medical.component.html',
  styleUrls: ['./dossier-medical.component.css']
})
export class DossierMedicalComponent implements OnInit {
  showSidebar = true;
  dossierList: DossierMedical[] = [];
  isLoading = true;
  errorMessage = '';
  patientId: number | null = null;

  constructor(
    private dossierMedicalService: DossierMedicalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatientId();
    if (this.patientId) {
      this.loadDossiers();
    }
  }

  loadPatientId(): void {
    const patientId = this.authService.getPatientId();
    this.patientId = patientId ? Number(patientId) : null;
    if (!this.patientId) {
      this.errorMessage = 'ID du patient non trouvé, veuillez vous reconnecter';
      this.isLoading = false;
    }
  }

  loadDossiers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.patientId) {
      this.dossierMedicalService.getDossiersByPatientId(this.patientId).subscribe({
        next: (data) => {
          this.dossierList = this.formatDossierData(data);
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

  private formatDossierData(data: any[]): DossierMedical[] {
    return data.map(dossier => ({
      id: dossier.id || 0,
      statut: dossier.statut || 'Inconnu',
      createdAt: dossier.createdAt || new Date().toISOString(),
      Patient: {
        firstName: dossier.Patient?.firstName || 'Prénom inconnu',
        lastName: dossier.Patient?.lastName || 'Nom inconnu'
      },
      Medecin: {
        firstName: dossier.Medecin?.firstName || 'Dr. Inconnu',
        lastName: dossier.Medecin?.lastName || '',
        specialty: dossier.Medecin?.specialty || 'Spécialité inconnue'
      },
      analyse: Array.isArray(dossier.analyse) ? dossier.analyse : [],
      medicaments: Array.isArray(dossier.medicaments) ? dossier.medicaments : []
    }));
  }

  refreshData(): void {
    this.loadDossiers();
  }
}