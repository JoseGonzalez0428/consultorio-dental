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

  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login({
        correo: this.loginForm.value.correo!,
        contrasena: this.loginForm.value.contrasena!
      });
    }
  }
}