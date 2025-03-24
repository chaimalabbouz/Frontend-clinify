import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth'; // Base URL du backend
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); // ✅ État de connexion

  constructor(private http: HttpClient) {}

  // Observable pour suivre l’état de connexion
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  // Inscription
// Inscription d'un patient (Front-office)
registerPatient(userData: any): Observable<any> {
  const patientData = { ...userData, role: 'patient' }; // ✅ Ajoute le rôle 'patient'
  return this.http.post<any>('http://localhost:3000/api/auth/register', patientData);
}


  // Connexion avec mise à jour automatique du statut
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.token, response.role);
      })
    );
  }

  // Sauvegarde du token et mise à jour du statut
  saveToken(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.isLoggedInSubject.next(true); // ✅ Met à jour le statut de connexion
  }

  // Récupération du token
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  // Déconnexion et mise à jour du statut
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false); // ✅ Met à jour le statut de connexion
  }
}
