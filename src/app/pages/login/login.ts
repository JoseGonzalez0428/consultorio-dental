import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';

  constructor(private router: Router){}

  iniciarSesion(): void {
    if(!this.correo || !this.contrasena){
      this.mensajeError = 'Por favor completa todos los campos.';
      return;
    }

    // Simulación de autenticación
    if(this.correo === 'admin@dental.com' && this.contrasena === 'admin123'){
      localStorage.setItem('token', 'mock-token-admin');
      localStorage.setItem('tipo_usuario', 'admin');
      localStorage.setItem('nombre_usuario', 'Ana Luisa');
      localStorage.setItem('sexo_usuario', 'Femenino');
      this.router.navigate(['/gestionar-horarios']);
    } else if(this.correo === 'cliente@dental.com' && this.contrasena === 'cliente123'){
      localStorage.setItem('token','mock-token-cliente');
      localStorage.setItem('tipo_usuario', 'cliente');
      localStorage.setItem('nombre_usuario', 'José Carlos');
      localStorage.setItem('sexo_usuario', 'Masculino');
      this.router.navigate(['/inicio']);
    } else {
      this.mensajeError = 'Correo o contraseña incorrectos.';
    }
  } 
}
