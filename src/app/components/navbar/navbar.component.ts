import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Observable, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  patientId: string | null = null;
  userName: string | null = null; 
  userInitial: string | null = null; 
  unreadCount: number = 0;
  private subscriptions = new Subscription();

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {
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
          // Charger les notifications si patientId existe
          if (this.patientId) {
            localStorage.setItem('patientId', this.patientId); // ajoute cette ligne
            this.notificationService.getNotificationsByPatientId(this.patientId).subscribe(notifications => {
              const unread = notifications.filter(n => !n.isRead).length;
              this.unreadCount = unread;
            });
          }
          

          // Suivre le compteur des notifications non lues
          this.subscriptions.add(
            this.notificationService.unreadCount$.subscribe(count => {
              this.unreadCount = count;
            })
          );
        } else {
          this.patientId = null;
          this.userName = null;
          this.userInitial = null;
          this.unreadCount = 0;
        }
      })
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goToPatientSpace() {
    if (this.patientId) {
      this.router.navigate(['/sidebar']);
    } else {
      console.error('ID du patient introuvable.');
      this.router.navigate(['/login']);
    }
  }

  goToNotificationPage(): void {
    if (this.patientId) {
      this.router.navigate([`/notifications/patient/${this.patientId}`]);
    } else {
      console.error('Aucun patientId trouvé');
    }
  }
  

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
