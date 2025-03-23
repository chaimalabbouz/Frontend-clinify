import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; // Importer MatIconModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact', // Sélecteur du composant
  standalone: true, // Composant standalone
  imports: [MatIconModule, CommonModule], // Modules importés
  templateUrl: './contact.component.html', // Chemin vers le template HTML
  styleUrls: ['./contact.component.css'] // Styles CSS associés
})
export class ContactComponent {
  // Votre code ici
}