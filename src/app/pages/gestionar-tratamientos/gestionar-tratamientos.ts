import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TratamientosService } from '../../services/tratamientos';
import { Tratamiento } from '../../interfaces/tratamiento.interface';
import { ViewChild } from '@angular/core';
import { ModalConfirmacion } from '../../components/modal-confirmacion/modal-confirmacion';
@Component({
  selector: 'app-gestionar-tratamientos',
  standalone: true,
  imports: [ReactiveFormsModule, ModalConfirmacion],
  templateUrl: './gestionar-tratamientos.html',
  styleUrl: './gestionar-tratamientos.css'
})
export class GestionarTratamientos implements OnInit {

  @ViewChild('modal') modal!: ModalConfirmacion;
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  public tratamientosService = inject(TratamientosService);

  tratamientoEditando: Tratamiento | null = null;
  imagenSeleccionada: File | null = null;

  tratamientoForm = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    precio: ['', [Validators.required]],
    recomendaciones: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.tratamientosService.fetchTodosLosTratamientos();
  }

  imagenPreview: string | null = null;

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenSeleccionada = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.tratamientoForm.invalid) return;
    if (!this.tratamientoEditando && !this.imagenSeleccionada) {
      this.tratamientosService.errorMessage.set('La imagen es requerida.');
      return;
    }

    const recomendaciones = this.tratamientoForm.value.recomendaciones!
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const formData = new FormData();
    formData.append('nombre', this.tratamientoForm.value.nombre!);
    formData.append('descripcion', this.tratamientoForm.value.descripcion!);
    formData.append('precio', this.tratamientoForm.value.precio!);
    formData.append('recomendaciones', JSON.stringify(recomendaciones));

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    if (this.tratamientoEditando) {
      this.tratamientosService.actualizarTratamiento(
        this.tratamientoEditando._id!,
        formData
      );
    } else {
      this.tratamientosService.crearTratamiento(formData);
    }

    this.cancelarEdicion();
  }

  editarTratamiento(tratamiento: Tratamiento): void {
    this.tratamientoEditando = tratamiento;
    this.imagenSeleccionada = null;
    this.tratamientoForm.setValue({
      nombre: tratamiento.nombre,
      descripcion: tratamiento.descripcion,
      precio: tratamiento.precio,
      recomendaciones: tratamiento.recomendaciones.join('\n')
    });
  }

  cancelarEdicion(): void {
    this.tratamientoEditando = null;
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    this.tratamientoForm.reset();
  }

  eliminarTratamiento(id: string): void {
    this.modal.abrir({
      titulo: 'Desactivar tratamiento',
      mensaje: '¿Estás seguro de que deseas desactivar este tratamiento? Las citas pendientes asociadas serán canceladas.',
      textoConfirmar: 'Desactivar',
      tipo: 'danger',
      accion: () => this.tratamientosService.eliminarTratamiento(id)
    });
  }

  reactivarTratamiento(id: string): void {
    this.modal.abrir({
      titulo: 'Reactivar tratamiento',
      mensaje: '¿Deseas reactivar este tratamiento para que vuelva a estar disponible?',
      textoConfirmar: 'Reactivar',
      tipo: 'success',
      accion: () => this.tratamientosService.reactivarTratamiento(id)
    });
  }
}