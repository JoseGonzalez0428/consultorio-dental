import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

interface Reporte {
  id_reporte: number;
  fecha_cita: string;
  hora_cita: string;
  nombre_tratamiento: string;
  notas: string;
  nombre_paciente: string;
  telefono: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class Reportes implements OnInit {

  reportes: Reporte[] = [];
  paginaActual: number = 1;
  reportesPorPagina: number = 3;
  totalPaginas: number = 1;

  // Datos mock — se reemplazarán con llamadas al backend
  private todosLosReportes: Reporte[] = [
    {
      id_reporte: 1,
      fecha_cita: '15/02/2025',
      hora_cita: '12:00',
      nombre_tratamiento: 'Extracción dental',
      notas: 'Se realizó extracción simple bajo anestesia local con lidocaína al 2%. No se presentaron complicaciones. Se indicaron analgésicos y antibióticos.',
      nombre_paciente: 'Mariana López Hernández',
      telefono: '+52 485 123 4567'
    },
    {
      id_reporte: 2,
      fecha_cita: '15/02/2025',
      hora_cita: '10:00',
      nombre_tratamiento: 'Limpieza dental',
      notas: 'Se realizó profilaxis con ultrasonido y pulido dental con pasta fluorada.',
      nombre_paciente: 'Roberto Sánchez Ramírez',
      telefono: '+52 485 987 6543'
    },
    {
      id_reporte: 3,
      fecha_cita: '14/02/2025',
      hora_cita: '18:00',
      nombre_tratamiento: 'Colocación de resina en caries',
      notas: 'Se realizó eliminación de caries con turbina, aplicación de adhesivo y colocación de resina compuesta fotopolimerizable.',
      nombre_paciente: 'Alejandra Torres Medina',
      telefono: '+52 485 246 8109'
    },
    {
      id_reporte: 4,
      fecha_cita: '14/02/2025',
      hora_cita: '14:00',
      nombre_tratamiento: 'Colocación de corona de porcelana',
      notas: 'Se realizó desgaste dental, toma de impresión y colocación de corona provisional. Se programó cita para la colocación de la corona definitiva en 7 días.',
      nombre_paciente: 'Fernando Gutiérrez Castro',
      telefono: '+52 485 765 4321'
    },
    {
      id_reporte: 5,
      fecha_cita: '13/02/2025',
      hora_cita: '11:00',
      nombre_tratamiento: 'Consulta general',
      notas: 'Se realizó revisión general. Se detectaron dos caries incipientes. Se recomienda tratamiento preventivo con flúor.',
      nombre_paciente: 'Sofía Ramírez Vega',
      telefono: '+52 485 321 6547'
    },
  ];

  ngOnInit(): void {
    this.totalPaginas = Math.ceil(this.todosLosReportes.length / this.reportesPorPagina);
    this.cargarPagina(1);
  }

  cargarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    const offset = (pagina - 1) * this.reportesPorPagina;
    this.reportes = this.todosLosReportes.slice(offset, offset + this.reportesPorPagina);
  }

  cambiarPagina(pagina: number): void {
    this.cargarPagina(pagina);
  }
}