import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas';
import { ModalConfirmacion } from '../../shared/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-gestionar-citas',
  standalone: true,
  imports: [FormsModule, ModalConfirmacion],
  templateUrl: './gestionar-citas.html',
  styleUrl: './gestionar-citas.css'
})
export class GestionarCitas implements OnInit {

  public citasService = inject(CitasService);
  fechaSeleccionada: string = '';
  @ViewChild('modal') modal!: ModalConfirmacion;

  ngOnInit(): void {
    this.citasService.fetchFechasConCitas();
  }

  cargarCitas(fecha: string): void {
    if (fecha) {
      this.citasService.fetchCitasPorFecha(fecha);
    }
  }

  cancelarCita(id: string): void {
    this.modal.abrir({
      titulo: 'Cancelar cita',
      mensaje: '¿Estás seguro de que deseas cancelar esta cita?',
      textoConfirmar: 'Cancelar cita',
      tipo: 'danger',
      accion: () => this.citasService.cancelarCitaAdmin(id, this.fechaSeleccionada)
    });
  }

  completarCita(id: string): void {
    this.modal.abrir({
      titulo: 'Completar cita',
      mensaje: '¿Confirmas que esta cita ha sido atendida?',
      textoConfirmar: 'Completar',
      tipo: 'warning',
      accion: () => this.citasService.completarCitaAdmin(id, this.fechaSeleccionada)
    });
  }

  sumarUnaHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const nueva = new Date();
    nueva.setHours(h + 1, m);
    return nueva.toTimeString().slice(0, 5);
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  }
}