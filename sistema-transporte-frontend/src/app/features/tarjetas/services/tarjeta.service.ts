import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Tarjeta, TarjetaCreate, TarjetaUpdate, TarjetaFilter, PaginatedResponse, RecargaTarjeta, TransaccionTarjeta } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private endpoint = 'tarjetas';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todas las tarjetas con filtros opcionales
   */
  getTarjetas(filters?: TarjetaFilter): Observable<PaginatedResponse<Tarjeta>> {
    return this.apiService.get<PaginatedResponse<Tarjeta>>(this.endpoint, filters);
  }

  /**
   * Obtiene una tarjeta por ID
   */
  getTarjeta(id: number): Observable<Tarjeta> {
    return this.apiService.get<Tarjeta>(`${this.endpoint}/${id}`);
  }

  /**
   * Busca tarjetas por número
   */
  buscarPorNumero(numero: string): Observable<Tarjeta[]> {
    return this.apiService.get<Tarjeta[]>(`${this.endpoint}/buscar`, { numero });
  }

  /**
   * Obtiene tarjetas por usuario
   */
  getTarjetasPorUsuario(usuarioId: number): Observable<Tarjeta[]> {
    return this.apiService.get<Tarjeta[]>(`${this.endpoint}/usuario/${usuarioId}`);
  }

  /**
   * Crea una nueva tarjeta
   */
  crearTarjeta(tarjeta: TarjetaCreate): Observable<Tarjeta> {
    return this.apiService.post<Tarjeta>(this.endpoint, tarjeta);
  }

  /**
   * Actualiza una tarjeta existente
   */
  actualizarTarjeta(id: number, tarjeta: TarjetaUpdate): Observable<Tarjeta> {
    return this.apiService.put<Tarjeta>(`${this.endpoint}/${id}`, tarjeta);
  }

  /**
   * Elimina una tarjeta
   */
  eliminarTarjeta(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Activa una tarjeta
   */
  activarTarjeta(id: number): Observable<Tarjeta> {
    return this.apiService.patch<Tarjeta>(`${this.endpoint}/${id}/activar`, {});
  }

  /**
   * Desactiva una tarjeta
   */
  desactivarTarjeta(id: number): Observable<Tarjeta> {
    return this.apiService.patch<Tarjeta>(`${this.endpoint}/${id}/desactivar`, {});
  }

  /**
   * Bloquea una tarjeta
   */
  bloquearTarjeta(id: number, motivo?: string): Observable<Tarjeta> {
    return this.apiService.patch<Tarjeta>(`${this.endpoint}/${id}/bloquear`, { motivo });
  }

  /**
   * Recarga saldo en una tarjeta
   */
  recargarSaldo(id: number, recarga: RecargaTarjeta): Observable<Tarjeta> {
    return this.apiService.patch<Tarjeta>(`${this.endpoint}/${id}/recargar`, recarga);
  }

  /**
   * Obtiene el saldo actual de una tarjeta
   */
  obtenerSaldo(id: number): Observable<{ saldo: number }> {
    return this.apiService.get<{ saldo: number }>(`${this.endpoint}/${id}/saldo`);
  }

  /**
   * Obtiene el historial de transacciones de una tarjeta
   */
  obtenerHistorial(id: number, fechaInicio?: string, fechaFin?: string): Observable<TransaccionTarjeta[]> {
    const params: any = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    return this.apiService.get<TransaccionTarjeta[]>(`${this.endpoint}/${id}/historial`, params);
  }

  /**
   * Valida si un número de tarjeta está disponible
   */
  validarNumeroDisponible(numero: string): Observable<{ disponible: boolean }> {
    return this.apiService.get<{ disponible: boolean }>(`${this.endpoint}/validar-numero`, { numero });
  }

  /**
   * Genera un nuevo número de tarjeta
   */
  generarNumeroTarjeta(): Observable<{ numero: string }> {
    return this.apiService.post<{ numero: string }>(`${this.endpoint}/generar-numero`, {});
  }

  /**
   * Procesa un pago con tarjeta
   */
  procesarPago(id: number, monto: number, transporteId?: number, descripcion?: string): Observable<{
    exitoso: boolean;
    saldoRestante: number;
    transaccionId: number;
  }> {
    return this.apiService.post<{
      exitoso: boolean;
      saldoRestante: number;
      transaccionId: number;
    }>(`${this.endpoint}/${id}/pagar`, {
      monto,
      transporteId,
      descripcion
    });
  }

  /**
   * Obtiene estadísticas de tarjetas
   */
  obtenerEstadisticas(): Observable<{
    total: number;
    activas: number;
    bloqueadas: number;
    vencidas: number;
    saldoTotal: number;
    transaccionesHoy: number;
    recargasHoy: number;
  }> {
    return this.apiService.get<{
      total: number;
      activas: number;
      bloqueadas: number;
      vencidas: number;
      saldoTotal: number;
      transaccionesHoy: number;
      recargasHoy: number;
    }>(`${this.endpoint}/estadisticas`);
  }

  /**
   * Exporta datos de tarjetas a Excel
   */
  exportarExcel(filtros?: TarjetaFilter): Observable<Blob> {
    return this.apiService.getBlob(`${this.endpoint}/exportar`, filtros);
  }

  /**
   * Obtiene reportes de uso por período
   */
  reporteUso(fechaInicio: string, fechaFin: string): Observable<{
    totalTransacciones: number;
    montoTotal: number;
    promedioPorTarjeta: number;
    tarjetasMasUsadas: Array<{
      tarjetaId: number;
      numero: string;
      transacciones: number;
      monto: number;
    }>;
  }> {
    return this.apiService.get<{
      totalTransacciones: number;
      montoTotal: number;
      promedioPorTarjeta: number;
      tarjetasMasUsadas: Array<{
        tarjetaId: number;
        numero: string;
        transacciones: number;
        monto: number;
      }>;
    }>(`${this.endpoint}/reporte-uso`, {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });
  }

  /**
   * Transfiere saldo entre tarjetas
   */
  transferirSaldo(origenId: number, destinoId: number, monto: number): Observable<{
    exitoso: boolean;
    saldoOrigen: number;
    saldoDestino: number;
  }> {
    return this.apiService.post<{
      exitoso: boolean;
      saldoOrigen: number;
      saldoDestino: number;
    }>(`${this.endpoint}/${origenId}/transferir`, {
      destinoId,
      monto
    });
  }

  /**
   * Obtiene tarjetas que van a vencer
   */
  getTarjetasPorVencer(dias: number = 30): Observable<Tarjeta[]> {
    return this.apiService.get<Tarjeta[]>(`${this.endpoint}/por-vencer`, { dias });
  }

  /**
   * Renueva una tarjeta vencida
   */
  renovarTarjeta(id: number, nuevaFechaVencimiento: Date): Observable<Tarjeta> {
    return this.apiService.patch<Tarjeta>(`${this.endpoint}/${id}/renovar`, {
      fechaVencimiento: nuevaFechaVencimiento.toISOString()
    });
  }
}