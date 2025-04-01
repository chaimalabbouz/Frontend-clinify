import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DossierMedicalComponent } from './components/dossier-medical/dossier-medical.component';
import { RendezVousComponent } from './components/rendez-vous/rendez-vous.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PatientSpaceComponent } from './components/patient-space/patient-space.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'paiement', component: PaiementComponent },
  {path: 'sidebar', component : SidebarComponent},
   // NOUVELLE ROUTE À AJOUTER
   { 
    path: 'patient-space', 
    component: PatientSpaceComponent 
    // canActivate: [AuthGuard] // À décommenter si nécessaire
  },
  
  // Version sans children - routes plates
  { path: 'dossier', component: DossierMedicalComponent },
  { path: 'rendez-vous', component: RendezVousComponent},
  { path: 'nouveau-rdv', component: RendezVousComponent},



  // Gestion des routes inconnues (doit être la dernière)
  { path: '**', redirectTo: '' }
];