import { Component, OnInit, OnDestroy, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResenasService } from '../../services/resenas';
import { AuthService } from '../../services/auth';

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

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}