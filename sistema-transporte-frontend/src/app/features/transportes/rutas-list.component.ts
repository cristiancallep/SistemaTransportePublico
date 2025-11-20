import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RutaService } from './services/ruta.service';

@Component({
  selector: 'app-rutas-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">map</mat-icon>
          Rutas
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="accent" class="btn-volver" [routerLink]="['/transportes/rutas/crear']">
          <mat-icon>add</mat-icon>
          Nueva Ruta
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <table mat-table [dataSource]="rutas" class="w-100">
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let r">{{ r.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="origen">
                <th mat-header-cell *matHeaderCellDef>Origen</th>
                <td mat-cell *matCellDef="let r">{{ r.origen }}</td>
              </ng-container>

              <ng-container matColumnDef="destino">
                <th mat-header-cell *matHeaderCellDef>Destino</th>
                <td mat-cell *matCellDef="let r">{{ r.destino }}</td>
              </ng-container>

              <ng-container matColumnDef="duracion">
                <th mat-header-cell *matHeaderCellDef>Duración (min)</th>
                <td mat-cell *matCellDef="let r">{{ r.duracion_estimada }}</td>
              </ng-container>

              <ng-container matColumnDef="linea">
                <th mat-header-cell *matHeaderCellDef>Línea (ID)</th>
                <td mat-cell *matCellDef="let r">{{ r.id_linea }}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let r">
                  <button mat-icon-button color="primary" matTooltip="Editar" (click)="iniciarEdicion(r)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(r.id_ruta)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="loading-state" *ngIf="isLoading">
              <mat-progress-spinner diameter="40" mode="indeterminate"></mat-progress-spinner>
              <p>Cargando rutas...</p>
            </div>

            <div class="error-state" *ngIf="error">
              <mat-icon color="warn">error_outline</mat-icon>
              <p>{{ error }}</p>
            </div>

            <div class="empty-state" *ngIf="!isLoading && !error && rutas.length === 0">
              <mat-icon>info_outline</mat-icon>
              <p>No hay rutas para mostrar</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { min-height: 60vh; background:#f5f5f5; }
    .dashboard-header { box-shadow: 0 2px 4px rgba(0,0,0,.1); }
    .title { display:flex; align-items:center; font-size:1.1rem; }
    .title-icon { margin-right:8px; }
    .spacer { flex:1; }
    .main-content { padding:24px; }
    mat-card { margin:16px; }
    .btn-volver { color:#42a5f5; font-weight:500; border-radius:8px; padding:.6rem 1.2rem; margin-right:16px; display:flex; align-items:center; box-shadow:0 3px 6px rgba(0,0,0,.15); transition:.2s; }
    .btn-volver:hover { background:#a8ccebff; transform:translateY(-2px); box-shadow:0 4px 10px rgba(0,0,0,.25); }
    .loading-state, .error-state, .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; text-align:center; }
    .error-state mat-icon, .empty-state mat-icon { font-size:48px; height:48px; width:48px; margin-bottom:1rem; }
    .error-state mat-icon { color:#f44336; }
    .empty-state mat-icon { color:#9e9e9e; }
  `]
})
export class RutasListComponent implements OnInit {
  rutas: any[] = [];
  displayedColumns = ['nombre','origen','destino','duracion','linea','acciones'];
  isLoading = false;
  error: string | null = null;
  editing: any | null = null;
  saving = false;

  constructor(private rutaService: RutaService, private snack: MatSnackBar) {}

  ngOnInit(): void { this.cargar(); }

  cargar() {
    this.isLoading = true;
    this.error = null;
    this.rutaService.getRutas().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        // Normalizar nombres de propiedades posibles
        this.rutas = list.map((r: any) => ({
          id_ruta: r.id_ruta || r.id || r.idRuta,
          id_linea: r.id_linea || r.idLinea,
          nombre: r.nombre,
          origen: r.origen,
          destino: r.destino,
          duracion_estimada: r.duracion_estimada || r.duracionEstimada,
        }));
        this.isLoading = false;
      },
      error: (err) => {
  this.error = err?.error?.detail || err?.message || 'Error al cargar rutas';
  this.snack.open(this.error || 'Error al cargar rutas', 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  iniciarEdicion(r: any) {
    this.editing = { ...r };
    // Implementación simple: prompt por ahora. Podemos migrar a un dialog / form inline.
    const nuevoNombre = prompt('Nuevo nombre de la ruta', this.editing.nombre);
    if (nuevoNombre === null) return; // cancelado
    this.editing.nombre = nuevoNombre.trim();
    const nuevoOrigen = prompt('Nuevo origen', this.editing.origen);
    if (nuevoOrigen === null) return;
    this.editing.origen = nuevoOrigen.trim();
    const nuevoDestino = prompt('Nuevo destino', this.editing.destino);
    if (nuevoDestino === null) return;
    this.editing.destino = nuevoDestino.trim();
    const nuevaDur = prompt('Nueva duración (minutos)', String(this.editing.duracion_estimada));
    if (nuevaDur === null) return;
    const dur = Number(nuevaDur);
    if (isNaN(dur) || dur <= 0) { this.snack.open('Duración inválida', 'Cerrar', { duration: 3000 }); return; }
    this.editing.duracion_estimada = dur;

    this.saving = true;
    this.rutaService.actualizarRuta({
      id_ruta: this.editing.id_ruta,
      nombre: this.editing.nombre,
      origen: this.editing.origen,
      destino: this.editing.destino,
      duracion_estimada: this.editing.duracion_estimada,
    }).subscribe({
      next: () => {
        this.snack.open('Ruta actualizada', 'Cerrar', { duration: 3000 });
        this.saving = false;
        this.editing = null;
        this.cargar();
      },
      error: (err) => {
        this.snack.open(err?.error?.detail || err?.message || 'Error al actualizar', 'Cerrar', { duration: 5000 });
        this.saving = false;
      }
    });
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar esta ruta? Esta acción no se puede deshacer.')) return;
    this.rutaService.eliminarRuta(id).subscribe({
      next: () => { this.snack.open('Ruta eliminada', 'Cerrar', { duration: 3000 }); this.cargar(); },
      error: (err) => this.snack.open(err?.error?.detail || err?.message || 'Error al eliminar', 'Cerrar', { duration: 5000 })
    });
  }
}
