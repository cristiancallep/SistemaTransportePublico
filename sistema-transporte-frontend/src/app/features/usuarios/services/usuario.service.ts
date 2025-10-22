import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Usuario, UsuarioCreate, UsuarioUpdate, UsuarioFilter, PaginatedResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private endpoint = 'usuarios';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los usuarios con filtros opcionales
   */
  getUsuarios(filters?: UsuarioFilter): Observable<PaginatedResponse<Usuario>> {
    return this.apiService.get<PaginatedResponse<Usuario>>(this.endpoint, filters);
  }

  /**
   * Obtiene un usuario por ID
   */
  getUsuario(id: number): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  /**
   * Busca usuarios por término
   */
  buscarUsuarios(term: string): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(`${this.endpoint}/buscar`, { q: term });
  }

  /**
   * Crea un nuevo usuario
   */
  crearUsuario(usuario: UsuarioCreate): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, usuario);
  }

  /**
   * Actualiza un usuario existente
   */
  actualizarUsuario(id: number, usuario: UsuarioUpdate): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  /**
   * Elimina un usuario
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Activa un usuario
   */
  activarUsuario(id: number): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id}/activar`, {});
  }

  /**
   * Desactiva un usuario
   */
  desactivarUsuario(id: number): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id}/desactivar`, {});
  }

  /**
   * Suspende un usuario
   */
  suspenderUsuario(id: number, motivo?: string): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id}/suspender`, { motivo });
  }

  /**
   * Cambia el rol de un usuario
   */
  cambiarRol(id: number, rolId: number): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id}/cambiar-rol`, { rolId });
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  obtenerPerfil(): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/perfil`);
  }

  /**
   * Actualiza el perfil del usuario actual
   */
  actualizarPerfil(datos: Partial<UsuarioUpdate>): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/perfil`, datos);
  }

  /**
   * Cambia la contraseña del usuario
   */
  cambiarContrasena(contrasenaActual: string, nuevaContrasena: string): Observable<void> {
    return this.apiService.patch<void>(`${this.endpoint}/cambiar-contrasena`, {
      contrasenaActual,
      nuevaContrasena
    });
  }

  /**
   * Obtiene las tarjetas de un usuario
   */
  obtenerTarjetas(id: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/${id}/tarjetas`);
  }

  /**
   * Obtiene el historial de actividad de un usuario
   */
  obtenerHistorialActividad(id: number, fechaInicio?: string, fechaFin?: string): Observable<any[]> {
    const params: any = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    return this.apiService.get<any[]>(`${this.endpoint}/${id}/actividad`, params);
  }

  /**
   * Valida si un email está disponible
   */
  validarEmailDisponible(email: string, excludeId?: number): Observable<{ disponible: boolean }> {
    const params: any = { email };
    if (excludeId) params.exclude_id = excludeId;
    
    return this.apiService.get<{ disponible: boolean }>(`${this.endpoint}/validar-email`, params);
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  obtenerEstadisticas(): Observable<{
    total: number;
    activos: number;
    inactivos: number;
    suspendidos: number;
    nuevosEstesMes: number;
    porRol: { [key: string]: number };
  }> {
    return this.apiService.get<{
      total: number;
      activos: number;
      inactivos: number;
      suspendidos: number;
      nuevosEstesMes: number;
      porRol: { [key: string]: number };
    }>(`${this.endpoint}/estadisticas`);
  }

  /**
   * Exporta usuarios a Excel
   */
  exportarExcel(filtros?: UsuarioFilter): Observable<Blob> {
    return this.apiService.getBlob(`${this.endpoint}/exportar`, filtros);
  }

  /**
   * Importa usuarios desde Excel
   */
  importarExcel(archivo: File): Observable<{
    exitosos: number;
    errores: any[];
  }> {
    return this.apiService.uploadFile<{
      exitosos: number;
      errores: any[];
    }>(`${this.endpoint}/importar`, archivo);
  }

  /**
   * Envía notificación a un usuario
   */
  enviarNotificacion(id: number, mensaje: string, tipo: string = 'info'): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/${id}/notificar`, {
      mensaje,
      tipo
    });
  }

  /**
   * Obtiene usuarios por rol
   */
  obtenerUsuariosPorRol(rolId: number): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(`${this.endpoint}/por-rol/${rolId}`);
  }
}