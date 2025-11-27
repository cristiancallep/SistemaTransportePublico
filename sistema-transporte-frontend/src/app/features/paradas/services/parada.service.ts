import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Parada, ParadaCreate, ParadaUpdate } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ParadaService {
  private endpoint = 'api/paradas';

  constructor(private api: ApiService) {}

  getParadas(params?: { skip?: number; limit?: number; estado?: string }): Observable<Parada[]> {
    return this.api.get<Parada[]>(this.endpoint, params);
  }

  getParada(id: string): Observable<Parada> {
    return this.api.get<Parada>(`${this.endpoint}/${id}`);
  }

  crearParada(data: ParadaCreate): Observable<Parada> {
    return this.api.post<Parada>(this.endpoint, data);
  }

  actualizarParada(id: string, data: ParadaUpdate): Observable<Parada> {
    return this.api.put<Parada>(`${this.endpoint}/${id}`, data);
  }

  eliminarParada(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Parada[]> {
    return this.api.get<Parada[]>(`${this.endpoint}/buscar/nombre/${encodeURIComponent(nombre)}`);
  }

  obtenerPorEstado(estado: string): Observable<Parada[]> {
    return this.api.get<Parada[]>(`${this.endpoint}/estado/${encodeURIComponent(estado)}`);
  }
}
