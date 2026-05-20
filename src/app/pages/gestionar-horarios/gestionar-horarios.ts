import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HorariosService } from '../../services/horarios';
import { DiaCalendario } from '../../interfaces/horario.interface';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './gestionar-horarios.html',
  styleUrl: './gestionar-horarios.css'
})
export class GestionarHorarios implements OnInit {

  private fb = inject(FormBuilder);
  public horariosService = inject(HorariosService);

  diasSemana: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  private _diaSeleccionado = signal<DiaCalendario | null>(null);
  public diaSeleccionadoObjeto = computed(() => {
    const fecha = this._diaSeleccionado()?.fecha;
    if (!fecha) return null;
    return this.horariosService.diasCalendario().find(d => d.fecha === fecha) ?? null;
  });

  horarioForm = this.fb.group({
    fecha: ['', [Validators.required]],
    hora_inicio: ['', [Validators.required]],
    hora_fin: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.horariosService.fetchHorarios();
  }

  seleccionarDia(dia: DiaCalendario): void {
    this._diaSeleccionado.set(dia);
    this.horarioForm.controls.fecha.setValue(dia.fecha);
  }

  eliminarBloque(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Desea eliminar este bloque de horario?')) {
      this.horariosService.eliminarHorarioPorId(id);
    }
  }

  eliminarFecha(fecha: string, event: Event): void {
    event.stopPropagation();
    if (confirm(`¿Desea eliminar todos los horarios del día ${fecha}?`)) {
      this.horariosService.eliminarHorario(fecha);
    }
  }

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