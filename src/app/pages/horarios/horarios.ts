import { Component, OnInit, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HorariosService } from '../../services/horarios';
import { AuthService } from '../../services/auth';
import { CitasService } from '../../services/citas';
import { Calendario } from '../../shared/calendario/calendario';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [Calendario],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css'
})
export class Horarios implements OnInit {

  public horariosService = inject(HorariosService);
  public authService = inject(AuthService);
  public citasService = inject(CitasService);
  private router = inject(Router);

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  ngOnInit(): void {
    this.horariosService.fetchHorarios();
    this.citasService.fetchHorasOcupadas();
  }

  tieneHorasDisponibles(fecha: string): boolean {
    const horariosDeFecha = this.horariosService.horarios().filter(h => h.fecha === fecha);
    const ocupadas = this.citasService.horasOcupadas()[fecha] ?? [];

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

    return bloques.some(b => !ocupadas.includes(b));
  }

  bloquesDisponibles(fecha: string): number {
    const horariosDeFecha = this.horariosService.horarios().filter(h => h.fecha === fecha);
    const ocupadas = this.citasService.horasOcupadas()[fecha] ?? [];

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

    return bloques.filter(b => !ocupadas.includes(b)).length;
  }

  irAgendar(fecha: string): void {
    this.router.navigate(['/agendar'], { queryParams: { fecha } });
  }

  diasConBadge = computed(() => {
    const ocupadas = this.citasService.horasOcupadas();
    
    return this.horariosService.diasCalendario().map(dia => {
      if (!dia.disponible) return { ...dia, badge: undefined, clicable: false };

      const ocupadasDeFecha = ocupadas[dia.fecha] ?? [];
      const disponibles = dia.bloques.filter(b => !ocupadasDeFecha.includes(b.horaIni));

      if (disponibles.length === 0) {
        return { ...dia, badge: 'Sin espacio', clicable: false };
      }

      return { 
        ...dia, 
        badge: `${disponibles.length} disponibles`,
        clicable: true
      };
    });
  });
}