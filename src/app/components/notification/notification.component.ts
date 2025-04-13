import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, SidebarComponent], // 👈 ajout de NgFor
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  showSidebar: boolean = true;
  notifications: any[] = [];
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (!patientId) {
      console.error('Aucun patientId trouvé dans l’URL.');
      return;
    }
  
    this.notificationService.getNotificationsByPatientId(patientId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
        this.notificationService.updateUnreadCount(this.unreadCount);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notifications:', err);
      }
    });
  }
  
  loadNotifications(): void {
    const patientId = localStorage.getItem('patientId');
    if (!patientId) {
      console.error('Aucun patientId trouvé dans localStorage.');
      return;
    }
  
    this.notificationService.getNotificationsByPatientId(patientId).subscribe({
      next: (data) => {
        console.log('Notifications reçues:', data);
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
        this.notificationService.updateUnreadCount(this.unreadCount);
      },
      
      error: (err) => {
        console.error('Erreur lors de la récupération des notifications:', err);
      }
    });
  }
  

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.unreadCount = 0;
    this.notificationService.resetUnreadCount();
  }
}
