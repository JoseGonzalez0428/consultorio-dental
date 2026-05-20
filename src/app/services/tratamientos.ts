import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tratamiento } from '../interfaces/tratamiento.interface';

@Injectable({
  providedIn: 'root'
})
export class TratamientosService {

  private http = inject(HttpClient);

  private readonly BASE_URL = 'http://localhost:3000/api';

  private _tratamientos = signal<Tratamiento[]>([]);
  public tratamientos = this._tratamientos.asReadonly();

  private _tratamientoSeleccionado = signal<Tratamiento | null>(null);
  public tratamientoSeleccionado = this._tratamientoSeleccionado.asReadonly();

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  fetchTratamientos(): void {
    this.isLoading.set(true);
    this.http.get<Tratamiento[]>(`${this.BASE_URL}/tratamientos`).subscribe({
      next: (response) => {
        this._tratamientos.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar tratamientos.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  fetchTratamientoById(id: string): void {
    this.isLoading.set(true);
    this.http.get<Tratamiento>(`${this.BASE_URL}/tratamientos/${id}`).subscribe({
      next: (response) => {
        this._tratamientoSeleccionado.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar tratamiento.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  crearTratamiento(formData: FormData): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.post<any>(`${this.BASE_URL}/tratamientos`, formData).subscribe({
      next: () => {
        this.successMessage.set('Tratamiento creado correctamente.');
        this.fetchTratamientos();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al crear tratamiento.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  actualizarTratamiento(id: string, formData: FormData): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.put<any>(`${this.BASE_URL}/tratamientos/${id}`, formData).subscribe({
      next: () => {
        this.successMessage.set('Tratamiento actualizado correctamente.');
        this.fetchTratamientos();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al actualizar tratamiento.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  eliminarTratamiento(id: string): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.delete<any>(`${this.BASE_URL}/tratamientos/${id}`).subscribe({
      next: () => {
        this.successMessage.set('Tratamiento eliminado correctamente.');
        this.fetchTratamientos();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al eliminar tratamiento.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  seleccionarTratamiento(tratamiento: Tratamiento): void {
    this._tratamientoSeleccionado.set(tratamiento);
  }

  limpiarSeleccion(): void {
    this._tratamientoSeleccionado.set(null);
  }
}