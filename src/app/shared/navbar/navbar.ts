import { Component, inject, signal } from '@angular/core';
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
  public readonly authService = inject(AuthService);
  
  // Control reactivo del menú móvil
  public isMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isMenuOpen.update(state => !state);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  cerrarSesion(): void {
    this.closeMenu();
    this.authService.logout();
  }
}