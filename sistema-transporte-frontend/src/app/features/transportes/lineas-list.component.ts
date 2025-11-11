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
import { LineaService } from './services/linea.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lineas-list',
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
    ReactiveFormsModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">route</mat-icon>
          Gestión de Líneas
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" [routerLink]="['/transportes']">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
        <button mat-raised-button color="accent" class="btn-volver" [routerLink]="['/transportes/lineas/crear']">
          <mat-icon>add</mat-icon>
          Nueva Línea
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <div class="filters-panel">
              <div class="filter-item">
                <label>Buscar nombre</label>
                <input class="filter-input" placeholder="Nombre" (input)="onFilterChange($any($event.target).value)" />
              </div>
              <div class="filter-actions">
                <button class="btn" (click)="clearFilter()">Limpiar</button>
              </div>
            </div>

            <table mat-table [dataSource]="lineas" class="w-100">
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let l">{{l.nombre}}</td>
              </ng-container>

              <ng-container matColumnDef="descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let l">{{l.descripcion || '—'}}</td>
              </ng-container>

              <ng-container matColumnDef="fecha_creacion">
                <th mat-header-cell *matHeaderCellDef>Creación</th>
                <td mat-cell *matCellDef="let l">{{l.fecha_creacion | date:'short'}}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let l">
                  <button mat-icon-button color="primary" matTooltip="Editar" (click)="iniciarEdicion(l)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(l.id_linea || l.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="empty-state" *ngIf="!isLoading && lineas.length === 0">No hay líneas</div>
            <div class="loading-state" *ngIf="isLoading">
              <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
              <p>Cargando...</p>
            </div>

            <!-- Panel de edición inline -->
            <div class="edit-panel" *ngIf="editForm">
              <h3>Editar Línea</h3>
              <form [formGroup]="editForm" (ngSubmit)="guardarEdicion()" class="form-grid">
                <div class="form-row">
                  <label>Nombre</label>
                  <input class="input" formControlName="nombre" />
                </div>
                <div class="form-row">
                  <label>Descripción</label>
                  <textarea class="input" rows="3" formControlName="descripcion"></textarea>
                </div>
                <div class="actions">
                  <button mat-raised-button color="primary" [disabled]="editForm.invalid || savingEdit">
                    <mat-icon>save</mat-icon>
                    Guardar
                  </button>
                  <button mat-raised-button color="warn" type="button" (click)="cancelarEdicion()">
                    <mat-icon>close</mat-icon>
                    Cancelar
                  </button>
                </div>
                <div class="loading-state" *ngIf="savingEdit">
                  <mat-progress-spinner diameter="30" mode="indeterminate"></mat-progress-spinner>
                  <p>Guardando cambios...</p>
                </div>
              </form>
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
    .filters-panel { display:flex; flex-wrap:wrap; gap:16px; padding:16px; background:#f9f9f9; border:1px solid #e0e0e0; border-radius:8px; margin-bottom:16px; }
    .filter-item { display:flex; flex-direction:column; gap:4px; min-width:180px; }
    .filter-item label { font-size:.85rem; font-weight:500; color:#666; }
    .filter-input { padding:6px 8px; border:1px solid #ddd; border-radius:4px; }
    .filter-actions { display:flex; align-items:flex-end; }
    .btn { padding:8px 16px; border-radius:4px; border:1px solid #ddd; background:white; cursor:pointer; font-size:.9rem; }
    .btn:hover { background:#f5f5f5; }
    .edit-panel { margin-top:24px; padding:16px; border:1px solid #e0e0e0; border-radius:8px; background:#fff; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px; }
    .form-row { display:flex; flex-direction:column; gap:6px; }
    .input, textarea.input { width:100%; padding:8px 10px; border:1px solid #ddd; border-radius:6px; font-family:inherit; }
    .actions { display:flex; gap:12px; margin-top:8px; }
    .loading-state { display:flex; flex-direction:column; align-items:center; gap:8px; margin-top:12px; }
  `]
})
export class LineasListComponent implements OnInit {
  lineas: any[] = [];
  allLineas: any[] = [];
  displayedColumns = ['nombre','descripcion','fecha_creacion','acciones'];
  isLoading = false;
  filterNombre = '';
  editForm: FormGroup | null = null;
  editingId: string | null = null;
  savingEdit = false;

  constructor(private lineaService: LineaService, private snack: MatSnackBar, private fb: FormBuilder) {}

  ngOnInit(): void { this.cargar(); }

  cargar() {
    this.isLoading = true;
    this.lineaService.getLineas().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res as any)?.data || [];
        this.allLineas = list.map((l: any) => ({
          id_linea: l.id_linea || l.id,
          nombre: l.nombre,
          descripcion: l.descripcion,
          fecha_creacion: l.fecha_creacion || l.fechaCreacion,
          fecha_actualizacion: l.fecha_actualizacion || l.fechaActualizacion,
        }));
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.snack.open(err?.error?.detail || err?.message || 'Error al cargar líneas','Cerrar',{duration:5000});
        this.isLoading = false;
      }
    });
  }

  onFilterChange(value: string) {
    this.filterNombre = (value || '').toLowerCase();
    this.applyFilter();
  }

  applyFilter() {
    if (!this.filterNombre) {
      this.lineas = [...this.allLineas];
    } else {
      this.lineas = this.allLineas.filter(l => (l.nombre || '').toLowerCase().includes(this.filterNombre));
    }
  }

  clearFilter() {
    this.filterNombre = '';
    const input = document.querySelector('.filters-panel input') as HTMLInputElement | null;
    if (input) input.value = '';
    this.applyFilter();
  }

  iniciarEdicion(linea: any) {
    this.editingId = linea.id_linea;
    this.editForm = this.fb.group({
      nombre: [linea.nombre, [Validators.required, Validators.minLength(1)]],
      descripcion: [linea.descripcion || ''],
    });
  }

  cancelarEdicion() {
    this.editForm = null;
    this.editingId = null;
  }

  guardarEdicion() {
    if (!this.editForm || !this.editingId || this.editForm.invalid) return;
    this.savingEdit = true;
    const payload = { ...this.editForm.value };
    this.lineaService.actualizarLinea(this.editingId, payload).subscribe({
      next: () => {
        this.snack.open('Línea actualizada', 'Cerrar', { duration: 3000 });
        this.savingEdit = false;
        this.editForm = null;
        this.editingId = null;
        this.cargar();
      },
      error: (err) => {
        this.snack.open(err?.error?.detail || err?.message || 'Error al actualizar', 'Cerrar', { duration: 5000 });
        this.savingEdit = false;
      }
    });
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar esta línea? Si tiene transportes asociados puede fallar.')) return;
    
    this.lineaService.eliminarLinea(id).subscribe({
      next: () => { this.snack.open('Línea eliminada', 'Cerrar', { duration: 3000 }); this.cargar(); },
      error: (err) => this.snack.open(err?.error?.detail || err?.message || 'Error al eliminar', 'Cerrar', { duration: 5000 })
    });
  }
}
