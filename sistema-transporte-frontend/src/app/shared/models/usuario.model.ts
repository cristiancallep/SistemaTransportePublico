import { Rol } from './rol.model';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaRegistro: Date;
  estado: 'activo' | 'inactivo' | 'suspendido';
  rolId: number;
  rol?: Rol; // Información completa del rol (opcional, para cuando se incluye)
}

export interface UsuarioCreate {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  password: string;
  rolId: number;
}

export interface UsuarioUpdate {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  estado?: 'activo' | 'inactivo' | 'suspendido';
  rolId?: number;
}