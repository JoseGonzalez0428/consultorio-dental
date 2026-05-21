import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita, CitaRequest } from '../interfaces/cita.interface';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private http = inject(HttpClient);

  private readonly BASE_URL = 'http://localhost:3000/api';

  private _citas = signal<Cita[]>([]);
  public citas = this._citas.asReadonly();

  private _fechasConCitas = signal<string[]>([]);
  public fechasConCitas = this._fechasConCitas.asReadonly();

  private _citasPorFecha = signal<Cita[]>([]);
  public citasPorFecha = this._citasPorFecha.asReadonly();

  private _horasOcupadas = signal<{ [fecha: string]: string[] }>({});
  public horasOcupadas = this._horasOcupadas.asReadonly();

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  fetchMisCitas(): void {
    this.isLoading.set(true);
    this.http.get<Cita[]>(`${this.BASE_URL}/citas/mis-citas`).subscribe({
      next: (response) => {
        this._citas.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar las citas.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  fetchFechasConCitas(): void {
    this.http.get<string[]>(`${this.BASE_URL}/citas/fechas`).subscribe({
      next: (response) => {
        this._fechasConCitas.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al obtener fechas.');
      }
    });
  }

  fetchCitasPorFecha(fecha: string): void {
    if (!fecha) return;
    this.isLoading.set(true);
    this.http.get<Cita[]>(`${this.BASE_URL}/citas?fecha=${fecha}`).subscribe({
      next: (response) => {
        this._citasPorFecha.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar las citas.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  fetchHorasOcupadas(): void {
    this.http.get<{ [fecha: string]: string[] }>(`${this.BASE_URL}/citas/ocupadas`).subscribe({
      next: (response) => {
        this._horasOcupadas.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar horas ocupadas.');
      }
    });
  }

  agendarCita(cita: CitaRequest): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.post<any>(`${this.BASE_URL}/citas`, cita).subscribe({
      next: () => {
        this.successMessage.set('Cita agendada correctamente. Se enviará un correo de confirmación.');
        this.fetchMisCitas();
        this.fetchHorasOcupadas();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al agendar la cita.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  modificarCita(id: string, fecha: string, hora: string): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.put<any>(`${this.BASE_URL}/citas/${id}`, { fecha, hora }).subscribe({
      next: () => {
        this.successMessage.set('Cita modificada correctamente.');
        this.fetchMisCitas();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al modificar la cita.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  cancelarCita(id: string): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.put<any>(`${this.BASE_URL}/citas/${id}/cancelar`, {}).subscribe({
      next: () => {
        this.successMessage.set('Cita cancelada correctamente.');
        this.fetchMisCitas();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cancelar la cita.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  completarCita(id: string): void {
    this.isLoading.set(true);
    this.http.put<any>(`${this.BASE_URL}/citas/${id}/completar`, {}).subscribe({
      next: () => {
        this.successMessage.set('Cita completada correctamente.');
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al completar la cita.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  cancelarCitaAdmin(id: string, fecha: string): void {
    this.isLoading.set(true);
    this.http.put<any>(`${this.BASE_URL}/citas/${id}/cancelar-admin`, {}).subscribe({
      next: () => {
        this.fetchCitasPorFecha(fecha);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cancelar la cita.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  completarCitaAdmin(id: string, fecha: string): void {
    this.isLoading.set(true);
    this.http.put<any>(`${this.BASE_URL}/citas/${id}/completar`, {}).subscribe({
      next: () => {
        this.fetchCitasPorFecha(fecha);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al completar la cita.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}