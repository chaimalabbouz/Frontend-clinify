import { Component, OnInit } from '@angular/core';
import { RendezVousService } from '../../services/rendez-vous.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.css'],
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent]
})
export class RendezVousComponent implements OnInit {
  showSidebar = true;
  rendezVousList: any[] = [];
  medecinsList: any[] = [];
  isLoading = false;
  errorMessage = '';
  patientId: number | null = null;
  today = new Date();
  showForm = true;
  successMessage = '';
  rdvForm: any;

  constructor(
    private rdvService: RendezVousService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.rdvForm = this.fb.group({
      date: ['', Validators.required],
      heure: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      typeRendezVous: ['Consultation', Validators.required],
      IdMedecin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPatientId();
    this.setupView();
    this.loadMedecins();
  }

  private loadPatientId(): void {
    const id = this.authService.getPatientId();
    this.patientId = id ? +id : null;
    if (this.patientId) {
      this.loadRendezVous();
    }
  }

  private setupView(): void {
    this.showForm = this.router.url.includes('nouveau-rdv');
    this.router.events.subscribe(() => {
      this.showForm = this.router.url.includes('nouveau-rdv');
    });
  }

  loadMedecins(): void {
    this.isLoading = true;
    this.rdvService.getAllMedecins().subscribe({
      next: (medecins) => {
        this.medecinsList = medecins;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur de chargement des médecins';
        this.isLoading = false;
      }
    });
  }

  loadRendezVous(): void {
    if (!this.patientId) return;
    
    this.isLoading = true;
    this.rdvService.getRendezVousByPatientId(this.patientId).subscribe({
      next: (rdvs) => {
        this.rendezVousList = rdvs;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur de chargement des rendez-vous';
        this.isLoading = false;
      }
    });
  }

  toggleView(): void {
    this.router.navigate([this.showForm ? '/rendez-vous' : '/nouveau-rdv']);
    if (!this.showForm) {
      this.loadRendezVous(); // Recharge les RDV quand on revient à la vue liste
    }
  }

  onSubmit(): void {
    if (this.rdvForm.valid && this.patientId) {
      this.isLoading = true;
      const formData = {
        ...this.rdvForm.value,
        IdPatient: this.patientId
      };

      this.rdvService.createRendezVous(formData).subscribe({
        next: () => {
          this.successMessage = 'Rendez-vous créé avec succès!';
          this.rdvForm.reset({ typeRendezVous: 'Consultation' });
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
          this.loadRendezVous(); // Met à jour la liste après création
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors de la création';
          this.isLoading = false;
        }
      });
    }
  }
}