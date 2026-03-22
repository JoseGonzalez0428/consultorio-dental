import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

interface Cita {
  id_cita: number;
  hora: string;
  nombre_tratamiento: string;
  nombre_paciente: string;
  telefono: string;
  estado: string;
}

@Component({
  selector: 'app-gestionar-citas',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './gestionar-citas.html',
  styleUrls: ['./gestionar-citas.css']
})
export class GestionarCitas {

  fechaSeleccionada: string = '';
  citas: Cita[] = [];
  paginaActual: number = 1;
  citasPorPagina: number = 5;
  totalPaginas: number = 1;

  // Datos mock — se reemplazarán con llamadas al backend
  private todasLasCitasMock: { [fecha: string]: Cita[] } = {
    [this.getFechaMock(0)]: [
      { id_cita: 1, hora: '10:00', nombre_tratamiento: 'Consulta', nombre_paciente: 'Heber Gabriel Carrizales Ojeda', telefono: '+52 444 4039 2960', estado: 'Pendiente' },
      { id_cita: 2, hora: '12:00', nombre_tratamiento: 'Extracción', nombre_paciente: 'Enrique Alejandro Vázquez García', telefono: '+52 444 4125 3312', estado: 'Pendiente' },
      { id_cita: 3, hora: '17:00', nombre_tratamiento: 'Ortodoncia', nombre_paciente: 'Diego Fernando Morín Torres', telefono: '+52 485 3781 5466', estado: 'Pendiente' },
    ],
    [this.getFechaMock(1)]: [
      { id_cita: 4, hora: '09:00', nombre_tratamiento: 'Limpieza dental', nombre_paciente: 'María García López', telefono: '+52 444 1234 5678', estado: 'Pendiente' },
      { id_cita: 5, hora: '11:00', nombre_tratamiento: 'Consulta', nombre_paciente: 'Carlos Rodríguez Pérez', telefono: '+52 485 9876 5432', estado: 'Pendiente' },
    ]
  };

  getFechaMock(diasSumados: number): string {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + diasSumados);
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  cargarCitas(fecha: string): void {
    const citasDeFecha = this.todasLasCitasMock[fecha] ?? [];
    const activas = citasDeFecha.filter(c => c.estado !== 'Cancelado');
    this.totalPaginas = Math.ceil(activas.length / this.citasPorPagina);
    this.paginaActual = 1;
    this.aplicarPaginacion(activas);
  }

  aplicarPaginacion(citasFiltradas: Cita[]): void {
    const offset = (this.paginaActual - 1) * this.citasPorPagina;
    this.citas = citasFiltradas.slice(offset, offset + this.citasPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    const citasDeFecha = this.todasLasCitasMock[this.fechaSeleccionada] ?? [];
    const activas = citasDeFecha.filter(c => c.estado !== 'Cancelado');
    this.aplicarPaginacion(activas);
  }

  cancelarCita(id: number): void {
    const citasDeFecha = this.todasLasCitasMock[this.fechaSeleccionada];
    if (!citasDeFecha) return;
    const index = citasDeFecha.findIndex(c => c.id_cita === id);
    if (index !== -1) {
      this.todasLasCitasMock[this.fechaSeleccionada][index].estado = 'Cancelado';
    }
    this.cargarCitas(this.fechaSeleccionada);
  }

  completarCita(id: number): void {
    const citasDeFecha = this.todasLasCitasMock[this.fechaSeleccionada];
    if (!citasDeFecha) return;
    const index = citasDeFecha.findIndex(c => c.id_cita === id);
    if (index !== -1) {
      this.todasLasCitasMock[this.fechaSeleccionada][index].estado = 'Terminado';
    }
    this.cargarCitas(this.fechaSeleccionada);
  }

  sumarUnaHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const nueva = new Date();
    nueva.setHours(h + 1, m);
    return nueva.toTimeString().slice(0, 5);
  }
}