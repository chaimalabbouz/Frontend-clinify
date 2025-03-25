import { Component, OnInit } from '@angular/core';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dossier-medical',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dossier-medical.component.html',
  styleUrls: ['./dossier-medical.component.css']
})
export class DossierMedicalComponent implements OnInit {
  dossiers: any[] = [];
  isLoading = true;
  errorMessage = '';
  patientId = 1;

  constructor(private dossierService: DossierMedicalService) {}

  ngOnInit(): void {
    this.loadDossiers();
  }

  loadDossiers(): void {
    this.dossierService.getDossiersByPatientId(this.patientId).subscribe({
      next: (data) => {
        this.dossiers = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur de chargement des dossiers';
        this.isLoading = false;
      }
    });
  }
}