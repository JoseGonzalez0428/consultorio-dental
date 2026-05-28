import { Component, OnInit, OnDestroy, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResenasService } from '../../services/resenas';
import { AuthService } from '../../services/auth';
import { Resena } from '../../interfaces/resena.interface';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class Resenas implements OnInit, OnDestroy {

  idTratamiento = input.required<string>();

  public resenasService = inject(ResenasService);
  public authService = inject(AuthService);

  calificacionSeleccionada: number = 0;
  comentario: string = '';
  estrellas = [1, 2, 3, 4, 5];

  resenaEditandoId: string | null = null;
  calificacionEditando: number = 0;
  comentarioEditando: string = '';

  modalVisible = signal(false);
  modalTitulo = signal('');
  modalMensaje = signal('');
  modalTextoConfirmar = signal('');
  private modalAccion: (() => void) | null = null;

  ngOnInit(): void {
    this.resenasService.fetchResenas(this.idTratamiento());
    if (this.authService.isLoggedIn() && !this.authService.isAdmin()) {
      this.resenasService.verificarPuedeResenar(this.idTratamiento());
    }
  }

  ngOnDestroy(): void {
    this.resenasService.limpiar();
  }

  seleccionarEstrella(valor: number): void {
    this.calificacionSeleccionada = valor;
  }

  seleccionarEstrellaEdicion(valor: number): void {
    this.calificacionEditando = valor;
  }

  enviarResena(): void {
    if (!this.calificacionSeleccionada) {
      this.resenasService.errorMessage.set('Selecciona una calificación.');
      return;
    }
    this.resenasService.crearResena({
      id_tratamiento: this.idTratamiento(),
      calificacion: this.calificacionSeleccionada,
      comentario: this.comentario
    });
    this.calificacionSeleccionada = 0;
    this.comentario = '';
  }

  editarResena(resena: Resena): void {
    this.resenaEditandoId = resena._id!;
    this.calificacionEditando = resena.calificacion;
    this.comentarioEditando = resena.comentario;
  }

  cancelarEdicionResena(): void {
    this.resenaEditandoId = null;
    this.calificacionEditando = 0;
    this.comentarioEditando = '';
  }

  guardarResena(id: string): void {
    if (!this.calificacionEditando) return;
    this.abrirModal({
      titulo: 'Actualizar reseña',
      mensaje: '¿Confirmas que deseas guardar los cambios en tu reseña?',
      textoConfirmar: 'Guardar',
      accion: () => {
        this.resenasService.actualizarResena(
          id,
          this.calificacionEditando,
          this.comentarioEditando,
          this.idTratamiento()
        );
        this.cancelarEdicionResena();
      }
    });
  }

  eliminarResena(id: string): void {
    this.abrirModal({
      titulo: 'Eliminar reseña',
      mensaje: '¿Estás seguro de que deseas eliminar tu reseña?',
      textoConfirmar: 'Eliminar',
      accion: () => this.resenasService.eliminarResena(id, this.idTratamiento())
    });
  }

  esMiResena(resena: Resena): boolean {
    return resena.id_paciente === this.authService.userId();
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

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}