import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Transporte, TransporteCreate, TransporteUpdate } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  
  private endpoint = 'api/transportes';

  constructor(private apiService: ApiService) {}

  getTransportes(params?: { skip?: number; limit?: number }): Observable<any[]> {
    return this.apiService.get<any[]>(this.endpoint, params);
  }

  getTransporte(id: string): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/${id}`);
  }

  buscarPorPlaca(placa: string): Observable<any> {
    
    return this.apiService.get<any>(`${this.endpoint}/placa/${encodeURIComponent(placa)}`);
  }



  
  crearTransporte(transporte: TransporteCreate): Observable<any> {
    return this.apiService.post<any>(this.endpoint, transporte);
  }

  
  actualizarTransporte(id: string, transporte: TransporteUpdate): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, transporte);
  }

  
  eliminarTransporte(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  


}