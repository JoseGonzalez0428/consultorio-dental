import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  isAuthenticated: boolean = false;
  tipoUsuario: string | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipo_usuario');

    if(token && tipo){
      this.isAuthenticated = true;
      this.tipoUsuario = tipo;
    }
  }
}
