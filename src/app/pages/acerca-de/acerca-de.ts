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
    // Protección: Si los campos obligatorios están completamente vacíos, no hace nada
    if (!this.nombre.trim() || !this.correo.trim() || !this.mensaje.trim()) {
      return;
    }

    console.log('Mensaje de contacto:', {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      mensaje: this.mensaje
    });

    // Estado de éxito y reseteo limpio del formulario
    this.enviado = true;
    this.nombre = '';
    this.apellidos = '';
    this.correo = '';
    this.mensaje = '';

    // Desaparece el mensaje de éxito automáticamente después de 5 segundos para mantener la UX limpia
    setTimeout(() => {
      this.enviado = false;
    }, 5000);
  }
}