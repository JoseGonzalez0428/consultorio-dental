import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resena, ResenaRequest, PuedeResenar } from '../interfaces/resena.interface';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {

  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/api';

  private _resenas = signal<Resena[]>([]);
  public resenas = this._resenas.asReadonly();

  private _puedeResenar = signal<PuedeResenar>({ puede: false });
  public puedeResenar = this._puedeResenar.asReadonly();

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  fetchResenas(idTratamiento: string): void {
    this._resenas.set([]);
    this.isLoading.set(true);
    this.http.get<Resena[]>(`${this.BASE_URL}/resenas/${idTratamiento}`).subscribe({
      next: (response) => {
        this._resenas.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar reseñas.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  verificarPuedeResenar(idTratamiento: string): void {
    this._puedeResenar.set({ puede: false });
    this.http.get<PuedeResenar>(`${this.BASE_URL}/resenas/${idTratamiento}/puede-resenar`).subscribe({
      next: (response) => {
        this._puedeResenar.set(response);
      },
      error: () => {
        this._puedeResenar.set({ puede: false });
      }
    });
  }

  crearResena(resena: ResenaRequest): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.post<any>(`${this.BASE_URL}/resenas`, resena).subscribe({
      next: () => {
        this.successMessage.set('Reseña publicada correctamente.');
        this._puedeResenar.set({ puede: false, razon: 'ya_reseno' });
        this.fetchResenas(resena.id_tratamiento);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al crear la reseña.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  limpiar(): void {
    this._resenas.set([]);
    this._puedeResenar.set({ puede: false });
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}