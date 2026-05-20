import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas';

@Component({
  selector: 'app-gestionar-citas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestionar-citas.html',
  styleUrl: './gestionar-citas.css'
})
export class GestionarCitas {

  public citasService = inject(CitasService);
  fechaSeleccionada: string = '';

  cargarCitas(fecha: string): void {
    if (fecha) {
      this.citasService.fetchCitasPorFecha(fecha);
    }
  }

  cancelarCita(id: string): void {
    if (!confirm('¿Seguro que quieres cancelar esta cita?')) return;
    this.citasService.cancelarCitaAdmin(id, this.fechaSeleccionada);
  }

  completarCita(id: string): void {
    this.citasService.completarCitaAdmin(id, this.fechaSeleccionada);
  }

  sumarUnaHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const nueva = new Date();
    nueva.setHours(h + 1, m);
    return nueva.toTimeString().slice(0, 5);
  }
}