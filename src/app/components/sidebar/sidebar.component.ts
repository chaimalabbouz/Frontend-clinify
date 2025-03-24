import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; // Importer MatIconModule
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Pour routerLink


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
