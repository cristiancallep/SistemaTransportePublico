import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private endpoint = environment.endpoints.empleados;

  constructor(private apiService: ApiService) {}

  getEmpleados(filters?: { page?: number; pageSize?: number; rol?: string; estado?: string }): Observable<any> {
    const params: any = { ...filters };
    if (filters?.page !== undefined) {
      const page = Number(filters.page) || 1;
      const pageSize = Number(filters.pageSize) || 100;
      params.skip = String((page - 1) * pageSize);
      params.limit = String(pageSize);
      delete params.page;
      delete params.pageSize;
    }
    return this.apiService.get<any>(this.endpoint, params);
  }

  getEmpleadoById(id: string): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/${id}`);
  }

  getEmpleadoByDocumento(documento: string): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/documento/${encodeURIComponent(documento)}`);
  }

  getEmpleadoByEmail(email: string): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/email/${encodeURIComponent(email)}`);
  }

  crearEmpleado(payload: any): Observable<any> {
    return this.apiService.post<any>(this.endpoint, payload);
  }

  actualizarEmpleado(id: string, payload: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, payload);
  }

  eliminarEmpleado(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
