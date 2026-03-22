import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acerca-de',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './acerca-de.html',
  styleUrl: './acerca-de.css',
})
export class AcercaDe {
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  mensaje: string = '';
  enviado: boolean = false;

  enviarMensaje(): void {
    if(this.nombre || this.correo || this.mensaje){
      return;
    }

    console.log('Mensaje de contacto;', {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      mensaje: this.mensaje
    });
    this.enviado = true;
    this.nombre = '';
    this.apellidos = '';
    this.correo = '';
    this.mensaje = '';
  }
}
