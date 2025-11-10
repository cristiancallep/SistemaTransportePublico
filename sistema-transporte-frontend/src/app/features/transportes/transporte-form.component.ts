import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransporteService } from './services/transporte.service';
import { LineaService } from './services/linea.service';

@Component({
  selector: 'app-transporte-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">directions_bus</mat-icon>
          {{ isEdit ? 'Editar Transporte' : 'Nuevo Transporte' }}
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" [routerLink]="['/transportes']">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-grid">
              <div class="form-row">
                <label>Tipo</label>
                <input class="input" placeholder="Bus, Buseta, ..." formControlName="tipo" />
                <div class="error" *ngIf="form.get('tipo')?.invalid && form.get('tipo')?.touched">Tipo es requerido</div>
              </div>

              <div class="form-row">
                <label>Placa</label>
                <input class="input" placeholder="ABC123" formControlName="placa" />
                <div class="error" *ngIf="form.get('placa')?.invalid && form.get('placa')?.touched">Placa es requerida (mín 6 caracteres)</div>
              </div>

              <div class="form-row">
                <label>Capacidad</label>
                <input class="input" type="number" placeholder="40" formControlName="capacidad" />
                <div class="error" *ngIf="form.get('capacidad')?.invalid && form.get('capacidad')?.touched">Capacidad debe ser mayor a 0</div>
              </div>

              <div class="form-row">
                <label>Línea</label>
                <mat-form-field appearance="outline"> 
                  <mat-select placeholder="Selecciona una línea" formControlName="id_linea"> 
                    <mat-option *ngFor="let ln of lineas" [value]="ln.id_linea || ln.id || ln.idLinea"> 
                      {{ ln.nombre || 'Sin nombre' }} — {{ (ln.id_linea || ln.id || ln.idLinea) }}
                    </mat-option> 
                  </mat-select>
                </mat-form-field>
                <div class="hint">Se mostrarán todas las líneas disponibles por nombre y UUID</div>
              </div>

              <div class="form-row" *ngIf="isEdit">
                <label>Estado</label>
                <input class="input" placeholder="Activo/Inactivo/Mantenimiento" formControlName="estado" />
              </div>

              <div class="actions">
                <button mat-raised-button color="primary" [disabled]="form.invalid || isSaving">
                  <mat-icon>save</mat-icon>
                  {{ isEdit ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
            </form>

            <div class="loading-state" *ngIf="isLoading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando...</p>
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

    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    .form-row { display: flex; flex-direction: column; gap: 6px; }
    .input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; }
    .error { color: #d32f2f; font-size: .82rem; }
    .hint { color: #777; font-size: .82rem; }

    .actions { margin-top: 12px; }
    .btn-volver { color: #42a5f5; font-weight: 500; border-radius: 8px; padding: 0.6rem 1.2rem; margin-right: 16px; cursor: pointer; display: flex; align-items: center; transition: all .2s; box-shadow: 0 3px 6px rgba(0,0,0,.15); }
    .btn-volver:hover { background: #a8ccebff; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,.25); }
  `]
})
export class TransporteFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  isLoading = false;
  isSaving = false;
  id: string | null = null;
  lineas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private transporteService: TransporteService,
    private lineaService: LineaService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      placa: ['', [Validators.required, Validators.minLength(6)]],
      capacidad: [null, [Validators.required, Validators.min(1)]],
      id_linea: ['', [Validators.required]],
      estado: [''], // Solo para edición
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    // Cargar líneas para el select
    this.lineaService.getLineas().subscribe({
      next: (ls) => this.lineas = Array.isArray(ls) ? ls : (ls as any)?.data || [],
      error: (err) => {
        this.snack.open(`Error cargando líneas: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 4000 });
      }
    });

    if (this.isEdit && this.id) {
      this.isLoading = true;
      this.transporteService.getTransporte(this.id).subscribe({
        next: (t: any) => {
          const data = {
            tipo: t?.tipo || '',
            placa: t?.placa || '',
            capacidad: t?.capacidad ?? null,
            id_linea: t?.id_linea || '',
            estado: t?.estado || '',
          };
          this.form.patchValue(data);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.snack.open(`Error al cargar: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 4000 });
          this.router.navigate(['/transportes']);
        }
      })
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSaving = true;

    const payload: any = {
      tipo: this.form.value.tipo,
      placa: this.form.value.placa,
      capacidad: Number(this.form.value.capacidad),
      id_linea: this.form.value.id_linea,
    };

    if (this.isEdit && this.id) {
      // En update, estado es opcional
      const update: any = { ...payload };
      if (this.form.value.estado) update.estado = this.form.value.estado;

      this.transporteService.actualizarTransporte(this.id, update).subscribe({
        next: () => {
          this.snack.open('Transporte actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/transportes']);
        },
        error: (err) => {
          this.snack.open(`Error al actualizar: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000 });
          this.isSaving = false;
        }
      })
    } else {
      this.transporteService.crearTransporte(payload).subscribe({
        next: () => {
          this.snack.open('Transporte creado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/transportes']);
        },
        error: (err) => {
          this.snack.open(`Error al crear: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000 });
          this.isSaving = false;
        }
      })
    }
  }
}
