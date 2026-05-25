import { Component, input, output } from '@angular/core';
import { DiaCalendario } from '../../interfaces/horario.interface';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario {

  dias = input<DiaCalendario[]>([]);
  vacios = input<number[]>([]);
  nombreMes = input<string>('');
  anioActual = input<number>(new Date().getFullYear());
  diaSeleccionado = input<string | null>(null);

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  diaClic = output<DiaCalendario>();
  anteriorClic = output<void>();
  siguienteClic = output<void>();
}