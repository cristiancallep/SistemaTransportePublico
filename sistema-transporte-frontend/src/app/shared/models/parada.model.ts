export interface Parada {
  id?: string;
  id_parada?: string;
  nombre: string;
  direccion: string;
  coordenadas?: string | null;
  estado?: string;
  fechaRegistro?: Date | string;
  fecha_actualizar?: Date | string;
}

export interface ParadaCreate {
  nombre: string;
  direccion: string;
  coordenadas?: string | null;
}

export interface ParadaUpdate {
  nombre?: string;
  direccion?: string;
  coordenadas?: string | null;
  estado?: string;
}
