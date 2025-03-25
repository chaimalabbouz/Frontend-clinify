import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs'; // Added Subscription import

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  patientId: string | null = null;
  userName: string | null = null; // Ajouté pour stocker le nom de l'utilisateur
  userInitial: string | null = null; // Ajouté pour stocker l'initiale de l'utilisateur
  private subscriptions = new Subscription();

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    const initialStatus = this.authService.hasToken();
    this.authService.setLoggedInStatus(initialStatus);
  
    this.subscriptions.add(
      this.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.patientId = this.authService.getPatientId();
          this.userName = this.authService.getUserName();
  
          // Get the first letter of the user's name and convert it to uppercase
          this.userInitial = this.userName ? this.userName.charAt(0).toUpperCase() : '';
        } else {
          this.patientId = null;
          this.userName = null;
          this.userInitial = null;
        }
      })
    );
  }
  

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goToPatientSpace() {
    if (this.patientId) {
      this.router.navigate(['/espace-patient', this.patientId]);
    } else {
      console.error('ID du patient introuvable.');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}
