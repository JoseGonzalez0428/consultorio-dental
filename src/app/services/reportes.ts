import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reporte, ReporteRequest } from '../interfaces/reporte.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);

  private readonly BASE_URL = 'http://localhost:3000/api';

  private _reportes = signal<Reporte[]>([]);
  public reportes = this._reportes.asReadonly();

  private _totalReportes = signal<number>(0);
  public totalReportes = this._totalReportes.asReadonly();

  private _citasPasadas = signal<any[]>([]);
  public citasPasadas = this._citasPasadas.asReadonly();

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  readonly reportesPorPagina = 3;

  fetchReportes(pagina: number = 1): void {
    this.isLoading.set(true);
    const offset = (pagina - 1) * this.reportesPorPagina;

    this.http.get<{ total: number, reportes: Reporte[] }>(
      `${this.BASE_URL}/reportes?limit=${this.reportesPorPagina}&offset=${offset}`
    ).subscribe({
      next: (response) => {
        this._reportes.set(response.reportes);
        this._totalReportes.set(response.total);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar reportes.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  fetchCitasPasadasPorFecha(fecha: string): void {
    this.isLoading.set(true);
    this.http.get<any[]>(`${this.BASE_URL}/reportes/citas-pasadas?fecha=${fecha}`).subscribe({
      next: (response) => {
        this._citasPasadas.set(response);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al cargar citas.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  crearReporte(reporte: ReporteRequest): void {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.http.post<any>(`${this.BASE_URL}/reportes`, reporte).subscribe({
      next: () => {
        this.successMessage.set('Reporte creado correctamente.');
        this.fetchReportes();
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al crear reporte.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}