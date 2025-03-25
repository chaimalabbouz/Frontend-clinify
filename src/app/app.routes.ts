import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { PatientSpaceComponent } from './components/patient-space/patient-space.component';
import { DossierMedicalComponent } from './components/dossier-medical/dossier-medical.component';
import { RendezVousComponent } from './components/rendez-vous/rendez-vous.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'paiement', component: PaiementComponent },
  {path: 'sidebar', component : SidebarComponent},
  
  // Version sans children - routes plates
  { path: 'espace-patient', component: PatientSpaceComponent },
  { path: 'espace-patient/:id', component: PatientSpaceComponent },
  { path: 'espace-patient/dossier', component: DossierMedicalComponent },
  { 
    path: 'espace-patient/rendez-vous', 
    component: RendezVousComponent,
    data: { showForm: false } 
  },
  { 
    path: 'espace-patient/nouveau-rdv', 
    component: RendezVousComponent,
    data: { showForm: true } 
  },

  // Gestion des routes inconnues (doit être la dernière)
  { path: '**', redirectTo: '' }
];