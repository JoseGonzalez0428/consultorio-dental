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
}