import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HorariosService } from '../../services/horarios';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './gestionar-horarios.html',
  styleUrl: './gestionar-horarios.css'
})
export class GestionarHorarios {

  private fb = inject(FormBuilder);
  public horariosService = inject(HorariosService);

  horarioForm = this.fb.group({
    fecha: ['', [Validators.required]],
    hora_inicio: ['', [Validators.required]],
    hora_fin: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.horarioForm.invalid) return;

    const { fecha, hora_inicio, hora_fin } = this.horarioForm.value;

    if (hora_inicio! >= hora_fin!) {
      this.horariosService.errorMessage.set('La hora de inicio debe ser menor que la hora de fin.');
      return;
    }

    this.horariosService.agregarHorario({
      fecha: fecha!,
      hora_inicio: hora_inicio!,
      hora_fin: hora_fin!
    });

    this.horarioForm.reset();
  }
}