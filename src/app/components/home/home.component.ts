import { Component } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, ContactComponent], // Ajoute ces composants
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { }
