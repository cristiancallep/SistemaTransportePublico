import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransporteService } from './services/transporte.service';
import { LineaService } from './services/linea.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-lista-transportes',
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
    MatTooltipModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">directions_bus</mat-icon>
          Gestión de Transportes
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" [routerLink]="['/']">
          <mat-icon>home</mat-icon>
          Inicio
        </button>
        <button mat-raised-button color="accent" class="btn-volver" [routerLink]="['/transportes/crear']">
          <mat-icon>add</mat-icon>
          Nuevo Transporte
        </button>
        <button mat-raised-button color="warn" class="btn-volver" [routerLink]="['/transportes/lineas/crear']">
          <mat-icon>route</mat-icon>
          Crear Línea
        </button>
        <button mat-raised-button color="accent" class="btn-volver" [routerLink]="['/transportes/rutas']">
          <mat-icon>map</mat-icon>
          Ver Rutas
        </button>
        <button mat-raised-button color="accent" class="btn-volver" [routerLink]="['/transportes/lineas']">
          <mat-icon>playlist_add_check</mat-icon>
          Gestionar Líneas
        </button>
        <button mat-raised-button color="accent" class="btn-volver" [routerLink]="['/paradas/crear']">
          <mat-icon>add_location</mat-icon>
          Crear Parada
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <div class="filters-panel">
              <div class="filter-item">
                <label>Placa</label>
                <input class="filter-input" placeholder="Buscar placa" (input)="onFilterChange('placa',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Tipo</label>
                <input class="filter-input" placeholder="bus, metro, ..." (input)="onFilterChange('tipo',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Estado</label>
                <input class="filter-input" placeholder="Activo/Inactivo/Mantenimiento" (input)="onFilterChange('estado',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Capacidad (min / max)</label>
                <div class="saldo-filters">
                  <input class="filter-input" placeholder="Min" type="number" (input)="onFilterChange('capMin',$any($event.target).value)" />
                  <input class="filter-input" placeholder="Max" type="number" (input)="onFilterChange('capMax',$any($event.target).value)" />
                </div>
              </div>
              <div class="filter-actions">
                <button class="btn btn-outline-secondary" (click)="clearFilters()">Limpiar filtros</button>
              </div>
            </div>

            <table mat-table [dataSource]="transportes" class="w-100">
              <ng-container matColumnDef="placa">
                <th mat-header-cell *matHeaderCellDef>Placa</th>
                <td mat-cell *matCellDef="let t">{{t.placa}}</td>
              </ng-container>

              <ng-container matColumnDef="tipo">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let t">{{t.tipo}}</td>
              </ng-container>

              <ng-container matColumnDef="capacidad">
                <th mat-header-cell *matHeaderCellDef>Cap.</th>
                <td mat-cell *matCellDef="let t">{{t.capacidad}}</td>
              </ng-container>

              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let t">
                  <span [class]="'estado-badge ' + (t.estado || '').toLowerCase()">{{t.estado}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="linea">
                <th mat-header-cell *matHeaderCellDef>Línea</th>
                <td mat-cell *matCellDef="let t">{{t.lineaNombre || '—'}}</td>
              </ng-container>

              <ng-container matColumnDef="fechaRegistro">
                <th mat-header-cell *matHeaderCellDef>Registro</th>
                <td mat-cell *matCellDef="let t">{{t.fechaRegistro | date:'short'}}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let t">
                  <button mat-icon-button color="primary" matTooltip="Editar" [routerLink]="['/transportes/editar', t.id]">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(t.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="loading-state" *ngIf="isLoading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando transportes...</p>
            </div>

            <div class="error-state" *ngIf="error">
              <mat-icon color="warn">error_outline</mat-icon>
              <p>{{error}}</p>
            </div>

            <div class="empty-state" *ngIf="!isLoading && !error && transportes.length === 0">
              <mat-icon>info_outline</mat-icon>
              <p>No hay transportes para mostrar</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { min-height: 60vh; background: #f5f5f5; }
    .dashboard-header { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .title { display: flex; align-items: center; font-size: 1.1rem; }
    .title-icon { margin-right: 8px; }
    .spacer { flex: 1; }
    .main-content { padding: 24px; }
    mat-card { margin: 16px; padding: 16px; }
    .btn-volver { color: #42a5f5; font-weight: 500; border-radius: 8px; padding: 0.6rem 1.2rem; margin-right: 16px; cursor: pointer; display: flex; align-items: center; transition: all .2s; box-shadow: 0 3px 6px rgba(0,0,0,.15); }
    .btn-volver:hover { background: #a8ccebff; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,.25); }

    .estado-badge { padding: 4px 8px; border-radius: 4px; font-size: .85rem; font-weight: 500; text-transform: capitalize; }
    .estado-badge.activo { background: #e8f5e9; color: #2e7d32; }
    .estado-badge.inactivo { background: #f3e5f5; color: #6a1b9a; }
    .estado-badge.mantenimiento { background: #fff3e0; color: #f57c00; }

    .loading-state, .error-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
    .loading-state mat-spinner { margin-bottom: 1rem; }
    .error-state mat-icon, .empty-state mat-icon { font-size: 48px; height: 48px; width: 48px; margin-bottom: 1rem; }
    .error-state mat-icon { color: #f44336; }
    .empty-state mat-icon { color: #9e9e9e; }

    .filters-panel { display: flex; flex-wrap: wrap; gap: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e0e0e0; }
    .filter-item { display: flex; flex-direction: column; gap: 4px; min-width: 150px; }
    .filter-item label { font-size: .85rem; font-weight: 500; color: #666; }
    .filter-input { width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid #ddd; }
    .saldo-filters { display: flex; gap: 8px; }
    .filter-actions { display: flex; align-items: flex-end; }
    .btn { padding: 8px 16px; border-radius: 4px; border: 1px solid #ddd; background: white; cursor: pointer; font-size: .9rem; }
    .btn:hover { background: #f5f5f5; }
  `]
})
export class ListaTransportesComponent implements OnInit {
  transportes: any[] = [];
  allTransportes: any[] = [];
  displayedColumns: string[] = ['placa', 'tipo', 'capacidad', 'estado', 'linea', 'fechaRegistro', 'acciones'];
  isLoading = false;
  error: string | null = null;
  filters: any = {
    placa: '',
    tipo: '',
    estado: '',
    capMin: null,
    capMax: null,
  };
  lineaMap: Record<string, string> = {};

  constructor(
    private transporteService: TransporteService,
    private lineaService: LineaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.isLoading = true;
    this.error = null;
    
    forkJoin({
      transportes: this.transporteService.getTransportes(),
      lineas: this.lineaService.getLineas()
    }).subscribe({
      next: ({ transportes, lineas }) => {
        // Construir mapa id_linea -> nombre
        const listaLineas = Array.isArray(lineas) ? lineas : (lineas as any)?.data || [];
        this.lineaMap = {};
        for (const ln of listaLineas) {
          const key = ln.id_linea || ln.id || ln.idLinea;
          if (key) this.lineaMap[String(key)] = ln.nombre || '—';
        }

        const list = Array.isArray(transportes) ? transportes : (transportes as any)?.data || [];
        this.allTransportes = list.map((t: any) => {
          const idLinea = t.id_linea || t.idLinea;
          const lineaNombre = idLinea ? this.lineaMap[String(idLinea)] || '—' : '—';
          return {
            id: t.id || t.id_transporte || t.idTransporte,
            placa: t.placa,
            tipo: t.tipo,
            capacidad: t.capacidad,
            estado: t.estado,
            fechaRegistro: t.fechaRegistro || t.fecha_registro,
            idLinea,
            lineaNombre,
          };
        });
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        
        console.warn('Error al cargar lineas/transportes, intentando cargar transportes solo', err);
        this.transporteService.getTransportes().subscribe({
          next: (res: any) => {
            const list = Array.isArray(res) ? res : (res?.data || []);
            this.allTransportes = list.map((t: any) => ({
              id: t.id || t.id_transporte || t.idTransporte,
              placa: t.placa,
              tipo: t.tipo,
              capacidad: t.capacidad,
              estado: t.estado,
              fechaRegistro: t.fechaRegistro || t.fecha_registro,
              idLinea: t.id_linea || t.idLinea,
              lineaNombre: '—',
            }));
            this.applyFilters();
            this.isLoading = false;
          },
          error: (e2) => {
            this.error = e2?.error?.detail || e2?.message || 'Error al cargar transportes';
            this.isLoading = false;
          }
        });
      }
    });
  }

  onFilterChange(key: string, value: any) {
    if (value === null || value === undefined || value === '') {
      this.filters[key] = null;
    } else if (key === 'capMin' || key === 'capMax') {
      const v = Number(value);
      this.filters[key] = isNaN(v) ? null : v;
    } else {
      this.filters[key] = String(value).toLowerCase();
    }
    this.applyFilters();
  }

  applyFilters() {
    const f = this.filters;
    this.transportes = this.allTransportes.filter((t: any) => {
      if (f.placa && !(String(t.placa) || '').toLowerCase().includes(f.placa)) return false;
      if (f.tipo && !(String(t.tipo) || '').toLowerCase().includes(f.tipo)) return false;
      if (f.estado && !(String(t.estado) || '').toLowerCase().includes(f.estado)) return false;
      if (f.capMin != null && (t.capacidad == null || t.capacidad < f.capMin)) return false;
      if (f.capMax != null && (t.capacidad == null || t.capacidad > f.capMax)) return false;
      return true;
    });
  }

  clearFilters() {
    Object.keys(this.filters).forEach(k => this.filters[k] = null);
    const inputs = document.querySelectorAll('.filters-panel input');
    inputs.forEach((input: any) => input.value = '');
    this.applyFilters();
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar este transporte? Esta acción no se puede deshacer.')) return;
    this.transporteService.eliminarTransporte(id).subscribe({
      next: () => {
        this.snackBar.open('Transporte eliminado', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
        this.cargar();
      },
      error: (err) => {
        this.snackBar.open(`Error al eliminar: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000, horizontalPosition: 'end', verticalPosition: 'top' });
      }
    })
  }
}
