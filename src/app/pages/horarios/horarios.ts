import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HorariosService } from '../../services/horarios';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css'
})
export class Horarios implements OnInit {

  public horariosService = inject(HorariosService);
  public authService = inject(AuthService);
  private router = inject(Router);

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  ngOnInit(): void {
    this.horariosService.fetchHorarios();
  }

  irAgendar(fecha: string): void {
    this.router.navigate(['/agendar'], { queryParams: { fecha } });
  }

  eliminarFecha(fecha: string): void {
    if (confirm(`¿Eliminar todos los horarios del ${fecha}?`)) {
      this.horariosService.eliminarHorario(fecha);
    }
  }
}