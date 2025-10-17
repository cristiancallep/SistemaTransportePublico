import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Usuario, UsuarioCreate, UsuarioFilter, UsuarioUpdate,PaginatedResponse } from '../../../shared/models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private endpoint = environment.endpoints.usuarios;

  constructor(private apiService: ApiService) {}

  /** List users with optional pagination (page/pageSize converted to skip/limit) */
  getUsuarios(filters?: UsuarioFilter & { page?: number; pageSize?: number }): Observable<PaginatedResponse<Usuario>> {
    const params: any = { ...filters };

    if (filters?.page !== undefined) {
      const page = Number(filters.page) || 1;
      const pageSize = Number(filters.pageSize) || 100;
      params.skip = String((page - 1) * pageSize);
      params.limit = String(pageSize);
      delete params.page;
      delete params.pageSize;
    }

    return this.apiService.get<PaginatedResponse<Usuario>>(this.endpoint, params);
  }

  /** Get user by UUID (id_usuario) */
  getUsuarioById(id: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  /** Get user by documento */
  getUsuarioByDocumento(documento: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/documento/${encodeURIComponent(documento)}`);
  }
  /** Create user (backend expects nombre, apellido, documento, email, contrasena, id_rol) */
  crearUsuario(usuario: UsuarioCreate): Observable<Usuario> {
    const payload: any = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      documento: usuario.documento,
      email: usuario.email,
      contrasena: usuario.contrasena,
    };

    if (usuario.id_rol !== undefined) payload.id_rol = usuario.id_rol;

    return this.apiService.post<Usuario>(this.endpoint, payload);
  }

  actualizarUsuario(id: string, usuario: UsuarioUpdate): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}