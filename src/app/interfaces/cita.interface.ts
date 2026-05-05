export interface Cita {
    _id?: string;
    id_paciente: string;
    id_tratamiento: string;
    fecha: string;
    hora: string;
    estado: 'Pendiente' | 'Terminada' | 'Cancelada';
    nombre_tratamiento?: string;
    nombre_paciente?: string;
    telefono?: string;
}

export interface CitaRequest {
    id_tratamiento: string;
    fecha: string;
    hora: string;
}