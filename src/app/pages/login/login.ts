import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  public readonly authService = inject(AuthService);

  // Formulario reactivo con validaciones nativas básicas
  readonly loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.authService.isLoading()) {
      return;
    }

    // Extraemos los valores de manera segura limpiando posibles nulos o undefined
    const { correo, contrasena } = this.loginForm.getRawValue();
    
    if (correo && contrasena) {
      this.authService.login({ correo, contrasena });
    }
  }
}