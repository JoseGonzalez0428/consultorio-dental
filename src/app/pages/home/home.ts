import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TratamientosService } from '../../services/tratamientos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private router = inject(Router);
  public tratamientosService = inject(TratamientosService);

  ngOnInit(): void {
    this.tratamientosService.fetchTratamientos();
  }

  verTratamiento(id: string): void {
    this.router.navigate(['/tratamiento', id]);
  }
}