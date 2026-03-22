import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar implements OnInit{
  isAuthenticated: boolean = false;
  tipoUsuario: string | null = null;
  nombreUsuario: string  = '';
  saludo: string = '';

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipo_usuario');
    const nombre = localStorage.getItem('nombre_usuario');
    const sexo = localStorage.getItem('sexo_usuario');

    if(token&&tipo){
      this.isAuthenticated = true;
      this.tipoUsuario = tipo;
      this.nombreUsuario = nombre ? nombre : '';
      this.saludo = sexo === 'femenino' ? 'Bienvenida' : 'Bienvenido';
    } else {
      this.isAuthenticated = false;
      this.tipoUsuario = null;
    }
  }

  toggleMenu(): void {
      const menu = document.querySelector('Menu');
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
