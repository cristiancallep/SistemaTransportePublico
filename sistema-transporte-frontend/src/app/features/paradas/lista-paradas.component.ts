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
import { ParadaService } from './services/parada.service';

@Component({
  selector: 'app-lista-paradas',
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
          <mat-icon class="title-icon">place</mat-icon>
          Gestión de Paradas
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="accent" class="btn-volver" [routerLink]="['/paradas/crear']">
          <mat-icon>add_location</mat-icon>
          Nueva Parada
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <div class="filters-panel">
              <div class="filter-item">
                <label>Nombre</label>
                <input class="filter-input" placeholder="Buscar nombre" (input)="onFilterChange('nombre',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Dirección</label>
                <input class="filter-input" placeholder="Buscar dirección" (input)="onFilterChange('direccion',$any($event.target).value)" />
              </div>
              <div class="filter-item">
                <label>Estado</label>
                <input class="filter-input" placeholder="Activa/Inactiva/Mantenimiento" (input)="onFilterChange('estado',$any($event.target).value)" />
              </div>
              <div class="filter-actions">
                <button class="btn" (click)="clearFilters()">Limpiar filtros</button>
              </div>
            </div>

            <table mat-table [dataSource]="paradas" class="w-100">
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let p">{{p.nombre}}</td>
              </ng-container>

              <ng-container matColumnDef="direccion">
                <th mat-header-cell *matHeaderCellDef>Dirección</th>
                <td mat-cell *matCellDef="let p">{{p.direccion}}</td>
              </ng-container>

              <ng-container matColumnDef="coordenadas">
                <th mat-header-cell *matHeaderCellDef>Coordenadas</th>
                <td mat-cell *matCellDef="let p">{{p.coordenadas || '—'}} </td>
              </ng-container>

              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let p">
                  <span [class]="'estado-badge ' + (p.estado || '').toLowerCase()">{{p.estado}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let p">
                  <button mat-icon-button color="primary" matTooltip="Editar" [routerLink]="['/paradas/editar', p.id_parada || p.id]">
                    <mat-icon>edit_location</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(p.id_parada || p.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="loading-state" *ngIf="isLoading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando paradas...</p>
            </div>

            <div class="error-state" *ngIf="error">
              <mat-icon color="warn">error_outline</mat-icon>
              <p>{{error}}</p>
            </div>

            <div class="empty-state" *ngIf="!isLoading && !error && paradas.length === 0">
              <mat-icon>info_outline</mat-icon>
              <p>No hay paradas para mostrar</p>
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
    .estado-badge.activa { background: #e8f5e9; color: #2e7d32; }
    .estado-badge.inactiva { background: #f3e5f5; color: #6a1b9a; }
    .estado-badge.mantenimiento { background: #fff3e0; color: #f57c00; }
    .loading-state, .error-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
    .filters-panel { display: flex; flex-wrap: wrap; gap: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e0e0e0; }
    .filter-item { display: flex; flex-direction: column; gap: 4px; min-width: 150px; }
    .filter-item label { font-size: .85rem; font-weight: 500; color: #666; }
    .filter-input { width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid #ddd; }
    .filter-actions { display: flex; align-items: flex-end; }
    .btn { padding: 8px 16px; border-radius: 4px; border: 1px solid #ddd; background: white; cursor: pointer; font-size: .9rem; }
    .btn:hover { background: #f5f5f5; }
  `]
})
export class ListaParadasComponent implements OnInit {
  paradas: any[] = [];
  allParadas: any[] = [];
  displayedColumns: string[] = ['nombre', 'direccion', 'coordenadas', 'estado', 'acciones'];
  isLoading = false;
  error: string | null = null;
  filters: any = { nombre: '', direccion: '', estado: '' };

  constructor(private paradaService: ParadaService, private snack: MatSnackBar, private router: Router) {}

  ngOnInit(): void { this.cargar(); }

  cargar() {
    this.isLoading = true; this.error = null;
    this.paradaService.getParadas().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res as any)?.data || [];
        this.allParadas = list.map((p: any) => ({
          id: p.id_parada || p.id,
          id_parada: p.id_parada || p.id,
          nombre: p.nombre,
          direccion: p.direccion,
          coordenadas: p.coordenadas,
          estado: p.estado,
          fechaRegistro: p.fecha_registro || p.fechaRegistro,
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => { this.error = err?.error?.detail || err?.message || 'Error al cargar paradas'; this.isLoading = false; }
    });
  }

  onFilterChange(key: string, value: any) {
    this.filters[key] = (value || '').toLowerCase();
    if (!value) this.filters[key] = '';
    this.applyFilters();
  }

  applyFilters() {
    const f = this.filters;
    this.paradas = this.allParadas.filter(p => {
      if (f.nombre && !(p.nombre || '').toLowerCase().includes(f.nombre)) return false;
      if (f.direccion && !(p.direccion || '').toLowerCase().includes(f.direccion)) return false;
      if (f.estado && !(p.estado || '').toLowerCase().includes(f.estado)) return false;
      return true;
    });
  }

  clearFilters() {
    Object.keys(this.filters).forEach(k => this.filters[k] = '');
    const inputs = document.querySelectorAll('.filters-panel input');
    inputs.forEach((i: any) => i.value = '');
    this.applyFilters();
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar esta parada? Esta acción no se puede deshacer.')) return;
    this.paradaService.eliminarParada(id).subscribe({
      next: () => { this.snack.open('Parada eliminada', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }); this.cargar(); },
      error: (err) => { this.snack.open(`Error al eliminar: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000, horizontalPosition: 'end', verticalPosition: 'top' }); }
    });
  }
}
