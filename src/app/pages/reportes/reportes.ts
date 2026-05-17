import { Component, OnInit, inject, computed } from '@angular/core';
import { ReportesService } from '../../services/reportes';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  public reportesService = inject(ReportesService);

  paginaActual: number = 1;

  totalPaginas = computed(() =>
    Math.ceil(this.reportesService.totalReportes() / this.reportesService.reportesPorPagina)
  );

  ngOnInit(): void {
    this.reportesService.fetchReportes(this.paginaActual);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) return;
    this.paginaActual = pagina;
    this.reportesService.fetchReportes(this.paginaActual);
  }
}