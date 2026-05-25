import { Component, signal, output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmacion.html',
  styleUrl: './modal-confirmacion.css'
})
export class ModalConfirmacion {

  visible = signal(false);
  titulo = signal('¿Confirmar acción?');
  mensaje = signal('¿Estás seguro de que deseas realizar esta acción?');
  textoConfirmar = signal('Confirmar');
  claseBoton = signal('BtnModalConfirmar');

  confirmado = output<void>();
  cancelado = output<void>();

  private accionPendiente: (() => void) | null = null;

  abrir(opciones: {
    titulo: string;
    mensaje: string;
    textoConfirmar?: string;
    tipo?: 'danger' | 'warning' | 'success';
    accion: () => void;
  }): void {
    this.titulo.set(opciones.titulo);
    this.mensaje.set(opciones.mensaje);
    this.textoConfirmar.set(opciones.textoConfirmar ?? 'Confirmar');
    this.claseBoton.set(opciones.tipo === 'danger' ? 'BtnModalEliminar' : 'BtnModalConfirmar');
    this.accionPendiente = opciones.accion;
    this.visible.set(true);
  }

  confirmar(): void {
    if (this.accionPendiente) {
      this.accionPendiente();
    }
    this.visible.set(false);
    this.accionPendiente = null;
    this.confirmado.emit();
  }

  cancelar(): void {
    this.visible.set(false);
    this.accionPendiente = null;
    this.cancelado.emit();
  }
}