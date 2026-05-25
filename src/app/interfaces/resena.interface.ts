export interface Resena {
    _id?: string;
    calificacion: number;
    comentario: string;
    fecha: Date;
    nombre_paciente: string;
}

export interface ResenaRequest {
    id_tratamiento: string;
    calificacion: number;
    comentario: string;
}

export interface PuedeResenar {
    puede: boolean;
    razon?: 'sin_cita' | 'ya_reseno';
}