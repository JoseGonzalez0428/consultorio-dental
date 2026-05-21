import { Component, OnInit, inject, signal, computed} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HorariosService } from '../../services/horarios';
import { DiaCalendario } from '../../interfaces/horario.interface';
import { ViewChild } from '@angular/core';
import { ModalConfirmacion } from '../../shared/modal-confirmacion/modal-confirmacion';
import { Calendario } from '../../shared/calendario/calendario';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [ReactiveFormsModule, ModalConfirmacion, Calendario],
  templateUrl: './gestionar-horarios.html',
  styleUrl: './gestionar-horarios.css'
})
export class GestionarHorarios implements OnInit {

  private fb = inject(FormBuilder);
  public horariosService = inject(HorariosService);
  modalVisible = signal(false);
  modalTitulo = signal('');
  modalMensaje = signal('');
  modalTextoConfirmar = signal('');
  modalTipo = signal<'danger' | 'warning' | 'success'>('danger');
  private modalAccion: (() => void) | null = null;

  abrirModal(opciones: {
    titulo: string;
    mensaje: string;
    textoConfirmar?: string;
    tipo?: 'danger' | 'warning' | 'success';
    accion: () => void;
  }): void {
    this.modalTitulo.set(opciones.titulo);
    this.modalMensaje.set(opciones.mensaje);
    this.modalTextoConfirmar.set(opciones.textoConfirmar ?? 'Confirmar');
    this.modalTipo.set(opciones.tipo ?? 'danger');
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
    this.abrirModal({
      titulo: 'Eliminar bloque',
      mensaje: '¿Deseas eliminar este bloque de horario?',
      textoConfirmar: 'Eliminar',
      tipo: 'danger',
      accion: () => this.horariosService.eliminarHorarioPorId(id)
    });
  }

  eliminarFecha(fecha: string, event: Event): void {
    event.stopPropagation();
    this.abrirModal({
      titulo: 'Eliminar horarios',
      mensaje: `¿Deseas eliminar todos los horarios del día ${this.formatearFecha(fecha)}?`,
      textoConfirmar: 'Eliminar',
      tipo: 'danger',
      accion: () => this.horariosService.eliminarHorario(fecha)
    });
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
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