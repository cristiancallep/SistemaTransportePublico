export interface UsuarioUpdate {
  id_rol?: number;
  nombre?: string;
  apellido?: string;
  documento?: string;
  email?: string;
}
import { Rol } from './rol.model';

// Interfaces adapted to the backend (Entities/usuario.py)
export interface Usuario {
  id_usuario: string; // UUID string
  id_rol: number;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  fecha_registro: string; // ISO date string
  fecha_actualizar: string; // ISO date string
  rol?: Rol;
}

export interface UsuarioCreate {
  id_rol?: number; // optional, backend defaults to 2
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  contrasena: string;
}

export interface UsuarioCreate {
  id_rol?: number; // optional, backend defaults to 2
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  contrasena: string;
}