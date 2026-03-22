import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestionar-horarios.html',
  styleUrls: ['./gestionar-horarios.css']
})
export class GestionarHorarios {

  fecha: string = '';
  horaInicio: string = '';
  horaFin: string = '';
  mensaje: string = '';

  agregarHorario(): void {
    if (!this.fecha || !this.horaInicio || !this.horaFin) {
      this.mensaje = '⚠️ Todos los campos son obligatorios.';
      return;
    }

    if (this.horaInicio >= this.horaFin) {
      this.mensaje = '⚠️ La hora de inicio debe ser menor que la hora de fin.';
      return;
    }

    // Esto se reemplazará con llamada al backend
    console.log('Horario agregado:', {
      fecha: this.fecha,
      hora_inicio: this.horaInicio,
      hora_fin: this.horaFin
    });

    this.mensaje = '✅ Horario agregado exitosamente.';
    this.fecha = '';
    this.horaInicio = '';
    this.horaFin = '';
  }
}