import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Initialisation différée pour s'assurer que le localStorage est disponible
    setTimeout(() => {
      this.isLoggedInSubject.next(this.hasToken());
    });
  }

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  public hasToken(): boolean {
    try {
      const token = localStorage.getItem('token');
      const patientId = localStorage.getItem('patientId');
      return !!token && !!patientId;
    } catch (e) {
      return false;
    }
  }
  
    // Expose a method to set login status publicly
    public setLoggedInStatus(status: boolean): void {
      this.isLoggedInSubject.next(status);
    }

  // Inscription d'un patient (Front-office)
  registerPatient(userData: any): Observable<any> {
    const patientData = { ...userData, role: 'patient' }; // Ajoute le rôle 'patient'
    return this.http.post<any>('http://localhost:3000/api/auth/register', patientData);
  }

  // Login (connexion)
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Réponse de l\'API:', response); // Vérification de la réponse de l'API
  
        // Enregistrer le token, le role et le userId dans le localStorage
        this.saveToken(response.token, response.role, response.userId, response.userName);
        
        console.log('userId après la connexion:', response.userId); // Debug
  
        // Mettre à jour le statut de connexion
        this.isLoggedInSubject.next(true);
      })
    );
  }
  
  

  // Enregistre le token et l'ID du patient dans localStorage
// In AuthService
saveToken(token: string, role: string, userId: number, userName: string) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('role', role);
  localStorage.setItem('userId', userId.toString()); // Store userId as a string
  localStorage.setItem('userName', userName); // Save userName to localStorage
}

  // Récupère l'ID du patient depuis localStorage
  public getPatientId(): string | null {
    const patientId = localStorage.getItem('userId');  // Utilisez 'userId' au lieu de 'patientId'
    console.log('ID du patient récupéré depuis localStorage:', patientId);
    return patientId;
  }
  
// In AuthService
public getUserName(): string | null {
  return localStorage.getItem('userName'); // Retrieve userName from localStorage
}



  // Récupère le token depuis localStorage
  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Déconnexion et mise à jour du statut
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('patientId');
    this.isLoggedInSubject.next(false); // Met à jour le statut de connexion
  }
}