import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisplayContactService {
  private excludedRoutes = [
    'sidebar',
    'rendez-vous',
    'register',
    'paiement',
    'login',
    'nouveau-rdv',
    'dossier',
  ];

  constructor(private router: Router) {}

  shouldDisplayContact(): boolean {
    let currentRoute = this.router.url.split('/')[1]; // récupère le premier segment de l'URL

    return !this.excludedRoutes.includes(currentRoute);
  }
}
