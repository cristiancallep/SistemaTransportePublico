export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos: string[];
  fechaCreacion: Date;
  estado: 'activo' | 'inactivo';
}

export interface RolCreate {
  nombre: string;
  descripcion?: string;
  permisos: string[];
}

export interface RolUpdate {
  nombre?: string;
  descripcion?: string;
  permisos?: string[];
  estado?: 'activo' | 'inactivo';
}

export enum Permiso {
  // Usuarios
  USUARIOS_LEER = 'usuarios:leer',
  USUARIOS_CREAR = 'usuarios:crear',
  USUARIOS_EDITAR = 'usuarios:editar',
  USUARIOS_ELIMINAR = 'usuarios:eliminar',
  
  // Tarjetas
  TARJETAS_LEER = 'tarjetas:leer',
  TARJETAS_CREAR = 'tarjetas:crear',
  TARJETAS_EDITAR = 'tarjetas:editar',
  TARJETAS_ELIMINAR = 'tarjetas:eliminar',
  TARJETAS_RECARGAR = 'tarjetas:recargar',
  TARJETAS_BLOQUEAR = 'tarjetas:bloquear',
  
  // Transportes
  TRANSPORTES_LEER = 'transportes:leer',
  TRANSPORTES_CREAR = 'transportes:crear',
  TRANSPORTES_EDITAR = 'transportes:editar',
  TRANSPORTES_ELIMINAR = 'transportes:eliminar',
  TRANSPORTES_MANTENIMIENTO = 'transportes:mantenimiento',
  
  // Empleados
  EMPLEADOS_LEER = 'empleados:leer',
  EMPLEADOS_CREAR = 'empleados:crear',
  EMPLEADOS_EDITAR = 'empleados:editar',
  EMPLEADOS_ELIMINAR = 'empleados:eliminar',
  
  // Reportes
  REPORTES_VER = 'reportes:ver',
  REPORTES_EXPORTAR = 'reportes:exportar',
  
  // Administración
  ADMIN_CONFIGURACION = 'admin:configuracion',
  ADMIN_AUDITORIA = 'admin:auditoria',
  ADMIN_ROLES = 'admin:roles'
}

export const RolesDefecto = {
  SUPER_ADMIN: {
    nombre: 'Super Administrador',
    permisos: Object.values(Permiso)
  },
  ADMIN: {
    nombre: 'Administrador',
    permisos: [
      Permiso.USUARIOS_LEER, Permiso.USUARIOS_CREAR, Permiso.USUARIOS_EDITAR,
      Permiso.TARJETAS_LEER, Permiso.TARJETAS_CREAR, Permiso.TARJETAS_EDITAR, Permiso.TARJETAS_RECARGAR,
      Permiso.TRANSPORTES_LEER, Permiso.TRANSPORTES_CREAR, Permiso.TRANSPORTES_EDITAR,
      Permiso.EMPLEADOS_LEER, Permiso.EMPLEADOS_CREAR, Permiso.EMPLEADOS_EDITAR,
      Permiso.REPORTES_VER
    ]
  },
  OPERADOR: {
    nombre: 'Operador',
    permisos: [
      Permiso.USUARIOS_LEER,
      Permiso.TARJETAS_LEER, Permiso.TARJETAS_RECARGAR,
      Permiso.TRANSPORTES_LEER,
      Permiso.REPORTES_VER
    ]
  },
  CONDUCTOR: {
    nombre: 'Conductor',
    permisos: [
      Permiso.TARJETAS_LEER,
      Permiso.TRANSPORTES_LEER
    ]
  }
};