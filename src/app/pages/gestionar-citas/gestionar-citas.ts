import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas';
import { HorariosService } from '../../services/horarios';
import { ViewChild } from '@angular/core';
import { ModalConfirmacion } from '../../shared/modal-confirmacion/modal-confirmacion';
import { Calendario } from '../../shared/calendario/calendario';

@Component({
  selector: 'app-gestionar-citas',
  standalone: true,
  imports: [FormsModule, ModalConfirmacion, Calendario],
  templateUrl: './gestionar-citas.html',
  styleUrl: './gestionar-citas.css'
})
export class GestionarCitas implements OnInit {

  public citasService = inject(CitasService);
  public horariosService = inject(HorariosService);
  fechaSeleccionada = signal<string>('');
  @ViewChild('modal') modal!: ModalConfirmacion;

  diasConCitas = computed(() => {
    const fechasConCitas = this.citasService.fechasConCitas();

    return this.horariosService.diasCalendario().map(dia => {
      const tieneCitas = fechasConCitas.includes(dia.fecha);
      return {
        ...dia,
        disponible: tieneCitas,
        badge: tieneCitas ? 'Ver citas' : undefined,
        clicable: tieneCitas
      };
    });
  });

  ngOnInit(): void {
    this.citasService.fetchFechasConCitas();
    this.horariosService.fetchHorarios();
  }

  seleccionarDia(dia: any): void {
    this.fechaSeleccionada.set(dia.fecha);
    this.citasService.fetchCitasPorFecha(dia.fecha);
  }

  cancelarCita(id: string): void {
    this.modal.abrir({
      titulo: 'Cancelar cita',
      mensaje: '¿Estás seguro de que deseas cancelar esta cita?',
      textoConfirmar: 'Cancelar cita',
      tipo: 'danger',
      accion: () => this.citasService.cancelarCitaAdmin(id, this.fechaSeleccionada())
    });
  }

  completarCita(id: string): void {
    this.modal.abrir({
      titulo: 'Completar cita',
      mensaje: '¿Confirmas que esta cita ha sido atendida?',
      textoConfirmar: 'Completar',
      tipo: 'warning',
      accion: () => this.citasService.completarCitaAdmin(id, this.fechaSeleccionada())
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