export interface Reporte {
    _id?: string;
    id_cita: string;
    id_tratamiento: string;
    id_paciente: string;
    notas: string;
    fecha_reporte?: string;
    fecha_cita?: string;
    hora_cita?: string;
    nombre_tratamiento?: string;
    nombre_paciente?: string;
    telefono?: string;
}

export interface ReporteRequest {
    id_cita: string;
    notas: string;
}