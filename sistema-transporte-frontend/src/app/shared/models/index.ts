// Archivo de exportación de todos los modelos
export * from './usuario.model';
export * from './tarjeta.model';
export * from './transporte.model';
export * from './rol.model';

// Interfaces comunes del sistema
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Usuario;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Interfaces para filtros y búsquedas
export interface FilterBase {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface UsuarioFilter extends FilterBase {
  estado?: 'activo' | 'inactivo' | 'suspendido';
  rolId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface TarjetaFilter extends FilterBase {
  estado?: 'activa' | 'bloqueada' | 'vencida';
  usuarioId?: number;
  saldoMinimo?: number;
  saldoMaximo?: number;
}

export interface TransporteFilter extends FilterBase {
  tipo?: 'bus' | 'metro' | 'tren' | 'tranvia';
  estado?: 'activo' | 'mantenimiento' | 'fuera_servicio';
  lineaId?: number;
  conductorId?: number;
}

import { Usuario } from './usuario.model';
import { Tarjeta } from './tarjeta.model';
import { Transporte } from './transporte.model';
import { Rol } from './rol.model';