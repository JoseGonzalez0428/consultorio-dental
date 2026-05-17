import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TratamientosService } from '../../services/tratamientos';

@Component({
  selector: 'app-tratamiento-detalle',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './tratamiento-detalle.html',
  styleUrl: './tratamiento-detalle.css'
})
export class TratamientoDetalle implements OnInit {

  public tratamientosService = inject(TratamientosService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tratamientosService.fetchTratamientoById(id);
    }
  }
}