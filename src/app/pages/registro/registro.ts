import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  nombres: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  correo: string = '';
  telefono: string = '';
  contrasena: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';

  mensaje: string = '';
  esError: boolean = false;
  constructor(private router: Router){}

  registrarse(): void {
    if(!this.nombres || !this.apellidoPaterno || !this.apellidoMaterno || !this.correo || !this.telefono || !this.contrasena || !this.fechaNacimiento || !this.sexo){
      this.mensaje = 'Por favor completa todos los campos.';
      this.esError = true;
      return;
    }

    // Simulación de registro exitoso
    console.log('Datos de registro:', {
      nombres: this.nombres,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      correo: this.correo,
      telefono: this.telefono,
      contrasena: this.contrasena,
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo
    });

    this.mensaje = 'Registro exitoso. Ahora puedes iniciar sesión.';
    this.esError = false;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
