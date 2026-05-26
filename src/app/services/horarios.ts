import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Horario, DiaCalendario, BloqueHorarioCalendario } from '../interfaces/horario.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private http = inject(HttpClient);

  private readonly BASE_URL = environment.apiUrl;

  private _horarios = signal<Horario[]>([]);
  public horarios = this._horarios.asReadonly();

  private _diasCalendario = signal<DiaCalendario[]>([]);
  public diasCalendario = this._diasCalendario.asReadonly();

  private _vacios = signal<number[]>([]);
  public vacios = this._vacios.asReadonly();

  private _nombreMes = signal<string>('');
  public nombreMes = this._nombreMes.asReadonly();

  private _mesActual = signal<number>(new Date().getMonth());
  private _anioActual = signal<number>(new Date().getFullYear());
  public mesActual = this._mesActual.asReadonly();
  public anioActual = this._anioActual.asReadonly();

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  private meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  fetchHorarios(): void {
    this.isLoading.set(true);
    const mes = this._mesActual() + 1;
    const anio = this._anioActual();

    this.http.get<Horario[]>(`${this.BASE_URL}/horarios?mes=${mes}&anio=${anio}`).subscribe({
      next: (response) => {
        this._horarios.set(response);
        this.generarCalendario(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar horarios.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  generarCalendario(horarios: Horario[]): void {
    const mes = this._mesActual();
    const anio = this._anioActual();

    this._nombreMes.set(this.meses[mes]);

    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);

    let diaSemanaInicio = primerDia.getDay() - 1;
    if (diaSemanaInicio < 0) diaSemanaInicio = 6;

    this._vacios.set(Array(diaSemanaInicio).fill(0));

    const disponibilidadMap: { [fecha: string]: Horario[] } = {};
    horarios.forEach(h => {
      if (!disponibilidadMap[h.fecha]) {
        disponibilidadMap[h.fecha] = [];
      }
      disponibilidadMap[h.fecha].push(h);
    });

    const dias: DiaCalendario[] = [];
    const hoy = new Date().toISOString().split('T')[0];

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const fecha = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const disponibilidad = disponibilidadMap[fecha];

      const bloques: BloqueHorarioCalendario[] = [];
      if (disponibilidad) {
        disponibilidad.forEach(disp => {
          const turno = parseInt(disp.hora_inicio) < 13 ? 'Mat' : 'Ves';
          bloques.push({
            id: disp._id ?? '',
            horaIni: disp.hora_inicio,
            horaFin: disp.hora_fin,
            turno
          });
        });
      }

      dias.push({
        numero: d,
        fecha,
        disponible: !!disponibilidad && fecha >= hoy,
        bloques,
        badge: disponibilidad ? `${bloques.length} bloq` : undefined,
        clicable: !!disponibilidad && fecha >= hoy
      });
    }

    this._diasCalendario.set(dias);
  }

  mesAnterior(): void {
    if (this._mesActual() === 0) {
      this._mesActual.set(11);
      this._anioActual.update(a => a - 1);
    } else {
      this._mesActual.update(m => m - 1);
    }
    this.fetchHorarios();
  }

  mesSiguiente(): void {
    if (this._mesActual() === 11) {
      this._mesActual.set(0);
      this._anioActual.update(a => a + 1);
    } else {
      this._mesActual.update(m => m + 1);
    }
    this.fetchHorarios();
  }

  agregarHorario(horario: Horario): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.post<any>(`${this.BASE_URL}/horarios`, horario).subscribe({
      next: () => {
        this.successMessage.set('Horario agregado correctamente.');
        this.fetchHorarios();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al agregar horario.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  eliminarHorario(fecha: string): void {
    this.isLoading.set(true);
    this.http.delete<any>(`${this.BASE_URL}/horarios/${fecha}`).subscribe({
      next: () => {
        this.fetchHorarios();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al eliminar horario.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  eliminarHorarioPorId(id: string): void {
    this.isLoading.set(true);
    this.http.delete<any>(`${this.BASE_URL}/horarios/bloque/${id}`).subscribe({
      next: () => {
        this.fetchHorarios();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al eliminar el horario.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}