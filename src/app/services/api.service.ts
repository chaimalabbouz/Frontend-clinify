import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendUrl = 'http://localhost:3000/api/test'; // Remplace par ton URL backend

  constructor(private http: HttpClient) {}

  testBackendConnection() {
    this.http.get(this.backendUrl).subscribe(
      () => console.log("✅ Le frontend est bien connecté au backend"),
      error => console.error("❌ Erreur de connexion au backend :", error)
    );
  }
}
