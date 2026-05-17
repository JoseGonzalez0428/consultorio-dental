import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  authService = inject(AuthService);

  toggleMenu(): void {
    const menu = document.getElementById('Menu');
    menu?.classList.toggle('MenuAbierto');
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}