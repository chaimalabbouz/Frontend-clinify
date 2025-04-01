import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:3000/api'; // Modifié pour utiliser une URL de base

  constructor(private http: HttpClient) {}

  // Récupère les médecins
  getAllMedecins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medecins`).pipe(
      map(medecins => medecins.map(m => ({
        id: m.id,
        nomComplet: `${m.firstName} ${m.lastName}`,
        specialite: m.specialty
      }))),
      catchError(error => {
        console.error('Erreur chargement médecins:', error);
        return of([]);
      })
    );
  }

  // Récupère les RDV d'un patient
  getRendezVousByPatientId(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rendezvous/patient/${patientId}`).pipe(
      map((rdvs: any[]) => rdvs.map(rdv => ({
        ...rdv,
        idRDV: rdv.idRDV, // Assurez-vous que c'est le bon champ
        medecin: {
          id: rdv.Medecin?.id || 0,
          nomComplet: rdv.Medecin ? `${rdv.Medecin.firstName} ${rdv.Medecin.lastName}` : 'Inconnu',
          specialite: rdv.Medecin?.specialty || 'Généraliste',
          numSalle: rdv.Medecin?.numSalle || '',
          nomDept: rdv.Medecin?.nomDept || ''
        },
        date: new Date(rdv.date),
        statut: rdv.statut?.toLowerCase() || 'inconnu'
      }))),
      catchError(error => {
        console.error('Erreur chargement RDV:', error);
        return of([]);
      })
    );
  }

  createRendezVous(rdvData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rendezvous`, rdvData);
  }
  annulerRendezVous(rdvId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/rendezvous/${rdvId}/annuler`, {});
  }
}