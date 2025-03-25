import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost:3000/api/patients'; // Base URL du backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer les infos du patient connecté
  getPatientData(): Observable<any> {
    const patientId = this.authService.getPatientId();
    console.log('Récupération des infos du patient avec ID:', patientId);
    if (!patientId) {
      console.error('Aucun patientId trouvé.');
      return new Observable(observer => {
        observer.error('Aucun patientId trouvé.');
      });
    }
    return this.http.get(`${this.baseUrl}/${patientId}`);
  }

  // Récupérer les détails d’un autre patient par ID
  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
