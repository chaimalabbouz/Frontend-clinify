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
  rendezVousList: any[] = []; // Liste complète des rendez-vous
  medecinsList: any[] = []; // Liste des médecins pour le formulaire
  isLoading = false; // État de chargement
  errorMessage = ''; // Message d'erreur
  patientId: number | null = null; // ID du patient connecté
  today = new Date(); // Date du jour pour la validation
  showForm = true; // Afficher formulaire ou liste
  successMessage = ''; // Message de succès
  rdvForm: any; // Formulaire de rendez-vous

  // Objet pour grouper les rendez-vous par statut
  groupedRendezVous: any = {
    confirmed: [], // RDV avec statut "validé"
    pending: []    // RDV avec statut "en attente", "échoué" ou "annulé"
  };

  constructor(
    private rdvService: RendezVousService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialisation du formulaire
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

  /**
   * Charge l'ID du patient depuis le service d'authentification
   */
  private loadPatientId(): void {
    const id = this.authService.getPatientId();
    this.patientId = id ? +id : null;
    if (this.patientId) {
      this.loadRendezVous();
    }
  }

  /**
   * Configure la vue en fonction de l'URL
   */
  private setupView(): void {
    this.showForm = this.router.url.includes('nouveau-rdv');
    this.router.events.subscribe(() => {
      this.showForm = this.router.url.includes('nouveau-rdv');
    });
  }

  /**
   * Charge la liste des médecins depuis l'API
   */
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

  /**
   * Groupe les rendez-vous par statut
   */
  private groupRendezVousByStatut(): void {
    this.groupedRendezVous = {
      // RDV confirmés (statut "validé")
      confirmed: this.rendezVousList.filter(rdv => rdv.statut === 'validé'),
      
      // RDV en attente/annulés/échoués
      pending: this.rendezVousList.filter(rdv => 
        ['en attente', 'échoué', 'annulé'].includes(rdv.statut))
    };
  }

  /**
   * Charge les rendez-vous du patient depuis l'API
   */
  loadRendezVous(): void {
    if (!this.patientId) return;
    
    this.isLoading = true;
    this.rdvService.getRendezVousByPatientId(this.patientId).subscribe({
      next: (rdvs) => {
        this.rendezVousList = rdvs;
        this.groupRendezVousByStatut(); // Groupe les RDV après chargement
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur de chargement des rendez-vous';
        this.isLoading = false;
      }
    });
  }

  /**
   * Bascule entre la vue formulaire et la vue liste
   */
  toggleView(): void {
    this.router.navigate([this.showForm ? '/rendez-vous' : '/nouveau-rdv']);
    if (!this.showForm) {
      this.loadRendezVous(); // Recharge les RDV quand on revient à la vue liste
    }
  }

  /**
   * Soumet le formulaire de création de RDV
   */
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
  annulerRendezVous(rdvId: number): void {
    // Demande confirmation à l'utilisateur
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.isLoading = true;
      
      // Appel au service pour annuler le RDV
      this.rdvService.annulerRendezVous(rdvId).subscribe({
        next: () => {
          // Met à jour le statut localement
          const rdv = this.rendezVousList.find(r => r.idRDV === rdvId);
          if (rdv) {
            rdv.statut = 'annulé';
            this.groupRendezVousByStatut(); // Re-groupe les RDV
          }
          
          this.isLoading = false;
          this.successMessage = 'Rendez-vous annulé avec succès';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors de l\'annulation du rendez-vous';
          this.isLoading = false;
        }
      });
    }
  }
}