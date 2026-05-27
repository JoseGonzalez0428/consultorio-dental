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
  reporteEditandoId = signal<string | null>(null);
  notasEditando = signal<string>('');

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
    console.log('editarReporte llamado', reporte);
    this.reporteEditandoId.set(reporte._id!);
    this.notasEditando.set(reporte.notas);
  }

  cancelarEdicion(): void {
    this.reporteEditandoId.set(null);
    this.notasEditando.set('');
  }

  guardarReporte(id: string): void {
    if (!this.notasEditando().trim()) return;
    this.abrirModal({
      titulo: 'Actualizar reporte',
      mensaje: '¿Confirmas que deseas guardar los cambios en este reporte?',
      textoConfirmar: 'Guardar',
      accion: () => {
        this.reportesService.actualizarReporte(id, this.notasEditando());
        this.cancelarEdicion();
      }
    });
  }

  eliminarReporte(id: string): void {
    console.log('eliminarReporte llamado', id);
    this.abrirModal({
      titulo: 'Eliminar reporte',
      mensaje: '¿Estás seguro de que deseas eliminar este reporte?',
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
    console.log('abrirModal llamado', opciones.titulo);
    this.modalTitulo.set(opciones.titulo);
    this.modalMensaje.set(opciones.mensaje);
    this.modalTextoConfirmar.set(opciones.textoConfirmar);
    this.modalAccion = opciones.accion;
    this.modalVisible.set(true);
  }

  confirmarModal(): void {
    console.log('confirmarModal llamado', this.modalAccion);
    if (this.modalAccion) this.modalAccion();
    this.modalVisible.set(false);
  }

  cancelarModal(): void {
    this.modalVisible.set(false);
  }
}