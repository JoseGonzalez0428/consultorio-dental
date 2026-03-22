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
    if(this.carruselInterval){
      clearInterval(this.carruselInterval);
    }
  }

  iniciarCarrusel(): void {
    const carrusel = document.getElementById('CarruselTratamientos');
    if(carrusel){
      let currentIndex = 0;
      const slides = carrusel.children;
      this.carruselInterval = setInterval(() => {
        slides[currentIndex].scrollIntoView({ behavior: 'smooth' });
        currentIndex = (currentIndex + 1) % slides.length;
      }, 3500);
    }
  }
}
