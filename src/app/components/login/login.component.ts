import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: response => {
          console.log('Connexion réussie', response);
          
          // Stocker le token, le rôle et le userId dans localStorage
          this.authService.saveToken(response.token, response.role, response.userId, response.userName);
          
          // Rediriger vers le dashboard
          this.router.navigate(['/patient-space']);
        },
        error: error => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      });
    }
  }
  
  
}
