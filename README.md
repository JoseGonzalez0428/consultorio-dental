# Consultorio Dental — Frontend

Aplicación web desarrollada con **Angular 19** (Standalone Components) para el sistema de gestión del Consultorio Odontológico Integral Flores. Permite a los pacientes agendar citas, consultar tratamientos y dejar reseñas; y a la administradora gestionar citas, horarios, tratamientos y reportes clínicos.

---

## Tecnologías

- **Angular 19** — Standalone Components, Signals, nueva sintaxis de templates
- **TypeScript**
- **RxJS** — para manejo de peticiones HTTP
- **Firebase Hosting** — deploy del frontend en producción

---

## Requisitos previos

- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- Backend corriendo (ver README del backend)

---

## Instalación

```bash
git clone https://github.com/JoseGonzalez0428/consultorio-dental.git
cd consultorio-dental
npm install
ng serve
```

La aplicación corre en `http://localhost:4200`

---

## Variables de entorno

El proyecto usa archivos de environment para manejar la URL del backend:

**`src/environments/environment.ts`** (desarrollo local):
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
};
```

**`src/environments/environment.prod.ts`** (producción):
```typescript
export const environment = {
    production: true,
    apiUrl: 'https://consultorio-dental-api.onrender.com/api'
};
```

---

## Estructura del proyecto

```
src/app/
├── components/               ← Componentes reutilizables
│   ├── calendario/           ← Calendario mensual interactivo
│   ├── modal-confirmacion/   ← Modal de confirmación de acciones
│   └── resenas/              ← Módulo de reseñas de tratamientos
├── guards/
│   ├── auth.guard.ts         ← Requiere usuario autenticado
│   └── admin.guard.ts        ← Requiere rol administrador
├── interceptors/
│   └── auth.interceptor.ts   ← Agrega token JWT a todas las peticiones HTTP
├── interfaces/               ← Tipos TypeScript del proyecto
│   ├── usuario.interface.ts
│   ├── cita.interface.ts
│   ├── tratamiento.interface.ts
│   ├── horario.interface.ts
│   ├── reporte.interface.ts
│   └── resena.interface.ts
├── services/                 ← Servicios con lógica HTTP y estado reactivo
│   ├── auth.service.ts
│   ├── citas.service.ts
│   ├── horarios.service.ts
│   ├── tratamientos.service.ts
│   ├── reportes.service.ts
│   └── resenas.service.ts
├── shared/                   ← Componentes de layout global
│   ├── navbar/
│   └── footer/
└── pages/                    ← Páginas de la aplicación
    ├── home/
    ├── login/
    ├── registro/
    ├── tratamientos/
    ├── tratamiento-detalle/
    ├── horarios/
    ├── agendar/
    ├── mis-citas/
    ├── acerca-de/
    ├── gestionar-citas/
    ├── gestionar-horarios/
    ├── gestionar-tratamientos/
    ├── crear-reporte/
    └── reportes/
