import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { PatientSpaceComponent } from './components/patient-space/patient-space.component';
import { DossierMedicalComponent } from './components/dossier-medical/dossier-medical.component';
import { RendezVousComponent } from './components/rendez-vous/rendez-vous.component';
import { PrendreRendezVousComponent } from './components/prendre-rendez-vous/prendre-rendez-vous.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'espace-patient',
    component: PatientSpaceComponent,
    children: [
      { path: 'dossier', component: DossierMedicalComponent },
      { path: 'rendez-vous', component: RendezVousComponent },
      { path: 'nouveau-rdv', component: PrendreRendezVousComponent },
      { path: '', redirectTo: 'dossier', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'espace-patient', pathMatch: 'full' },
  { path: '**', redirectTo: '' } // Redirection pour les routes inconnues
];
