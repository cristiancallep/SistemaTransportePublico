export interface UsuarioUpdate {
  id_rol?: number;
  nombre?: string;
  apellido?: string;
  documento?: string;
  email?: string;
}
import { Rol } from './rol.model';

export interface Usuario {
  id_usuario: string;
  id_rol: number;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  fecha_registro: string;
  fecha_actualizar: string;
  rol?: Rol;
}

export interface UsuarioCreate {
  id_rol?: number;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  contrasena: string;
}

export interface UsuarioCreate {
  id_rol?: number;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  contrasena: string;
}