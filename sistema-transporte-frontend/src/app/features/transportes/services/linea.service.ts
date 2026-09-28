import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class LineaService {
  private endpoint = 'api/lineas';

  constructor(private api: ApiService) {}

  getLineas(): Observable<any[]> {
    return this.api.get<any[]>(this.endpoint);
  }

  crearLinea(body: { nombre: string; descripcion?: string }): Observable<any> {
    return this.api.post<any>(this.endpoint, body);
  }

  getLinea(id: string): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}`);
  }

  actualizarLinea(id: string, body: { nombre?: string; descripcion?: string }): Observable<any> {
    return this.api.put<any>(`${this.endpoint}/${id}`, body);
  }

  eliminarLinea(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
