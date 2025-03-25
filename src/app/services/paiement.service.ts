import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Standalone, pas besoin de l'ajouter dans un module
})
export class PaiementService {
  private apiUrl = 'http://localhost:3000/api/paiements';

  constructor(private http: HttpClient) {}

  effectuerPaiement(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getPaiements(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}
