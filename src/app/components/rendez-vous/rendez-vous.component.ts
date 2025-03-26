import { Component, OnInit } from '@angular/core';
import { RendezVousService } from '../../services/rendez-vous.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // <-- Import du ReactiveFormsModule
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.css'],
  imports: [CommonModule,ReactiveFormsModule, SidebarComponent]  // Assure-toi que CommonModule est importé
})
export class RendezVousComponent implements OnInit {
  showSidebar: boolean = false;
  rendezVousList: any[] = [];
  isLoading = true;
  errorMessage = '';
  patientId: number | null = null;
  today: Date = new Date();
  showForm = false;
  rdvForm: any;  // Declare the form group variable here

  successMessage = '';

  constructor(
    private rendezVousService: RendezVousService,
    private fb: FormBuilder,  // This is correctly injected here
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.rdvForm = this.fb.group({
      date: ['', Validators.required],
      heure: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      typeRendezVous: ['Consultation', Validators.required],
      IdMedecin: ['', Validators.required]
    });
    
    this.loadPatientId();
    
    // Afficher le formulaire ou la liste en fonction de l'URL
    this.showForm = this.router.url.includes('nouveau-rdv');
    
    // Cette condition est utilisée pour afficher ou masquer la sidebar
    this.showSidebar = this.router.url.includes('rendez-vous') || this.router.url.includes('nouveau-rdv');
    
    if (this.patientId) {
      this.loadRendezVous();
    }
  
    // Gérer l'affichage dynamique de la sidebar lors des changements de route
    this.router.events.subscribe(() => {
      this.showSidebar = this.router.url.includes('rendez-vous') || this.router.url.includes('nouveau-rdv');
    });
  }
  

  loadPatientId(): void {
    const patientId = this.authService.getPatientId();
    this.patientId = patientId ? Number(patientId) : null;
    if (!this.patientId) {
      this.errorMessage = 'Patient ID not found, please log in again';
    }
  }

  loadRendezVous(): void {
    this.isLoading = true;
    if (this.patientId) {
      this.rendezVousService.getRendezVousByPatientId(this.patientId).subscribe({
        next: (data) => {
          this.rendezVousList = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Erreur lors du chargement';
          this.isLoading = false;
        }
      });
    }
  }

  toggleView(): void {
    this.router.navigate([this.showForm ? '/rendez-vous' : '/nouveau-rdv']);
  }

  onSubmit(): void {
    if (this.rdvForm.valid && this.patientId) {
      const formData = {
        ...this.rdvForm.value,
        IdPatient: this.patientId
      };
      this.rendezVousService.createRendezVous(formData).subscribe({
        next: (res) => {
          this.successMessage = 'RDV créé avec succès!';
          this.loadRendezVous();
          this.rdvForm.reset({ typeRendezVous: 'Consultation' });
          this.router.navigate(['/espace-patient/rendez-vous']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création';
          console.error(err);
        }
      });
    }
  }

}