```

---

## Rutas

| Ruta | Componente | Guard |
|------|-----------|-------|
| `/inicio` | Home | — |
| `/tratamientos` | Tratamientos | — |
| `/tratamiento/:id` | TratamientoDetalle | — |
| `/horarios` | Horarios | — |
| `/acerca` | AcercaDe | — |
| `/login` | Login | — |
| `/registro` | Registro | — |
| `/agendar` | Agendar | authGuard |
| `/mis-citas` | MisCitas | authGuard |
| `/gestionar-citas` | GestionarCitas | adminGuard |
| `/gestionar-horarios` | GestionarHorarios | adminGuard |
| `/gestionar-tratamientos` | GestionarTratamientos | adminGuard |
| `/crear-reporte` | CrearReporte | adminGuard |
| `/reportes` | Reportes | adminGuard |

---

## Guards

**`auth.guard.ts`** — Verifica que el usuario esté autenticado (token en localStorage). Si no lo está, redirige a `/login`.

**`admin.guard.ts`** — Verifica que el usuario esté autenticado Y tenga rol `admin`. Si no, redirige a `/login`.

---

## Interceptor

**`auth.interceptor.ts`** — Se ejecuta automáticamente en cada petición HTTP saliente. Lee el token de `localStorage` y lo agrega al header `Authorization`. Sin este interceptor habría que agregar el token manualmente en cada llamada.

---

## Servicios

Todos los servicios siguen el mismo patrón:

- **Signals** para el estado reactivo (`signal()`, `computed()`, `asReadonly()`)
- **`isLoading`** — indica si hay una petición en curso
- **`errorMessage`** — mensaje de error del backend
- **`successMessage`** — mensaje de éxito tras una operación

### AuthService
Maneja la sesión del usuario. Signals expuestos:
- `isLoggedIn()` — booleano
- `tipoUsuario()` — `'cliente'` | `'admin'`
- `nombreUsuario()` — nombre del usuario
- `isAdmin()` — booleano computed

### CitasService
- `fetchMisCitas()` — citas del cliente autenticado
- `fetchCitasPorFecha(fecha)` — citas de un día (admin)
- `fetchHorasOcupadas()` — mapa de horas ocupadas por fecha
- `agendarCita(cita)` — crear nueva cita
- `modificarCita(id, fecha, hora)` — reagendar
- `cancelarCita(id)` — cancelar (cliente, valida 24h)
- `cancelarCitaAdmin(id, fecha)` — cancelar sin restricción (admin)
- `completarCitaAdmin(id, fecha)` — marcar como terminada (admin)

### HorariosService
- `fetchHorarios()` — obtiene horarios del mes actual
- `generarCalendario(horarios)` — construye el array de días del calendario
- `mesAnterior()` / `mesSiguiente()` — navegación entre meses
- Signals: `diasCalendario()`, `vacios()`, `nombreMes()`, `anioActual()`

### TratamientosService
- `fetchTratamientos()` — solo activos (para clientes)
- `fetchTodosLosTratamientos()` — incluyendo inactivos (para admin)
- `crearTratamiento(formData)` — con imagen via multer/Cloudinary
- `actualizarTratamiento(id, formData)`
- `eliminarTratamiento(id)` — desactivación lógica
- `reactivarTratamiento(id)`

### ReportesService
- `fetchReportes(pagina)` — con paginación
- `fetchFechasSinReporte()` — fechas con citas sin reporte
- `fetchCitasPasadasPorFecha(fecha)` — para el formulario de crear reporte
- `crearReporte(reporte)`

### ResenasService
- `fetchResenas(idTratamiento)`
- `verificarPuedeResenar(idTratamiento)` — valida si el cliente puede reseñar
- `crearResena(resena)`
- `limpiar()` — limpia el estado al destruir el componente

---

## Componentes reutilizables

### `app-calendario`
Calendario mensual interactivo reutilizado en tres vistas distintas.

**Inputs:**
```typescript
dias = input<DiaCalendario[]>([]);
vacios = input<number[]>([]);
nombreMes = input<string>('');
anioActual = input<number>();
diaSeleccionado = input<string | null>(null);
```

**Outputs:**
```typescript
diaClic = output<DiaCalendario>();
anteriorClic = output<void>();
siguienteClic = output<void>();
```

**Usado en:**
- `horarios` — días con horas disponibles para el cliente
- `gestionar-horarios` — días con bloques configurados para el admin
- `gestionar-citas` — días con citas para el admin

### `app-modal-confirmacion`
Modal de confirmación para acciones críticas (cancelar cita, eliminar tratamiento, etc.).

Se usa de dos formas según el contexto:
- Con `@ViewChild('modal')` cuando está siempre en el DOM
- Con signals locales (`modalVisible`, `modalTitulo`, etc.) cuando está dentro de bloques `@if`

### `app-resenas`
Muestra las reseñas de un tratamiento y el formulario para dejar una nueva.

**Input:**
```typescript
idTratamiento = input.required<string>();
```

---

## Patrones de código

### Signals en lugar de variables reactivas
```typescript
// Estado reactivo
private _citas = signal<Cita[]>([]);
public citas = this._citas.asReadonly();

// Computed (se recalcula automáticamente)
totalPaginas = computed(() =>
    Math.ceil(this.citasService.citas().length / this.citasPorPagina)
);
```

### `inject()` en lugar de constructor
```typescript
public citasService = inject(CitasService);
private router = inject(Router);
```

### Nueva sintaxis de templates (Angular 17+)
```html
@if (condicion) { ... } @else { ... }
@for (item of lista; track item._id) { ... }
```

### `input.required<T>()` para inputs de componentes hijos
```typescript
idTratamiento = input.required<string>();
```

### `output()` para eventos
```typescript
diaClic = output<DiaCalendario>();
// Se emite con: this.diaClic.emit(dia);
```

---

## Deploy en producción

```bash
# Build para producción (usa environment.prod.ts automáticamente)
ng build --configuration production

# Deploy a Firebase Hosting
firebase deploy --only hosting
```

**URL de producción:** `https://consultorio-dental-a5523.web.app`

---

## Credenciales de prueba (seeder)

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Admin | admin@dental.com | admin123 |
| Cliente 1 | josecarlos@gmail.com | cliente123 |
| Cliente 2 | mfernanda@gmail.com | cliente123 |
| Cliente 3 | diegoalejandro@gmail.com | cliente123 |
| Cliente 4 | sofia.mendoza@gmail.com | cliente123 |
| Cliente 5 | roberto.sanchez@gmail.com | cliente123 |
