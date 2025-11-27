import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ParadaService } from './services/parada.service';

@Component({
  selector: 'app-parada-form',
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
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">add_location</mat-icon>
          {{ isEdit ? 'Editar Parada' : 'Nueva Parada' }}
        </span>
        <div class="spacer"></div>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-grid">
              <div class="form-row">
                <label>Nombre</label>
                <input class="input" placeholder="Nombre de la parada" formControlName="nombre" />
                <div class="error" *ngIf="form.get('nombre')?.invalid && form.get('nombre')?.touched">Nombre requerido (mín 3)</div>
              </div>
              <div class="form-row">
                <label>Dirección</label>
                <input class="input" placeholder="Dirección completa" formControlName="direccion" />
                <div class="error" *ngIf="form.get('direccion')?.invalid && form.get('direccion')?.touched">Dirección requerida (mín 10)</div>
              </div>
              <div class="form-row">
                <label>Coordenadas</label>
                <input class="input" placeholder="latitud, longitud" formControlName="coordenadas" />
                <div class="hint">Formato: latitud, longitud (opcional)</div>
              </div>
              <div class="form-row" *ngIf="isEdit">
                <label>Estado</label>
                <input class="input" placeholder="Activa/Inactiva/Mantenimiento" formControlName="estado" />
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
export class ParadaFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  isLoading = false;
  isSaving = false;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private paradaService: ParadaService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      coordenadas: [''],
      estado: [''], 
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;
    if (this.isEdit && this.id) {
      this.isLoading = true;
      this.paradaService.getParada(this.id).subscribe({
        next: (p: any) => {
          this.form.patchValue({
            nombre: p?.nombre || '',
            direccion: p?.direccion || '',
            coordenadas: p?.coordenadas || '',
            estado: p?.estado || '',
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
            this.snack.open(`Error al cargar: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 4000 });
            this.router.navigate(['/paradas']);
        }
      })
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSaving = true;
    const payload: any = {
      nombre: this.form.value.nombre,
      direccion: this.form.value.direccion,
      coordenadas: this.form.value.coordenadas || undefined,
    };

    if (this.isEdit && this.id) {
      const update: any = { ...payload };
      if (this.form.value.estado) update.estado = this.form.value.estado;
      this.paradaService.actualizarParada(this.id, update).subscribe({
        next: () => { this.snack.open('Parada actualizada', 'Cerrar', { duration: 3000 }); this.router.navigate(['/paradas']); },
        error: (err) => { this.snack.open(`Error al actualizar: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000 }); this.isSaving = false; }
      });
    } else {
      this.paradaService.crearParada(payload).subscribe({
        next: () => { this.snack.open('Parada creada', 'Cerrar', { duration: 3000 }); this.router.navigate(['/paradas']); },
        error: (err) => { this.snack.open(`Error al crear: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000 }); this.isSaving = false; }
      });
    }
  }
}
