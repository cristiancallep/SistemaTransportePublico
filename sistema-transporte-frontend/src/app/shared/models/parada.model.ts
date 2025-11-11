export interface Parada {
  id?: string; // UUID en frontend para conveniencia
  id_parada?: string; // UUID real del backend
  nombre: string;
  direccion: string;
  coordenadas?: string | null;
  estado?: string; // Activa | Inactiva | Mantenimiento
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
