import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'tratamientos', loadComponent: () => import('./pages/tratamientos/tratamientos').then(m => m.Tratamientos) },
  { path: 'tratamiento/:id', loadComponent: () => import('./pages/tratamiento-detalle/tratamiento-detalle').then(m => m.TratamientoDetalle) },
  { path: 'acerca', loadComponent: () => import('./pages/acerca-de/acerca-de').then(m => m.AcercaDe) },
  { path: 'horarios', loadComponent: () => import('./pages/horarios/horarios').then(m => m.Horarios) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro').then(m => m.Registro) },
  { path: 'agendar', loadComponent: () => import('./pages/agendar/agendar').then(m => m.Agendar), canActivate: [authGuard] },
  { path: 'mis-citas', loadComponent: () => import('./pages/mis-citas/mis-citas').then(m => m.MisCitas), canActivate: [authGuard] },
  { path: 'gestionar-citas', loadComponent: () => import('./pages/gestionar-citas/gestionar-citas').then(m => m.GestionarCitas), canActivate: [adminGuard] },
  { path: 'gestionar-horarios', loadComponent: () => import('./pages/gestionar-horarios/gestionar-horarios').then(m => m.GestionarHorarios), canActivate: [adminGuard] },
  { path: 'gestionar-tratamientos', loadComponent: () => import('./pages/gestionar-tratamientos/gestionar-tratamientos').then(m => m.GestionarTratamientos), canActivate: [adminGuard] },
  { path: 'crear-reporte', loadComponent: () => import('./pages/crear-reporte/crear-reporte').then(m => m.CrearReporte), canActivate: [adminGuard] },
  { path: 'reportes', loadComponent: () => import('./pages/reportes/reportes').then(m => m.Reportes), canActivate: [adminGuard] },
  { path: '**', redirectTo: 'inicio' }
];