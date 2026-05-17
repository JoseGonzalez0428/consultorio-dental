import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TratamientosService } from '../../services/tratamientos';
import { Tratamiento } from '../../interfaces/tratamiento.interface';

@Component({
  selector: 'app-gestionar-tratamientos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './gestionar-tratamientos.html',
  styleUrl: './gestionar-tratamientos.css'
})
export class GestionarTratamientos implements OnInit {

  private fb = inject(FormBuilder);
  public tratamientosService = inject(TratamientosService);

  tratamientoEditando: Tratamiento | null = null;

  tratamientoForm = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    precio: ['', [Validators.required]],
    imagen: ['', [Validators.required]],
    recomendaciones: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.tratamientosService.fetchTratamientos();
  }

  onSubmit(): void {
    if (this.tratamientoForm.invalid) return;

    const recomendaciones = this.tratamientoForm.value.recomendaciones!
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const tratamiento: Tratamiento = {
      nombre: this.tratamientoForm.value.nombre!,
      descripcion: this.tratamientoForm.value.descripcion!,
      precio: this.tratamientoForm.value.precio!,
      imagen: this.tratamientoForm.value.imagen!,
      recomendaciones
    };

    if (this.tratamientoEditando) {
      this.tratamientosService.actualizarTratamiento(
        this.tratamientoEditando._id!,
        tratamiento
      );
    } else {
      this.tratamientosService.crearTratamiento(tratamiento);
    }

    this.cancelarEdicion();
  }

  editarTratamiento(tratamiento: Tratamiento): void {
    this.tratamientoEditando = tratamiento;
    this.tratamientoForm.setValue({
      nombre: tratamiento.nombre,
      descripcion: tratamiento.descripcion,
      precio: tratamiento.precio,
      imagen: tratamiento.imagen,
      recomendaciones: tratamiento.recomendaciones.join('\n')
    });
  }

  cancelarEdicion(): void {
    this.tratamientoEditando = null;
    this.tratamientoForm.reset();
  }

  eliminarTratamiento(id: string): void {
    if (!confirm('¿Seguro que quieres eliminar este tratamiento?')) return;
    this.tratamientosService.eliminarTratamiento(id);
  }
}