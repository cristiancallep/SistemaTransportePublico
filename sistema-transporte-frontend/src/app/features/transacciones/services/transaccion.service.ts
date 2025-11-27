import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { TransaccionTarjeta } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private endpoint = 'api/transacciones';

  constructor(private apiService: ApiService) {}

  obtenerTransacciones(): Observable<TransaccionTarjeta[]> {
    return this.apiService.get<TransaccionTarjeta[]>(`${this.endpoint}`);
  }

  obtenerTransaccionesPorUsuario(usuarioId: string): Observable<TransaccionTarjeta[]> {
    return this.apiService.get<TransaccionTarjeta[]>(`${this.endpoint}`, { usuario_id: usuarioId });
  }

  obtenerTransaccionesPorFecha(fechaInicio: string, fechaFin: string): Observable<TransaccionTarjeta[]> {
    return this.apiService.get<TransaccionTarjeta[]>(`${this.endpoint}`, {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });
  }
}