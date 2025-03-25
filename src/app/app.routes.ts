import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { PatientSpaceComponent } from './components/patient-space/patient-space.component';
import { DossierMedicalComponent } from './components/dossier-medical/dossier-medical.component';
import { RendezVousComponent } from './components/rendez-vous/rendez-vous.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'espace-patient',
    component: PatientSpaceComponent, // Layout principal espace patient
    children: [
      { path: 'dossier', component: DossierMedicalComponent },
      { 
        path: 'rendez-vous', 
        component: RendezVousComponent,
        data: { showForm: false } // Affiche la liste des RDV
      },
      { 
        path: 'nouveau-rdv', 
        component: RendezVousComponent,
        data: { showForm: true } // Affiche directement le formulaire
      },
      { path: '', redirectTo: 'dossier', pathMatch: 'full' } // Redirection par défaut
    ]
  },
  { path: '**', redirectTo: '' } // Gestion des routes inconnues
];