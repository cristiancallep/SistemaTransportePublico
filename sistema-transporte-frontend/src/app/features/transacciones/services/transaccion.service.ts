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

  /**
   * Obtener todas las transacciones del usuario
   */
  obtenerTransacciones(): Observable<TransaccionTarjeta[]> {
    return this.apiService.get<TransaccionTarjeta[]>(`${this.endpoint}`);
  }

  /**
   * Obtener transacciones por ID de usuario
   */
  obtenerTransaccionesPorUsuario(usuarioId: string): Observable<TransaccionTarjeta[]> {
    return this.apiService.get<TransaccionTarjeta[]>(`${this.endpoint}`, { usuario_id: usuarioId });
  }

  /**
   * Obtener transacciones por rango de fechas
   */
  obtenerTransaccionesPorFecha(fechaInicio: string, fechaFin: string): Observable<TransaccionTarjeta[]> {
    return this.apiService.get<TransaccionTarjeta[]>(`${this.endpoint}`, {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });
  }
}