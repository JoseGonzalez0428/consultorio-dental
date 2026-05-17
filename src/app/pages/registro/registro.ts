import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  registroForm = this.fb.group({
    nombres: ['', [Validators.required]],
    apellido_paterno: ['', [Validators.required]],
    apellido_materno: [''],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    fecha_nacimiento: ['', [Validators.required]],
    sexo: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.authService.register({
        nombres: this.registroForm.value.nombres!,
        apellido_paterno: this.registroForm.value.apellido_paterno!,
        apellido_materno: this.registroForm.value.apellido_materno ?? '',
        correo: this.registroForm.value.correo!,
        telefono: this.registroForm.value.telefono!,
        contrasena: this.registroForm.value.contrasena!,
        fecha_nacimiento: this.registroForm.value.fecha_nacimiento!,
        sexo: this.registroForm.value.sexo!
      });
    }
  }
}