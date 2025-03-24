import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DossierMedical {
  id: number;
  statut: string;
  Patient: {
    firstName: string;
    lastName: string;
  };
  Medecin: {
    firstName: string;
    lastName: string;
  };
  analyses: {
    id: number;
    nom: string;
    date: string;
    resultat: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DossierMedicalService {
  private apiUrl = 'http://localhost:3000/api/dossier-medical';

  constructor(private http: HttpClient) {}

  getDossierByPatientId(patientId: number): Observable<DossierMedical> {
    return this.http.get<DossierMedical>(`${this.apiUrl}/verifierDossier/${patientId}`);
  }
}