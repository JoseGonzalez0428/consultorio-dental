import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Tratamiento {
  id: string;
  nombre: string;
}

interface BloqueHorario {
  inicio: string;
  fin: string;
}

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.css']
})
export class Agendar implements OnInit {

  idTratamientoSeleccionado: string = '';
  fechaSeleccionada: string = '';
  horaSeleccionada: string = '';
  mensaje: string = '';

  tratamientos: Tratamiento[] = [
    { id: '1', nombre: 'Consulta general' },
    { id: '2', nombre: 'Ortodoncia' },
    { id: '3', nombre: 'Limpieza dental' },
    { id: '4', nombre: 'Extracción dental' }
  ];

  // Datos mock de disponibilidad
  // Esto se reemplazará con llamadas al backend
  private disponibilidadMock: { [fecha: string]: { hora_inicio: string, hora_fin: string }[] } = {
    [this.getFechaMock(1)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
    [this.getFechaMock(3)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
    [this.getFechaMock(5)]: [{ hora_inicio: '09:00', hora_fin: '11:00' }],
    [this.getFechaMock(8)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
  };

  private citasOcupadasMock: { [fecha: string]: string[] } = {
    [this.getFechaMock(1)]: ['09:00', '10:00'],
    [this.getFechaMock(3)]: ['17:00'],
  };

  fechasDisponibles: string[] = [];
  horasDisponibles: BloqueHorario[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fechasDisponibles = Object.keys(this.disponibilidadMock)
      .filter(f => f >= new Date().toISOString().split('T')[0]);

    // Si viene fecha por query param desde horarios
    const fechaGet = this.route.snapshot.queryParamMap.get('fecha');
    if (fechaGet) {
      this.fechaSeleccionada = fechaGet;
      this.cargarHoras(fechaGet);
    }
  }

  getFechaMock(dia: number): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  cargarHoras(fecha: string): void {
    this.horasDisponibles = [];
    const disponibilidad = this.disponibilidadMock[fecha];
    if (!disponibilidad) return;

    disponibilidad.forEach(disp => {
      const inicio = new Date(`2000-01-01T${disp.hora_inicio}`);
      const fin = new Date(`2000-01-01T${disp.hora_fin}`);

      while (inicio < fin) {
        const horaInicio = inicio.toTimeString().slice(0, 5);
        inicio.setHours(inicio.getHours() + 1);
        const horaFin = inicio.toTimeString().slice(0, 5);

        if (inicio <= fin) {
          const ocupadas = this.citasOcupadasMock[fecha] ?? [];
          if (!ocupadas.includes(horaInicio)) {
            this.horasDisponibles.push({ inicio: horaInicio, fin: horaFin });
          }
        }
      }
    });
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  confirmarCita(): void {
    if (!this.idTratamientoSeleccionado || !this.fechaSeleccionada || !this.horaSeleccionada) {
      this.mensaje = '⚠️ Por favor completa todos los campos.';
      return;
    }

    // Por ahora simulamos la confirmación
    // Esto se reemplazará con una llamada al backend
    console.log('Cita agendada:', {
      tratamiento: this.idTratamientoSeleccionado,
      fecha: this.fechaSeleccionada,
      hora: this.horaSeleccionada
    });

    this.mensaje = `✅ Cita agendada exitosamente para el ${this.formatearFecha(this.fechaSeleccionada)} a las ${this.horaSeleccionada}. Se enviará un correo de confirmación.`;
    this.idTratamientoSeleccionado = '';
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.horasDisponibles = [];
  }
}