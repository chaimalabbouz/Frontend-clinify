import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Pour le routage
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
}
