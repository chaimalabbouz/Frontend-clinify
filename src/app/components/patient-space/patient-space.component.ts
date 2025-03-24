import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-patient-space',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent, // Import du composant sidebar
    RouterOutlet // Pour le routage dynamique
  ],
  templateUrl: './patient-space.component.html',
  styleUrl: './patient-space.component.css'
})
export class PatientSpaceComponent {

}
