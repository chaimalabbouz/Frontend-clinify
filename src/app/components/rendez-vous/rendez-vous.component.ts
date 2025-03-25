import { Component, OnInit } from '@angular/core';
import { RendezVousService } from '../../services/rendez-vous.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DatePipe],
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.css']
})
export class RendezVousComponent implements OnInit {
  // Propriétés du composant
  rendezVousList: any[] = []; // Liste des RDV
  isLoading = true; // État de chargement
  errorMessage = ''; // Messages d'erreur
  patientId = 1; // ID patient (à adapter)
  today: Date = new Date(); // Date du jour pour validation

  // Gestion du formulaire
  showForm = false;
  rdvForm: any;
  successMessage = '';

  constructor(
    private rendezVousService: RendezVousService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialisation du formulaire
    this.rdvForm = this.fb.group({
      date: ['', Validators.required],
      heure: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      typeRendezVous: ['Consultation', Validators.required],
      IdMedecin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Détermine la vue à afficher selon l'URL
    this.showForm = this.router.url.includes('nouveau-rdv');
    this.loadRendezVous();
  }

  /**
   * Charge les rendez-vous du patient
   */
  loadRendezVous(): void {
    this.isLoading = true;
    this.rendezVousService.getRendezVousByPatientId(this.patientId)
      .subscribe({
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

  /**
   * Bascule entre liste et formulaire
   */
  toggleView(): void {
    if (this.showForm) {
      this.router.navigate(['/espace-patient/rendez-vous']);
    } else {
      this.router.navigate(['/espace-patient/nouveau-rdv']);
    }
  }

  /**
   * Soumet le formulaire
   */
  onSubmit(): void {
    if (this.rdvForm.valid) {
      const formData = {
        ...this.rdvForm.value,
        IdPatient: this.patientId
      };

      this.rendezVousService.createRendezVous(formData).subscribe({
        next: (res) => {
          this.successMessage = 'RDV créé avec succès!';
          this.loadRendezVous();
          this.rdvForm.reset({
            typeRendezVous: 'Consultation'
          });
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