import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CitaPasada {
  id_cita: number;
  hora: string;
  nombre_paciente: string;
  nombre_tratamiento: string;
}

@Component({
  selector: 'app-crear-reporte',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crear-reporte.html',
  styleUrls: ['./crear-reporte.css']
})
export class CrearReporte implements OnInit {

  fechaSeleccionada: string = '';
  idCitaSeleccionada: string = '';
  notas: string = '';
  mensaje: string = '';
  error: string = '';
  ayer: string = '';
  citas: CitaPasada[] = [];

  // Datos mock — se reemplazarán con llamadas al backend
  private citasMock: { [fecha: string]: CitaPasada[] } = {
    [this.getFechaMock(1)]: [
      { id_cita: 1, hora: '10:00', nombre_paciente: 'Mariana López Hernández', nombre_tratamiento: 'Extracción dental' },
      { id_cita: 2, hora: '12:00', nombre_paciente: 'Roberto Sánchez Ramírez', nombre_tratamiento: 'Limpieza dental' },
    ],
    [this.getFechaMock(2)]: [
      { id_cita: 3, hora: '09:00', nombre_paciente: 'Alejandra Torres Medina', nombre_tratamiento: 'Colocación de resina' },
      { id_cita: 4, hora: '14:00', nombre_paciente: 'Fernando Gutiérrez Castro', nombre_tratamiento: 'Corona de porcelana' },
    ],
    [this.getFechaMock(3)]: [
      { id_cita: 5, hora: '11:00', nombre_paciente: 'Sofía Ramírez Vega', nombre_tratamiento: 'Consulta general' },
    ]
  };

  ngOnInit(): void {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    this.ayer = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  getFechaMock(diasAtras: number): string {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - diasAtras);
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  cargarCitas(fecha: string): void {
    this.citas = this.citasMock[fecha] ?? [];
    this.idCitaSeleccionada = '';
    if (this.citas.length === 0) {
      this.error = 'No hay citas para la fecha seleccionada.';
    } else {
      this.error = '';
    }
  }

  crearReporte(): void {
    if (!this.fechaSeleccionada || !this.idCitaSeleccionada || !this.notas.trim()) {
      this.error = 'Selecciona una cita y escribe las notas.';
      this.mensaje = '';
      return;
    }

    // Esto se reemplazará con llamada al backend
    console.log('Reporte creado:', {
      id_cita: this.idCitaSeleccionada,
      notas: this.notas
    });

    this.mensaje = 'Reporte creado con éxito.';
    this.error = '';
    this.fechaSeleccionada = '';
    this.idCitaSeleccionada = '';
    this.notas = '';
    this.citas = [];
  }
}