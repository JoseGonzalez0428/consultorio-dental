import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReportesService } from '../../services/reportes';

@Component({
  selector: 'app-crear-reporte',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-reporte.html',
  styleUrl: './crear-reporte.css'
})
export class CrearReporte implements OnInit {

  private fb = inject(FormBuilder);
  public reportesService = inject(ReportesService);

  ayer: string = '';

  reporteForm = this.fb.group({
    fecha: ['', [Validators.required]],
    id_cita: ['', [Validators.required]],
    notas: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    this.ayer = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  cargarCitas(): void {
    const fecha = this.reporteForm.value.fecha;
    if (fecha) {
      this.reportesService.fetchCitasPasadasPorFecha(fecha);
      this.reporteForm.controls.id_cita.reset();
    }
  }

  onSubmit(): void {
    if (this.reporteForm.invalid) return;

    this.reportesService.crearReporte({
      id_cita: this.reporteForm.value.id_cita!,
      notas: this.reporteForm.value.notas!
    });

    this.reporteForm.reset();
  }
}