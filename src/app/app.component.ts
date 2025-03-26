import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'; 
import { DisplayContactService } from './services/display-contact.service';
import { CommonModule } from '@angular/common';  // Ajout de CommonModule pour utiliser *ngIf
import { ContactComponent } from './contact/contact.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    CommonModule,  // Importation de CommonModule
    ContactComponent // Assurez-vous que votre composant Contact est importé ici
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'front-office';
  shouldDisplayContact: boolean = true;

  constructor(
    private displayContactService: DisplayContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateContactDisplay();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateContactDisplay();
    });
  }

  private updateContactDisplay(): void {
    this.shouldDisplayContact = this.displayContactService.shouldDisplayContact();
  }
}
