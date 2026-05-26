import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acerca-de',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './acerca-de.html',
  styleUrl: './acerca-de.css'
})
export class AcercaDe {

  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/api';

  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  mensaje: string = '';
  enviado: boolean = false;
  error: string = '';
  isLoading: boolean = false;

  enviarMensaje(): void {
    if (!this.nombre || !this.correo || !this.mensaje) {
      this.error = 'Por favor completa los campos obligatorios.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.http.post<any>(`${this.BASE_URL}/contacto`, {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      mensaje: this.mensaje
    }).subscribe({
      next: () => {
        this.enviado = true;
        this.nombre = '';
        this.apellidos = '';
        this.correo = '';
        this.mensaje = '';
      },
      error: () => {
        this.error = 'Error al enviar el mensaje. Intenta de nuevo.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}