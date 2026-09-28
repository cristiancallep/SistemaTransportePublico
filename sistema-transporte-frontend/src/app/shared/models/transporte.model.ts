export interface Transporte {
  id: number;
  placa: string;
  tipo: 'bus' | 'metro' | 'tren' | 'tranvia';
  capacidad: number;
  estado: 'activo' | 'mantenimiento' | 'fuera_servicio';
  fechaRegistro: Date;
  lineaId?: number;
  conductorId?: number;
  modelo?: string;
  anio?: number;
  kilometraje?: number;
}

export interface TransporteCreate {
  placa: string;
  tipo: 'bus' | 'metro' | 'tren' | 'tranvia';
  capacidad: number;
  lineaId?: number;
  conductorId?: number;
  modelo?: string;
  anio?: number;
}

export interface TransporteUpdate {
  placa?: string;
  tipo?: 'bus' | 'metro' | 'tren' | 'tranvia';
  capacidad?: number;
  estado?: 'activo' | 'mantenimiento' | 'fuera_servicio';
  lineaId?: number;
  conductorId?: number;
  modelo?: string;
  anio?: number;
  kilometraje?: number;
}

export interface UbicacionTransporte {
  transporteId: number;
  latitud: number;
  longitud: number;
  timestamp: Date;
  velocidad?: number;
  direccion?: string;
}

export interface MantenimientoTransporte {
  id: number;
  transporteId: number;
  tipo: 'preventivo' | 'correctivo' | 'emergencia';
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  costo?: number;
  estado: 'programado' | 'en_proceso' | 'completado' | 'cancelado';
}

export interface Linea {
  id: number;
  nombre: string;
  codigo: string;
  color?: string;
  descripcion?: string;
  estado: 'activa' | 'inactiva';
  transportes?: Transporte[];
}