import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

interface BloqueHorario {
  inicio: string;
  fin: string;
}

interface Cita {
  id_cita: number;
  fecha: string;
  hora: string;
  estado: string;
  nombre_tratamiento: string;
  nueva_fecha?: string;
  nueva_hora?: string;
  horasDisponibles?: BloqueHorario[];
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.css']
})
export class MisCitas implements OnInit {

  citas: Cita[] = [];
  mensaje: string = '';
  error: string = '';
  paginaActual: number = 1;
  citasPorPagina: number = 3;
  totalPaginas: number = 1;

  fechasDisponibles: string[] = [];

  private disponibilidadMock: { [fecha: string]: { hora_inicio: string, hora_fin: string }[] } = {
    [this.getFechaMock(1)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
    [this.getFechaMock(3)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }],
    [this.getFechaMock(5)]: [{ hora_inicio: '09:00', hora_fin: '11:00' }],
    [this.getFechaMock(8)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
  };

  private todasLasCitas: Cita[] = [
    { id_cita: 1, fecha: this.getFechaMock(8), hora: '10:00', estado: 'Pendiente', nombre_tratamiento: 'Consulta general' },
    { id_cita: 2, fecha: this.getFechaMock(3), hora: '09:00', estado: 'Pendiente', nombre_tratamiento: 'Limpieza dental' },
    { id_cita: 3, fecha: '2025-02-11', hora: '17:00', estado: 'Terminado', nombre_tratamiento: 'Blanqueamiento' },
    { id_cita: 4, fecha: '2024-12-15', hora: '14:00', estado: 'Terminado', nombre_tratamiento: 'Profilaxis' },
    { id_cita: 5, fecha: '2024-11-10', hora: '11:00', estado: 'Cancelado', nombre_tratamiento: 'Ortodoncia' },
  ];

  ngOnInit(): void {
    this.fechasDisponibles = Object.keys(this.disponibilidadMock)
      .filter(f => f >= new Date().toISOString().split('T')[0]);
    this.totalPaginas = Math.ceil(this.todasLasCitas.length / this.citasPorPagina);
    this.cargarPagina(1);
  }

  getFechaMock(dia: number): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  cargarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    const offset = (pagina - 1) * this.citasPorPagina;
    this.citas = this.todasLasCitas.slice(offset, offset + this.citasPorPagina);
  }

  cambiarPagina(pagina: number): void {
    this.cargarPagina(pagina);
  }

  cargarHorasModificacion(cita: Cita): void {
    cita.horasDisponibles = [];
    cita.nueva_hora = '';
    const disponibilidad = this.disponibilidadMock[cita.nueva_fecha ?? ''];
    if (!disponibilidad) return;

    disponibilidad.forEach(disp => {
      const inicio = new Date(`2000-01-01T${disp.hora_inicio}`);
      const fin = new Date(`2000-01-01T${disp.hora_fin}`);
      while (inicio < fin) {
        const horaInicio = inicio.toTimeString().slice(0, 5);
        inicio.setHours(inicio.getHours() + 1);
        const horaFin = inicio.toTimeString().slice(0, 5);
        if (inicio <= fin) {
          cita.horasDisponibles!.push({ inicio: horaInicio, fin: horaFin });
        }
      }
    });
  }

  modificarCita(cita: Cita): void {
    if (!cita.nueva_fecha || !cita.nueva_hora) {
      this.error = 'Debes seleccionar fecha y hora válidas.';
      return;
    }
    // Esto se reemplazará con llamada al backend
    const index = this.todasLasCitas.findIndex(c => c.id_cita === cita.id_cita);
    if (index !== -1) {
      this.todasLasCitas[index].fecha = cita.nueva_fecha!;
      this.todasLasCitas[index].hora = cita.nueva_hora!;
    }
    this.mensaje = 'Cita modificada correctamente.';
    this.error = '';
    this.cargarPagina(this.paginaActual);
  }

  cancelarCita(id: number): void {
    if (!confirm('¿Seguro que quieres cancelar esta cita?')) return;
    // Esto se reemplazará con llamada al backend
    const index = this.todasLasCitas.findIndex(c => c.id_cita === id);
    if (index !== -1) {
      this.todasLasCitas[index].estado = 'Cancelado';
    }
    this.mensaje = 'Cita cancelada correctamente.';
    this.error = '';
    this.cargarPagina(this.paginaActual);
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