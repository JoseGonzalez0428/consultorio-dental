export interface Horario {
    _id?: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
}

export interface BloqueHorario {
    inicio: string;
    fin: string;
}

export interface DiaCalendario {
  numero: number;
  fecha: string;
  disponible: boolean;
  bloques: BloqueHorarioCalendario[];
  badge?: string;
  clicable?: boolean;
}

export interface BloqueHorarioCalendario {
    id: string;
    horaIni: string;
    horaFin: string;
    turno: string;
}