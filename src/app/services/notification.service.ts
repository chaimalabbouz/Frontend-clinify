import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';



interface Notification {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  patientId: number;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/notifications';
  
  // Utilisation d'un BehaviorSubject pour stocker et observer le nombre de notifications non lues
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();


  constructor(private http: HttpClient) {}

  // Récupérer les notifications pour un patient
  getNotificationsByPatientId(patientId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`http://localhost:3000/api/notifications/patient/${patientId}`);
  }
  

  // Réinitialiser le compteur de notifications non lues
  resetUnreadCount(): void {
    this.unreadCountSubject.next(0); // Réinitialise à 0
  }


updateUnreadCount(count: number) {
  this.unreadCountSubject.next(count);
}

}
