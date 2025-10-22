import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Transporte, TransporteCreate, TransporteUpdate, TransporteFilter, PaginatedResponse, UbicacionTransporte, MantenimientoTransporte } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  private endpoint = 'transportes';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los transportes con filtros opcionales
   */
  getTransportes(filters?: TransporteFilter): Observable<PaginatedResponse<Transporte>> {
    return this.apiService.get<PaginatedResponse<Transporte>>(this.endpoint, filters);
  }

  /**
   * Obtiene un transporte por ID
   */
  getTransporte(id: number): Observable<Transporte> {
    return this.apiService.get<Transporte>(`${this.endpoint}/${id}`);
  }

  /**
   * Busca transportes por placa
   */
  buscarPorPlaca(placa: string): Observable<Transporte[]> {
    return this.apiService.get<Transporte[]>(`${this.endpoint}/buscar`, { placa });
  }

  /**
   * Obtiene transportes por línea
   */
  getTransportesPorLinea(lineaId: number): Observable<Transporte[]> {
    return this.apiService.get<Transporte[]>(`${this.endpoint}/linea/${lineaId}`);
  }

  /**
   * Obtiene transportes activos
   */
  getTransportesActivos(): Observable<Transporte[]> {
    return this.apiService.get<Transporte[]>(`${this.endpoint}/activos`);
  }

  /**
   * Crea un nuevo transporte
   */
  crearTransporte(transporte: TransporteCreate): Observable<Transporte> {
    return this.apiService.post<Transporte>(this.endpoint, transporte);
  }

  /**
   * Actualiza un transporte existente
   */
  actualizarTransporte(id: number, transporte: TransporteUpdate): Observable<Transporte> {
    return this.apiService.put<Transporte>(`${this.endpoint}/${id}`, transporte);
  }

  /**
   * Elimina un transporte
   */
  eliminarTransporte(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Activa un transporte
   */
  activarTransporte(id: number): Observable<Transporte> {
    return this.apiService.patch<Transporte>(`${this.endpoint}/${id}/activar`, {});
  }

  /**
   * Desactiva un transporte
   */
  desactivarTransporte(id: number): Observable<Transporte> {
    return this.apiService.patch<Transporte>(`${this.endpoint}/${id}/desactivar`, {});
  }

  /**
   * Pone un transporte en mantenimiento
   */
  ponerEnMantenimiento(id: number, descripcion?: string): Observable<Transporte> {
    return this.apiService.patch<Transporte>(`${this.endpoint}/${id}/mantenimiento`, { descripcion });
  }

  /**
   * Saca un transporte de mantenimiento
   */
  sacarDeMantenimiento(id: number): Observable<Transporte> {
    return this.apiService.patch<Transporte>(`${this.endpoint}/${id}/operativo`, {});
  }

  /**
   * Asigna un conductor a un transporte
   */
  asignarConductor(transporteId: number, conductorId: number): Observable<Transporte> {
    return this.apiService.patch<Transporte>(
      `${this.endpoint}/${transporteId}/asignar-conductor`,
      { conductor_id: conductorId }
    );
  }

  /**
   * Remueve el conductor de un transporte
   */
  removerConductor(transporteId: number): Observable<Transporte> {
    return this.apiService.patch<Transporte>(`${this.endpoint}/${transporteId}/remover-conductor`, {});
  }

  /**
   * Obtiene el historial de mantenimientos
   */
  obtenerHistorialMantenimiento(id: number): Observable<MantenimientoTransporte[]> {
    return this.apiService.get<MantenimientoTransporte[]>(`${this.endpoint}/${id}/mantenimientos`);
  }

  /**
   * Registra un mantenimiento
   */
  registrarMantenimiento(id: number, mantenimiento: {
    tipo: 'preventivo' | 'correctivo' | 'emergencia';
    descripcion: string;
    costo?: number;
    fecha?: string;
  }): Observable<MantenimientoTransporte> {
    return this.apiService.post<MantenimientoTransporte>(`${this.endpoint}/${id}/mantenimientos`, mantenimiento);
  }

  /**
   * Obtiene la ubicación actual de un transporte
   */
  obtenerUbicacion(id: number): Observable<UbicacionTransporte> {
    return this.apiService.get<UbicacionTransporte>(`${this.endpoint}/${id}/ubicacion`);
  }

  /**
   * Actualiza la ubicación de un transporte
   */
  actualizarUbicacion(id: number, ubicacion: {
    latitud: number;
    longitud: number;
    velocidad?: number;
    direccion?: string;
  }): Observable<void> {
    return this.apiService.patch<void>(`${this.endpoint}/${id}/ubicacion`, ubicacion);
  }

  /**
   * Obtiene estadísticas de la flota
   */
  obtenerEstadisticas(): Observable<{
    total: number;
    activos: number;
    enMantenimiento: number;
    inactivos: number;
    porLinea: { [key: string]: number };
    porTipo: { [key: string]: number };
    kilometrajeTotalMes: number;
    viajesRealizadosHoy: number;
  }> {
    return this.apiService.get<{
      total: number;
      activos: number;
      enMantenimiento: number;
      inactivos: number;
      porLinea: { [key: string]: number };
      porTipo: { [key: string]: number };
      kilometrajeTotalMes: number;
      viajesRealizadosHoy: number;
    }>(`${this.endpoint}/estadisticas`);
  }

  /**
   * Valida si una placa está disponible
   */
  validarPlacaDisponible(placa: string, excludeId?: number): Observable<{ disponible: boolean }> {
    const params: any = { placa };
    if (excludeId) params.exclude_id = excludeId;
    
    return this.apiService.get<{ disponible: boolean }>(`${this.endpoint}/validar-placa`, params);
  }

  /**
   * Obtiene tipos de transporte disponibles
   */
  getTiposTransporte(): Observable<Array<{
    value: string;
    label: string;
    capacidadPromedio: number;
  }>> {
    return this.apiService.get<Array<{
      value: string;
      label: string;
      capacidadPromedio: number;
    }>>(`${this.endpoint}/tipos`);
  }

  /**
   * Exporta datos de transportes a Excel
   */
  exportarExcel(filtros?: TransporteFilter): Observable<Blob> {
    return this.apiService.getBlob(`${this.endpoint}/exportar`, filtros);
  }

  /**
   * Obtiene el reporte de kilómetros recorridos
   */
  reporteKilometraje(transporteId: number, fechaInicio: string, fechaFin: string): Observable<{
    kilometrosRecorridos: number;
    viajesRealizados: number;
    horasOperacion: number;
    consumoCombustible?: number;
    eficiencia: number;
  }> {
    return this.apiService.get<{
      kilometrosRecorridos: number;
      viajesRealizados: number;
      horasOperacion: number;
      consumoCombustible?: number;
      eficiencia: number;
    }>(`${this.endpoint}/${transporteId}/kilometraje`, {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });
  }

  /**
   * Obtiene transportes próximos a mantenimiento
   */
  getTransportesProximosMantenimiento(): Observable<Array<{
    transporte: Transporte;
    proximoMantenimiento: Date;
    tipoMantenimiento: string;
    diasRestantes: number;
  }>> {
    return this.apiService.get<Array<{
      transporte: Transporte;
      proximoMantenimiento: Date;
      tipoMantenimiento: string;
      diasRestantes: number;
    }>>(`${this.endpoint}/proximos-mantenimiento`);
  }

  /**
   * Programa un mantenimiento
   */
  programarMantenimiento(transporteId: number, mantenimiento: {
    fechaProgramada: Date;
    tipo: 'preventivo' | 'correctivo';
    descripcion: string;
    observaciones?: string;
  }): Observable<MantenimientoTransporte> {
    return this.apiService.post<MantenimientoTransporte>(
      `${this.endpoint}/${transporteId}/programar-mantenimiento`,
      {
        ...mantenimiento,
        fechaProgramada: mantenimiento.fechaProgramada.toISOString()
      }
    );
  }

  /**
   * Obtiene el rastro GPS de un transporte
   */
  obtenerRastroGPS(transporteId: number, fechaInicio: string, fechaFin: string): Observable<UbicacionTransporte[]> {
    return this.apiService.get<UbicacionTransporte[]>(`${this.endpoint}/${transporteId}/rastro-gps`, {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });
  }

  /**
   * Obtiene transportes en tiempo real
   */
  getTransportesEnTiempoReal(): Observable<Array<{
    transporte: Transporte;
    ubicacion: UbicacionTransporte;
    estado: 'en_ruta' | 'parado' | 'fuera_servicio';
    pasajeros?: number;
  }>> {
    return this.apiService.get<Array<{
      transporte: Transporte;
      ubicacion: UbicacionTransporte;
      estado: 'en_ruta' | 'parado' | 'fuera_servicio';
      pasajeros?: number;
    }>>(`${this.endpoint}/tiempo-real`);
  }
}