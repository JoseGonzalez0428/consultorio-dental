import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface Tratamiento {
  id: string;
  nombre: string;
  imagen: string;
  precio: string;
  descripcion: string;
  recomendaciones: string[];
}

@Component({
  selector: 'app-tratamiento-detalle',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './tratamiento-detalle.html',
  styleUrls: ['./tratamiento-detalle.css']
})
export class TratamientoDetalle implements OnInit {

  tratamiento: Tratamiento | null = null;

  private catalogoTratamientos: Tratamiento[] = [
    {
      id: 'consulta',
      nombre: 'Consulta general',
      imagen: 'consulta.jpg',
      precio: '$250',
      descripcion: 'Evaluación inicial donde se revisa tu salud bucal, se detectan problemas y se plantea un plan de tratamiento personalizado.',
      recomendaciones: [
        'Primera visita al consultorio.',
        'Dolor o molestia en dientes o encías.',
        'Chequeo de rutina.',
        'Valoración previa a ortodoncia u otros tratamientos.'
      ]
    },
    {
      id: 'ortodoncia',
      nombre: 'Ortodoncia',
      imagen: 'ortodoncia.jpg',
      precio: '$5000+',
      descripcion: 'Tratamiento que corrige la posición de los dientes y mandíbula, mejorando la estética y función de tu sonrisa.',
      recomendaciones: [
        'Dientes desalineados o apiñados.',
        'Mordida cruzada, abierta o profunda.',
        'Espacios entre dientes.',
        'Problemas funcionales al morder o hablar.'
      ]
    },
    {
      id: 'limpieza',
      nombre: 'Limpieza dental',
      imagen: 'limpieza.jpg',
      precio: '$700',
      descripcion: 'Eliminación profesional de placa, sarro y manchas para mantener encías y dientes saludables.',
      recomendaciones: [
        'Prevención de caries y enfermedades periodontales.',
        'Mal aliento persistente.',
        'Encías inflamadas o sangrantes.',
        'Como complemento a tu rutina de higiene bucal.'
      ]
    },
    {
      id: 'extraccion',
      nombre: 'Extracción dental',
      imagen: 'extraccion.jpg',
      precio: '$700',
      descripcion: 'La extracción dental es un procedimiento en el que se remueve un diente de la cavidad oral. Se realiza cuando un diente está gravemente dañado, infectado, presenta caries profundas, está afectando la alineación de los demás dientes o si es necesario por razones ortodónticas.',
      recomendaciones: [
        'Dientes con caries severa que no pueden ser restaurados.',
        'Infecciones que han dañado el diente y el hueso circundante.',
        'Dientes fracturados que no pueden repararse.',
        'Dientes de leche que no han caído de manera natural y afectan la erupción de dientes permanentes.',
        'Extracción de muelas del juicio que pueden causar dolor, infección o apiñamiento.'
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.tratamiento = this.catalogoTratamientos.find(t => t.id === id) ?? null;
  }
}