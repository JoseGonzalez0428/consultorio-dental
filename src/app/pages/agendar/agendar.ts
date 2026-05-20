import { Component, OnInit, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitasService } from '../../services/citas';
import { HorariosService } from '../../services/horarios';
import { TratamientosService } from '../../services/tratamientos';
import { BloqueHorario } from '../../interfaces/horario.interface';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './agendar.html',
  styleUrl: './agendar.css'
})
export class Agendar implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public citasService = inject(CitasService);
  public horariosService = inject(HorariosService);
  public tratamientosService = inject(TratamientosService);

  fechasDisponibles = computed(() =>
    this.horariosService.horarios()
      .map(h => h.fecha)
      .filter(f => f >= new Date().toISOString().split('T')[0])
      .filter((f, i, arr) => arr.indexOf(f) === i)
  );
  horasDisponibles: BloqueHorario[] = [];

  agendarForm = this.fb.group({
    id_tratamiento: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.tratamientosService.fetchTratamientos();
    this.horariosService.fetchHorarios();
    this.citasService.fetchHorasOcupadas();

    const fechaGet = this.route.snapshot.queryParamMap.get('fecha');
    if (fechaGet) {
      this.agendarForm.controls.fecha.setValue(fechaGet);
      this.cargarHoras(fechaGet);
    }

  }

  cargarHoras(fecha: string): void {
    this.horasDisponibles = [];
    const horarios = this.horariosService.horarios().filter(h => h.fecha === fecha);
    const ocupadas = this.citasService.horasOcupadas()[fecha] ?? [];

    horarios.forEach(disp => {
      const inicio = new Date(`2000-01-01T${disp.hora_inicio}`);
      const fin = new Date(`2000-01-01T${disp.hora_fin}`);

      while (inicio < fin) {
        const horaInicio = inicio.toTimeString().slice(0, 5);
        inicio.setHours(inicio.getHours() + 1);
        const horaFin = inicio.toTimeString().slice(0, 5);

        if (inicio <= fin && !ocupadas.includes(horaInicio)) {
          this.horasDisponibles.push({ inicio: horaInicio, fin: horaFin });
        }
      }
    });
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  onSubmit(): void {
    if (this.agendarForm.invalid) return;

    this.citasService.agendarCita({
      id_tratamiento: this.agendarForm.value.id_tratamiento!,
      fecha: this.agendarForm.value.fecha!,
      hora: this.agendarForm.value.hora!
    });

    this.agendarForm.reset();
    this.horasDisponibles = [];
  }
}