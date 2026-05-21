import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas';
import { HorariosService } from '../../services/horarios';
import { Cita } from '../../interfaces/cita.interface';
import { BloqueHorario } from '../../interfaces/horario.interface';
import { ViewChild } from '@angular/core';
import { ModalConfirmacion } from '../../shared/modal-confirmacion/modal-confirmacion';

interface CitaExtendida extends Cita {
  nueva_fecha?: string;
  nueva_hora?: string;
  horasDisponibles?: BloqueHorario[];
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [FormsModule, ModalConfirmacion],
  templateUrl: './mis-citas.html',
  styleUrl: './mis-citas.css'
})
export class MisCitas implements OnInit {

  @ViewChild('modal') modal!: ModalConfirmacion;

  public citasService = inject(CitasService);
  private horariosService = inject(HorariosService);

  citas: CitaExtendida[] = [];

  fechasDisponibles = computed(() => {
    const ocupadas = this.citasService.horasOcupadas();

    return [...new Set(this.horariosService.horarios().map(h => h.fecha))]
      .filter(f => f >= new Date().toISOString().split('T')[0])
      .filter(fecha => {
        const horariosDeFecha = this.horariosService.horarios().filter(h => h.fecha === fecha);
        const ocupadasDeFecha = ocupadas[fecha] ?? [];

        const bloques: string[] = [];
        horariosDeFecha.forEach(disp => {
          const inicio = new Date(`2000-01-01T${disp.hora_inicio}`);
          const fin = new Date(`2000-01-01T${disp.hora_fin}`);
          while (inicio < fin) {
            const horaInicio = inicio.toTimeString().slice(0, 5);
            inicio.setHours(inicio.getHours() + 1);
            if (inicio <= fin) bloques.push(horaInicio);
          }
        });

        return bloques.some(b => !ocupadasDeFecha.includes(b));
      });
  });

  paginaActual = signal<number>(1);
  citasPorPagina: number = 3;

  totalPaginas = computed(() =>
    Math.ceil(this.citasService.citas().length / this.citasPorPagina)
  );

  citasPaginadas = computed(() => {
    const todas = this.citasService.citas() as CitaExtendida[];
    const offset = (this.paginaActual() - 1) * this.citasPorPagina;
    return todas.slice(offset, offset + this.citasPorPagina);
  });

  ngOnInit(): void {
    this.citasService.fetchMisCitas();
    this.horariosService.fetchHorarios();
    this.citasService.fetchHorasOcupadas();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) return;
    this.paginaActual.set(pagina);
  }

  cargarHorasModificacion(cita: CitaExtendida): void {
    cita.horasDisponibles = [];
    cita.nueva_hora = '';

    const horarios = this.horariosService.horarios();
    const disponibilidad = horarios.filter(h => h.fecha === cita.nueva_fecha);
    if (!disponibilidad.length) return;

    const ocupadas = this.citasService.horasOcupadas()[cita.nueva_fecha ?? ''] ?? [];

    disponibilidad.forEach(disp => {
      const inicio = new Date(`2000-01-01T${disp.hora_inicio}`);
      const fin = new Date(`2000-01-01T${disp.hora_fin}`);
      while (inicio < fin) {
        const horaInicio = inicio.toTimeString().slice(0, 5);
        inicio.setHours(inicio.getHours() + 1);
        const horaFin = inicio.toTimeString().slice(0, 5);
        if (inicio <= fin && !ocupadas.includes(horaInicio)) {
          cita.horasDisponibles!.push({ inicio: horaInicio, fin: horaFin });
        }
      }
    });
  }

  modificarCita(cita: CitaExtendida): void {
    if (!cita._id || !cita.nueva_fecha || !cita.nueva_hora) return;
    this.modal.abrir({
      titulo: 'Modificar cita',
      mensaje: `¿Confirmas reagendar tu cita para el ${this.formatearFecha(cita.nueva_fecha)} a las ${cita.nueva_hora}?`,
      textoConfirmar: 'Confirmar',
      tipo: 'warning',
      accion: () => this.citasService.modificarCita(cita._id!, cita.nueva_fecha!, cita.nueva_hora!)
    });
  }

  cancelarCita(id: string | undefined): void {
    if (!id) return;
    this.modal.abrir({
      titulo: 'Cancelar cita',
      mensaje: '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.',
      textoConfirmar: 'Cancelar cita',
      tipo: 'danger',
      accion: () => this.citasService.cancelarCita(id)
    });
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  sumarUnaHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const nueva = new Date();
    nueva.setHours(h + 1, m);
    return nueva.toTimeString().slice(0, 5);
  }
}