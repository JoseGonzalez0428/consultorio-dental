import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  private carruselInterval: any;
  
  ngOnInit(): void {
    this.iniciarCarrusel();
  }

  ngOnDestroy(): void {
    if (this.carruselInterval) {
      clearInterval(this.carruselInterval);
    }
  }

  iniciarCarrusel(): void {
    // Apuntamos al contenedor interno flexible
    const carruselInner = document.getElementById('CarruselInner');
    if (carruselInner) {
      let currentIndex = 0;
      const totalSlides = carruselInner.children.length;

      this.carruselInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        // Desplaza el contenedor horizontalmente basándose en el índice actual (0%, -100%, -200%)
        carruselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
      }, 3800); // 3.8 segundos para dar una lectura calmada a los textos
    }
  }
}