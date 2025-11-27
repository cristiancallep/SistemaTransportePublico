import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class RutaService {
  private endpoint = 'api/rutas';

  constructor(private api: ApiService) {}

  getRutas(): Observable<any[]> {
    return this.api.get<any[]>(this.endpoint);
  }

  crearRuta(body: { nombre: string; origen: string; destino: string; duracion_estimada: number; id_linea: string }): Observable<any> {
    return this.api.post<any>(this.endpoint, body);
  }

  actualizarRuta(body: { id_ruta: string; nombre?: string; origen?: string; destino?: string; duracion_estimada?: number }): Observable<any> {
    return this.api.put<any>(this.endpoint, body);
  }

  eliminarRuta(id_ruta: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id_ruta}`);
  }
}
