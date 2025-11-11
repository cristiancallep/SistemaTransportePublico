import { Routes } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TransaccionService } from './services/transaccion.service';
import { TransaccionTarjeta } from '../../shared/models';
import { AuthService } from '../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  providers: [TransaccionService],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">receipt_long</mat-icon>
          Historial de Transacciones
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" [routerLink]="['/dashboard']">
          <mat-icon class="me-2">arrow_back</mat-icon>
          Volver al menú
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <!-- Panel de filtros visible encima de la tabla -->
            <div class="filters-panel">
              <div class="filter-item">
                <label>ID</label>
                <input class="filter-input" placeholder="ID" (input)="onFilterChange('id',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Tarjeta</label>
                <input class="filter-input" placeholder="Número de tarjeta" (input)="onFilterChange('tarjetaId',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Tipo</label>
                <input class="filter-input" placeholder="Tipo (recarga,pago)" (input)="onFilterChange('tipo',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Monto (min / max)</label>
                <div class="monto-filters">
                  <input class="filter-input" placeholder="Min" type="number" (input)="onFilterChange('montoMin',$any($event.target).value)" />
                  <input class="filter-input" placeholder="Max" type="number" (input)="onFilterChange('montoMax',$any($event.target).value)" />
                </div>
              </div>
              <div class="filter-item">
                <label>Fecha (desde / hasta)</label>
                <div class="fecha-filters">
                  <input class="filter-input" type="date" (input)="onFilterChange('fechaFrom',$any($event.target).value)" />
                  <input class="filter-input" type="date" (input)="onFilterChange('fechaTo',$any($event.target).value)" />
                </div>
              </div>
              <div class="filter-actions">
                <button class="btn btn-outline-secondary" (click)="clearFilters()">Limpiar filtros</button>
              </div>
            </div>

            <table mat-table [dataSource]="transacciones" class="w-100">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let transaccion">{{transaccion.id}}</td>
              </ng-container>

              <ng-container matColumnDef="tarjetaId">
                <th mat-header-cell *matHeaderCellDef>Tarjeta</th>
                <td mat-cell *matCellDef="let transaccion">{{transaccion.tarjetaId}}</td>
              </ng-container>

              <ng-container matColumnDef="tipo">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let transaccion">
                  <span [class]="'tipo-badge ' + transaccion.tipo">{{transaccion.tipo}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="monto">
                <th mat-header-cell *matHeaderCellDef>Monto</th>
                <td mat-cell *matCellDef="let transaccion">{{transaccion.monto | currency}}</td>
              </ng-container>

              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let transaccion">{{transaccion.fecha | date:'short'}}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <!-- fila de filtros por columna -->
              <tr class="filter-row">
                <th *ngFor="let col of displayedColumns">
                  <ng-container [ngSwitch]="col">
                    <div *ngSwitchCase="'id'">
                      <input class="filter-input" placeholder="Filtrar ID" (input)="onFilterChange('id',$any($event.target).value)" />
                    </div>
                    <div *ngSwitchCase="'tarjetaId'">
                      <input class="filter-input" placeholder="Filtrar Tarjeta" (input)="onFilterChange('tarjetaId',$any($event.target).value)" />
                    </div>
                    <div *ngSwitchCase="'tipo'">
                      <input class="filter-input" placeholder="Filtrar Tipo" (input)="onFilterChange('tipo',$any($event.target).value)" />
                    </div>
                    <div *ngSwitchCase="'monto'">
                      <div class="monto-filters">
                        <input class="filter-input" placeholder="Min" type="number" (input)="onFilterChange('montoMin',$any($event.target).value)" />
                        <input class="filter-input" placeholder="Max" type="number" (input)="onFilterChange('montoMax',$any($event.target).value)" />
                      </div>
                    </div>
                    <div *ngSwitchCase="'fecha'">
                      <div class="fecha-filters">
                        <input class="filter-input" placeholder="Desde" type="date" (input)="onFilterChange('fechaFrom',$any($event.target).value)" />
                        <input class="filter-input" placeholder="Hasta" type="date" (input)="onFilterChange('fechaTo',$any($event.target).value)" />
                      </div>
                    </div>
                    <div *ngSwitchDefault>
                      <input class="filter-input" placeholder="Filtrar" (input)="onFilterChange(col,$any($event.target).value)" />
                    </div>
                  </ng-container>
                </th>
              </tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            <div class="loading-state" *ngIf="isLoading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando transacciones...</p>
            </div>

            <div class="error-state" *ngIf="error">
              <mat-icon color="warn">error_outline</mat-icon>
              <p>{{error}}</p>
            </div>

            <div class="empty-state" *ngIf="!isLoading && !error && transacciones.length === 0">
              <mat-icon>info_outline</mat-icon>
              <p>No hay transacciones para mostrar</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 60vh;
      background-color: #f5f5f5;
    }
    .dashboard-header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .title {
      display: flex;
      align-items: center;
      font-size: 1.1rem;
    }
    .title-icon {
      margin-right: 8px;
    }
    .spacer {
      flex: 1;
    }
    .main-content {
      padding: 24px;
    }
    mat-card {
      margin: 16px;
      padding: 16px;
    }
    .btn-volver {
      color: #42a5f5;
      font-weight: 500;
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      margin-right: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
    .btn-volver:hover {
      background: #a8ccebff;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }
    .tipo-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .tipo-badge.recarga {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .tipo-badge.pago {
      background-color: #fff3e0;
      color: #f57c00;
    }
    .tipo-badge.bloqueo {
      background-color: #ffebee;
      color: #c62828;
    }
    .tipo-badge.desbloqueo {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    button mat-icon {
      margin-right: 8px;
    }
    .loading-state,
    .error-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }
    .loading-state mat-spinner {
      margin-bottom: 1rem;
    }
    .error-state mat-icon,
    .empty-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 1rem;
    }
    .error-state mat-icon {
      color: #f44336;
    }
    .empty-state mat-icon {
      color: #9e9e9e;
    }
    .filter-row th { padding: 8px 12px; }
    .filter-input { width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid #ddd; }
    .monto-filters, .fecha-filters { display: flex; gap: 8px; }
    
    /* Estilos del panel de filtros */
    .filters-panel {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #e0e0e0;
    }
    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 150px;
    }
    .filter-item label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #666;
    }
    .filter-actions {
      display: flex;
      align-items: flex-end;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .btn:hover {
      background: #f5f5f5;
    }
    .btn-outline-secondary {
      color: #666;
      border-color: #999;
    }
  `]
})
export class TransaccionesComponent implements OnInit {
  transacciones: TransaccionTarjeta[] = [];
  allTransacciones: TransaccionTarjeta[] = [];
  displayedColumns: string[] = ['id', 'tarjetaId', 'tipo', 'monto', 'fecha'];
  isLoading = false;
  error: string | null = null;
  filters: any = {
    id: '',
    tarjetaId: '',
    tipo: '',
    montoMin: null,
    montoMax: null,
    fechaFrom: null,
    fechaTo: null,
  };

  constructor(
    private transaccionService: TransaccionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarTransacciones();
  }

  cargarTransacciones() {
    this.isLoading = true;
    this.error = null;

    
    this.transaccionService.obtenerTransacciones()
      .subscribe({
        next: (data) => {
          console.log('Transacciones recibidas (todas):', data);
          
          this.allTransacciones = (data || []).map((t: any) => ({
            id: t.id_transaccion || t.id || null,
            tarjetaId: t.numero_tarjeta || t.tarjetaId || null,
            tipo: t.tipo_transaccion || t.tipo || null,
            monto: t.monto ?? 0,
            saldoAnterior: t.saldoAnterior ?? null,
            saldoNuevo: t.saldoNuevo ?? null,
            fecha: t.fecha_transaccion || t.fecha || null,
            descripcion: t.descripcion || null,
            transporteId: t.transporteId || null,
          }));
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar transacciones:', error);
          this.error = `Error al cargar las transacciones: ${error.message || 'Error desconocido'}`;
          this.isLoading = false;
        }
      });
  }

  onFilterChange(key: string, value: any) {
    
    if (value === null || value === undefined || value === '') {
      this.filters[key] = null;
    } else if (key === 'montoMin' || key === 'montoMax') {
      const v = Number(value);
      this.filters[key] = isNaN(v) ? null : v;
    } else if (key === 'fechaFrom' || key === 'fechaTo') {
      this.filters[key] = value ? new Date(value) : null;
    } else {
      this.filters[key] = String(value).toLowerCase();
    }

    this.applyFilters();
  }

  applyFilters() {
    const f = this.filters;
    this.transacciones = this.allTransacciones.filter((t: any) => {
      
      if (f.id && !(String(t.id) || '').toLowerCase().includes(f.id)) return false;
      
      if (f.tarjetaId && !(String(t.tarjetaId) || '').toLowerCase().includes(f.tarjetaId)) return false;
      
      if (f.tipo && !(String(t.tipo) || '').toLowerCase().includes(f.tipo)) return false;
      
      if (f.montoMin != null && (t.monto == null || t.monto < f.montoMin)) return false;
      if (f.montoMax != null && (t.monto == null || t.monto > f.montoMax)) return false;
      
      if (f.fechaFrom && t.fecha) {
        const tf = new Date(t.fecha);
        if (tf < f.fechaFrom) return false;
      }
      if (f.fechaTo && t.fecha) {
        const tf = new Date(t.fecha);
        
        const end = new Date(f.fechaTo);
        end.setHours(23,59,59,999);
        if (tf > end) return false;
      }

      return true;
    });
  }

  clearFilters() {
    
    Object.keys(this.filters).forEach(k => this.filters[k] = null);
    
    
    const inputs = document.querySelectorAll('.filters-panel input');
    inputs.forEach((input: any) => {
      input.value = '';
    });
    
    
    this.applyFilters();
  }
}

export const transaccionRoutes: Routes = [
  {
    path: '',
    component: TransaccionesComponent,
    canActivate: [() => inject(AuthService).isAuthenticated()]
  }
];

export default transaccionRoutes;