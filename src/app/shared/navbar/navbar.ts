import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  tipoUsuario: string | null = null;
  nombreUsuario: string = '';
  saludo: string = '';

  private routerSub: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();

    // Se vuelve a ejecutar cada vez que el usuario navega a una nueva página
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarDatosUsuario();
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  cargarDatosUsuario(): void {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipo_usuario');
    const nombre = localStorage.getItem('nombre_usuario');
    const sexo = localStorage.getItem('sexo_usuario');

    if (token && tipo) {
      this.isAuthenticated = true;
      this.tipoUsuario = tipo;
      this.nombreUsuario = nombre ?? '';
      this.saludo = sexo === 'Femenino' ? 'Bienvenida' : 'Bienvenido';
    } else {
      this.isAuthenticated = false;
      this.tipoUsuario = null;
    }
  }

  toggleMenu(): void {
    const menu = document.getElementById('Menu');
    menu?.classList.toggle('MenuAbierto');
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('sexo_usuario');
    this.isAuthenticated = false;
    this.tipoUsuario = null;
    this.router.navigate(['/inicio']);
  }
}