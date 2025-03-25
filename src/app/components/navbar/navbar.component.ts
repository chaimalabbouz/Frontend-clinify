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
  private subscriptions = new Subscription();

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    // Force initial verification
    const initialStatus = this.authService.hasToken();
    this.authService.setLoggedInStatus(initialStatus);
    
    // Abonnement pour suivre les changements de connexion
    this.subscriptions.add(
      this.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.patientId = this.authService.getPatientId(); // Récupérer userId à partir de localStorage
        } else {
          this.patientId = null;
        }
        console.log('Navbar - isLoggedIn:', isLoggedIn, 'patientId:', this.patientId);
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