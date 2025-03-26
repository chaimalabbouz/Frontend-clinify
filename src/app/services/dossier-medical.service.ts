import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DossierMedicalService {
  private apiUrl = 'http://localhost:3000/api/dossier-medical';

  constructor(private http: HttpClient) { }

  getDossiersByPatientId(patientId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/patient/${patientId}`).pipe(
      map(response => {
        // Vérification de l'existence du champ 'dossiers'
        if (!response.dossiers) {
          throw new Error('Aucun dossier médical trouvé pour ce patient');
        }
        return response.dossiers;
      })
    );
  }
}
