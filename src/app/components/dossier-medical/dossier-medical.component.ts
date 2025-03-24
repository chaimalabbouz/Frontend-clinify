import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DossierMedicalService } from '../../services/dossier-medical.service';
import { HttpErrorResponse } from '@angular/common/http';

// Imports Material
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dossier-medical',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dossier-medical.component.html',
  styleUrls: ['./dossier-medical.component.css']
})
export class DossierMedicalComponent implements OnInit {
  dossier: any = null;
  loading = true;
  error: string | null = null;

  constructor(private dossierService: DossierMedicalService) {}

  ngOnInit(): void {
    const patientId = 1; // À remplacer par l'ID dynamique
    
    this.dossierService.getDossierByPatientId(patientId).subscribe({
      next: (data) => {
        this.dossier = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement du dossier médical';
        this.loading = false;
        console.error(err);
      }
    });
  }
}