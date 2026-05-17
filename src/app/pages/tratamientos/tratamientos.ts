import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TratamientosService } from '../../services/tratamientos';

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [],
  templateUrl: './tratamientos.html',
  styleUrl: './tratamientos.css'
})
export class Tratamientos implements OnInit {

  public tratamientosService = inject(TratamientosService);
  private router = inject(Router);

  ngOnInit(): void {
    this.tratamientosService.fetchTratamientos();
  }

  verTratamiento(id: string): void {
    this.router.navigate(['/tratamiento', id]);
  }
}