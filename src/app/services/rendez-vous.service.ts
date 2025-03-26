import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:3000/api/rendezvous';

  constructor(private http: HttpClient) {}

  getRendezVousByPatientId(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`).pipe(
      map((rdvs: any[]) => {
        return rdvs.map(rdv => ({
          ...rdv,
          medecin: {
            id: rdv.Medecin.id,
            nomComplet: `${rdv.Medecin.firstName} ${rdv.Medecin.lastName}`,
            specialite: rdv.Medecin.specialty
          },
          date: new Date(rdv.date),
          statut: rdv.statut.toLowerCase()
        }));
      })
    );
  }
  

  createRendezVous(rdvData: any): Observable<any> {
    return this.http.post(this.apiUrl, rdvData);
  }
}
