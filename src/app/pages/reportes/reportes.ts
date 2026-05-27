import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes';
import { Reporte } from '../../interfaces/reporte.interface';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  public reportesService = inject(ReportesService);

  paginaActual: number = 1;
  reporteEditandoId: string | null = null;
  notasEditando: string = '';

  modalVisible = signal(false);
  modalTitulo = signal('');
  modalMensaje = signal('');
  modalTextoConfirmar = signal('');
  private modalAccion: (() => void) | null = null;

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

  editarReporte(reporte: Reporte): void {
    this.reporteEditandoId = reporte._id!;
    this.notasEditando = reporte.notas;
  }

  cancelarEdicion(): void {
    this.reporteEditandoId = null;
    this.notasEditando = '';
  }

  guardarReporte(id: string): void {
    if (!this.notasEditando.trim()) return;
    this.abrirModal({
      titulo: 'Actualizar reporte',
      mensaje: '¿Confirmas que deseas guardar los cambios en este reporte?',
      textoConfirmar: 'Guardar',
      accion: () => {
        this.reportesService.actualizarReporte(id, this.notasEditando);
        this.cancelarEdicion();
      }
    });
  }

  eliminarReporte(id: string): void {
    this.abrirModal({
      titulo: 'Eliminar reporte',
      mensaje: '¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.',
      textoConfirmar: 'Eliminar',
      accion: () => this.reportesService.eliminarReporte(id)
    });
  }

  abrirModal(opciones: {
    titulo: string;
    mensaje: string;
    textoConfirmar: string;
    accion: () => void;
  }): void {
    this.modalTitulo.set(opciones.titulo);
    this.modalMensaje.set(opciones.mensaje);
    this.modalTextoConfirmar.set(opciones.textoConfirmar);
    this.modalAccion = opciones.accion;
    this.modalVisible.set(true);
  }

  confirmarModal(): void {
    if (this.modalAccion) this.modalAccion();
    this.modalVisible.set(false);
  }

  cancelarModal(): void {
    this.modalVisible.set(false);
  }
}