import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest } from '../interfaces/usuario.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly BASE_URL = environment.apiUrl;

  private _token = signal<string | null>(localStorage.getItem('token'));
  private _tipoUsuario = signal<string | null>(localStorage.getItem('tipo_usuario'));
  private _nombreUsuario = signal<string | null>(localStorage.getItem('nombre_usuario'));
  private _sexoUsuario = signal<string | null>(localStorage.getItem('sexo_usuario'));

  public isLoggedIn = computed(() => !!this._token());
  public tipoUsuario = computed(() => this._tipoUsuario());
  public nombreUsuario = computed(() => this._nombreUsuario());
  public saludo = computed(() => this._sexoUsuario() === 'Femenino' ? 'Bienvenida' : 'Bienvenido');
  public isAdmin = computed(() => this._tipoUsuario() === 'admin');

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  getToken(): string | null {
    return this._token();
  }

  login(credentials: LoginRequest): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.post<LoginResponse>(`${this.BASE_URL}/auth/login`, credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('tipo_usuario', response.tipo_usuario);
        localStorage.setItem('nombre_usuario', response.nombre);
        localStorage.setItem('sexo_usuario', response.sexo);

        this._token.set(response.token);
        this._tipoUsuario.set(response.tipo_usuario);
        this._nombreUsuario.set(response.nombre);
        this._sexoUsuario.set(response.sexo);

        if (response.tipo_usuario === 'admin') {
          this.router.navigate(['/gestionar-horarios']);
        } else {
          this.router.navigate(['/inicio']);
        }
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al iniciar sesión.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  register(data: RegisterRequest): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.post<any>(`${this.BASE_URL}/auth/register`, data).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        this.errorMessage.set(error.error.msg ?? 'Error al registrarse.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('sexo_usuario');

    this._token.set(null);
    this._tipoUsuario.set(null);
    this._nombreUsuario.set(null);
    this._sexoUsuario.set(null);

    this.router.navigate(['/login']);
  }
}