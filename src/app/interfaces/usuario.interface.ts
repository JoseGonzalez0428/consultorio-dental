export interface Usuario {
    _id?: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string;
    correo: string;
    telefono: string;
    fecha_nacimiento: string;
    sexo: 'Masculino' | 'Femenino';
    tipo_usuario: 'cliente' | 'admin';
}

export interface LoginRequest {
    correo: string;
    contrasena: string;
}

export interface LoginResponse {
    msg: string;
    token: string;
    tipo_usuario: string;
    nombre: string;
    sexo: string;
    id: string;
}

export interface RegisterRequest {
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string;
    correo: string;
    telefono: string;
    contrasena: string;
    fecha_nacimiento: string;
    sexo: string;
}