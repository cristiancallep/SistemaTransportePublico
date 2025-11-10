import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TarjetaService } from '../services/tarjeta.service';
import { Tarjeta } from '../../../shared/models';

@Component({
  selector: 'app-lista-tarjetas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">credit_card</mat-icon>
          Lista de Tarjetas
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" [routerLink]="['/tarjetas']">
          <mat-icon>arrow_back</mat-icon>
          Volver al menú
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <!-- Panel de filtros visible encima de la tabla -->
            <div class="filters-panel">
              <div class="filter-item">
                <label>Número</label>
                <input class="filter-input" placeholder="Número de tarjeta" (input)="onFilterChange('numero',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Estado</label>
                <input class="filter-input" placeholder="Estado (activa/bloqueada)" (input)="onFilterChange('estado',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Saldo (min / max)</label>
                <div class="saldo-filters">
                  <input class="filter-input" placeholder="Min" type="number" (input)="onFilterChange('saldoMin',$any($event.target).value)" />
                  <input class="filter-input" placeholder="Max" type="number" (input)="onFilterChange('saldoMax',$any($event.target).value)" />
                </div>
              </div>
              <div class="filter-item">
                <label>Fecha Última Recarga (desde / hasta)</label>
                <div class="fecha-filters">
                  <input class="filter-input" type="date" (input)="onFilterChange('fechaFrom',$any($event.target).value)" />
                  <input class="filter-input" type="date" (input)="onFilterChange('fechaTo',$any($event.target).value)" />
                </div>
              </div>
              <div class="filter-actions">
                <button class="btn btn-outline-secondary" (click)="clearFilters()">Limpiar filtros</button>
              </div>
            </div>

            <table mat-table [dataSource]="tarjetas" class="w-100">
              <ng-container matColumnDef="numero">
                <th mat-header-cell *matHeaderCellDef>Número</th>
                <td mat-cell *matCellDef="let tarjeta">{{tarjeta.numero}}</td>
              </ng-container>

              <ng-container matColumnDef="saldo">
                <th mat-header-cell *matHeaderCellDef>Saldo</th>
                <td mat-cell *matCellDef="let tarjeta">{{tarjeta.saldo | currency}}</td>
              </ng-container>

              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let tarjeta">
                  <span [class]="'estado-badge ' + tarjeta.estado">{{tarjeta.estado}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="fechaUltimaRecarga">
                <th mat-header-cell *matHeaderCellDef>Fecha Última Recarga</th>
                <td mat-cell *matCellDef="let tarjeta">{{tarjeta.fechaUltimaRecarga | date:'short'}}</td>
              </ng-container>

              <ng-container matColumnDef="usuarioId">
                <th mat-header-cell *matHeaderCellDef>Usuario ID</th>
                <td mat-cell *matCellDef="let tarjeta">{{tarjeta.usuarioId}}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let tarjeta">
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="eliminarTarjeta(tarjeta.id)"
                    matTooltip="Eliminar tarjeta"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="loading-state" *ngIf="isLoading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando tarjetas...</p>
            </div>

            <div class="error-state" *ngIf="error">
              <mat-icon color="warn">error_outline</mat-icon>
              <p>{{error}}</p>
            </div>

            <div class="empty-state" *ngIf="!isLoading && !error && tarjetas.length === 0">
              <mat-icon>info_outline</mat-icon>
              <p>No hay tarjetas para mostrar</p>
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
    .estado-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .estado-badge.activa {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .estado-badge.bloqueada {
      background-color: #ffebee;
      color: #c62828;
    }
    .estado-badge.vencida {
      background-color: #fff3e0;
      color: #f57c00;
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
    .filter-input {
      width: 100%;
      padding: 6px 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    .saldo-filters, .fecha-filters {
      display: flex;
      gap: 8px;
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
    
    /* Estilos para la columna de acciones */
    .mat-column-acciones {
      width: 100px;
      text-align: center;
    }
    
    button[mat-icon-button] {
      transition: all 0.2s ease-in-out;
    }
    
    button[mat-icon-button]:hover {
      transform: scale(1.1);
    }
  `]
})
export class ListaTarjetasComponent implements OnInit {
  tarjetas: Tarjeta[] = [];
  allTarjetas: Tarjeta[] = [];
  displayedColumns: string[] = ['numero', 'saldo', 'estado', 'fechaUltimaRecarga', 'usuarioId', 'acciones'];
  isLoading = false;
  error: string | null = null;
  filters: any = {
    numero: '',
    estado: '',
    saldoMin: null,
    saldoMax: null,
    fechaFrom: null,
    fechaTo: null,
  };

  constructor(private tarjetaService: TarjetaService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.cargarTarjetas();
  }

  cargarTarjetas() {
    this.isLoading = true;
    this.error = null;

    this.tarjetaService.getTarjetas().subscribe({
      next: (response: any) => {
        console.log('Tarjetas recibidas:', response);
        // Mapear los campos si es necesario
        this.allTarjetas = (response?.data || response || []).map((t: any) => ({
          id: t.id || t.id_tarjeta || null,
          numero: t.numero || t.numero_tarjeta || null,
          saldo: t.saldo ?? 0,
          estado: t.estado || 'activa',
          fechaUltimaRecarga: t.fechaUltimaRecarga || t.fecha_ultima_recarga || null,
          fechaVencimiento: t.fechaVencimiento || t.fecha_vencimiento || null,
          usuarioId: t.usuarioId || t.id_usuario || null,
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar tarjetas:', error);
        this.error = `Error al cargar las tarjetas: ${error.message || 'Error desconocido'}`;
        this.isLoading = false;
      }
    });
  }

  onFilterChange(key: string, value: any) {
    // Normalizar valores
    if (value === null || value === undefined || value === '') {
      this.filters[key] = null;
    } else if (key === 'saldoMin' || key === 'saldoMax') {
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
    this.tarjetas = this.allTarjetas.filter((t: any) => {
      // numero filter (substring)
      if (f.numero && !(String(t.numero) || '').toLowerCase().includes(f.numero)) return false;
      // estado filter
      if (f.estado && !(String(t.estado) || '').toLowerCase().includes(f.estado)) return false;
      // saldo range
      if (f.saldoMin != null && (t.saldo == null || t.saldo < f.saldoMin)) return false;
      if (f.saldoMax != null && (t.saldo == null || t.saldo > f.saldoMax)) return false;
      // fecha ultima recarga range
      if (f.fechaFrom && t.fechaUltimaRecarga) {
        const tf = new Date(t.fechaUltimaRecarga);
        if (tf < f.fechaFrom) return false;
      }
      if (f.fechaTo && t.fechaUltimaRecarga) {
        const tf = new Date(t.fechaUltimaRecarga);
        const end = new Date(f.fechaTo);
        end.setHours(23,59,59,999);
        if (tf > end) return false;
      }

      return true;
    });
  }

  clearFilters() {
    // Limpiar todos los filtros
    Object.keys(this.filters).forEach(k => this.filters[k] = null);
    
    // Limpiar los inputs del DOM
    const inputs = document.querySelectorAll('.filters-panel input');
    inputs.forEach((input: any) => {
      input.value = '';
    });
    
    // Reaplicar filtros (mostrará todos los registros)
    this.applyFilters();
  }

  eliminarTarjeta(id: number) {
    if (!confirm('¿Está seguro que desea eliminar esta tarjeta? Esta acción no se puede deshacer.')) {
      return;
    }

    this.tarjetaService.eliminarTarjeta(id).subscribe({
      next: () => {
        this.snackBar.open('Tarjeta eliminada exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        // Recargar la lista de tarjetas
        this.cargarTarjetas();
      },
      error: (error: any) => {
        console.error('Error al eliminar tarjeta:', error);
        this.snackBar.open(
          `Error al eliminar la tarjeta: ${error.error?.detail || error.message || 'Error desconocido'}`,
          'Cerrar',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }
}