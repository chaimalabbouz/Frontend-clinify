import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiementService } from '../../services/paiement.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent], // Import des modules nécessaires
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent {
  showSidebar: boolean = true; // Affiche toujours la sidebar

  montant: number = 0;
  methodePaiement: string = 'carte';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  idRdv: number = 0;

  constructor(private paiementService: PaiementService) {}

  payer() {
    const paiementData = {
      montant: this.montant,
      methodePaiement: this.methodePaiement,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      IdRDV: this.idRdv
    };

    this.paiementService.effectuerPaiement(paiementData).subscribe(response => {
      console.log('Paiement réussi !', response);
      alert('Paiement effectué avec succès !');
    }, (error: any) => {
      console.error('Erreur lors du paiement', error);
      alert('Échec du paiement.');
    });
  }
}
