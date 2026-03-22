import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface BloqueHorario {
  horaIni: string;
  horaFin: string;
  turno: string;
}

interface DiaCalendario {
  numero: number;
  fecha: string;
  disponible: boolean;
  bloques: BloqueHorario[];
}

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [],
  templateUrl: './horarios.html',
  styleUrls: ['./horarios.css']
})
export class Horarios implements OnInit {

  mesActual: number = new Date().getMonth();
  anioActual: number = new Date().getFullYear();
  nombreMes: string = '';
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  vacios: number[] = [];
  diasDelMes: DiaCalendario[] = [];
  isAdmin: boolean = false;

  // Datos mock de disponibilidad
  // Esto se reemplazará con llamadas al backend
  private disponibilidadMock: { [fecha: string]: { hora_inicio: string, hora_fin: string }[] } = {
    [this.getFechaMock(1)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
    [this.getFechaMock(3)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
    [this.getFechaMock(5)]: [{ hora_inicio: '09:00', hora_fin: '11:00' }],
    [this.getFechaMock(8)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }, { hora_inicio: '17:00', hora_fin: '19:00' }],
    [this.getFechaMock(10)]: [{ hora_inicio: '09:00', hora_fin: '13:00' }],
    [this.getFechaMock(12)]: [{ hora_inicio: '17:00', hora_fin: '19:00' }],
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const tipo = localStorage.getItem('tipo_usuario');
    this.isAdmin = tipo === 'admin';
    this.generarCalendario();
  }

  getFechaMock(dia: number): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  generarCalendario(): void {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.nombreMes = meses[this.mesActual];

    const primerDia = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0);

    // Lunes = 0, Domingo = 6
    let diaSemanaInicio = primerDia.getDay() - 1;
    if (diaSemanaInicio < 0) diaSemanaInicio = 6;

    this.vacios = Array(diaSemanaInicio).fill(0);
    this.diasDelMes = [];

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const fecha = `${this.anioActual}-${String(this.mesActual + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const disponibilidad = this.disponibilidadMock[fecha];

      const bloques: BloqueHorario[] = [];
      if (disponibilidad) {
        disponibilidad.forEach(disp => {
          const turno = parseInt(disp.hora_inicio) < 13 ? 'Mat' : 'Ves';
          bloques.push({
            horaIni: disp.hora_inicio,
            horaFin: disp.hora_fin,
            turno
          });
        });
      }

      this.diasDelMes.push({
        numero: d,
        fecha,
        disponible: !!disponibilidad,
        bloques
      });
    }
  }

  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.generarCalendario();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarCalendario();
  }

  irAgendar(fecha: string): void {
    this.router.navigate(['/agendar'], { queryParams: { fecha } });
  }

  eliminarFecha(fecha: string): void {
    if (confirm(`¿Eliminar todos los horarios del ${fecha}?`)) {
      delete this.disponibilidadMock[fecha];
      this.generarCalendario();
    }
  }
}