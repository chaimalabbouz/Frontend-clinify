import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true, // ✅ Ajouté pour standalone components
  imports: [CommonModule, ReactiveFormsModule, RouterModule] // ✅ Importation des modules nécessaires
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required], // ✅ Ajouté
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['patient', Validators.required] // Rôle fixé à 'patient'
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.getRawValue();
      formData.role = 'patient'; // Ajoute explicitement le rôle
  
      console.log("Données envoyées :", formData); // Debugging
  
      this.authService.registerPatient(formData).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.successMessage = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
          this.registerForm.reset();
        },
        error: (error: any) => { 
          console.error('Erreur lors de l’inscription', error);
        }
      });
    } else {
      console.log("Formulaire invalide");
    }
  }
  
  
  
}

