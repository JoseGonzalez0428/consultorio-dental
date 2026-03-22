import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [],
  templateUrl: './tratamientos.html',
  styleUrl: './tratamientos.css',
})
export class Tratamientos {
  tratamientos = [
    { id: 'consulta', nombre: 'Consulta general', imagen: 'consulta.jpg' },
    { id: 'ortodoncia', nombre: 'Ortodoncia', imagen: 'ortodoncia.jpg' },
    { id: 'limpieza', nombre: 'Limpieza dental', imagen: 'limpieza.jpg' },
    { id: 'extraccion', nombre: 'Extracción dental', imagen: 'extraccion.jpg' }
  ];

  constructor(private router: Router) {}

  verTratamiento(id: string): void {
    this.router.navigate(['/tratamiento', id]);
  }
}
