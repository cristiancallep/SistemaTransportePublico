import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LineaService } from './services/linea.service';

@Component({
  selector: 'app-linea-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">route</mat-icon>
          {{ isEdit ? 'Editar Línea' : 'Crear Línea' }}
        </span>
        <div class="spacer"></div>
      </mat-toolbar>

      <div class="main-content">
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-wrapper">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput placeholder="Línea 1" formControlName="nombre" />
                <mat-error *ngIf="form.get('nombre')?.hasError('required')">Nombre requerido</mat-error>
                <mat-error *ngIf="form.get('nombre')?.hasError('minlength')">Mínimo 2 caracteres</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Descripción</mat-label>
                <textarea matInput rows="3" placeholder="Descripción opcional" formControlName="descripcion"></textarea>
              </mat-form-field>

              <div class="actions">
                <button mat-raised-button color="accent" [disabled]="form.invalid || isSaving">
                  <mat-icon>save</mat-icon>
                  {{ isEdit ? 'Guardar Cambios' : 'Crear Línea' }}
                </button>
              </div>
            </form>
            <div class="loading-state" *ngIf="isSaving">
              <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
              <p>{{ isEdit ? 'Actualizando...' : 'Guardando...' }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { min-height: 60vh; background: #f5f7fa; }
    .dashboard-header { box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
    .title { display: flex; align-items: center; font-size: 1.15rem; font-weight: 600; }
    .title-icon { margin-right: 8px; }
    .spacer { flex: 1; }
    .main-content { padding: 32px 24px; display: flex; justify-content: center; }
    .form-card { width: 100%; max-width: 640px; border-radius: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.12); }
    .btn-volver { color: #fff; font-weight: 500; border-radius: 8px; padding: 0.55rem 1.1rem; margin-left: 12px; display: flex; align-items: center; gap:4px; box-shadow: 0 3px 6px rgba(0,0,0,.18); }
    .btn-volver:hover { background: #1565c0; }
    .form-wrapper { display: flex; flex-direction: column; gap: 18px; }
    mat-form-field { width: 100%; }
    .actions { display: flex; justify-content: flex-end; margin-top: 4px; }
    .loading-state { display: flex; flex-direction: column; align-items: center; margin-top: 16px; gap: 10px; }
    .loading-state p { margin: 0; font-size: 0.9rem; color: #555; }
  `]
})
export class LineaFormComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  isEdit = false;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private lineaService: LineaService,
    private snack: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;
    if (this.isEdit && this.id) {
      
      this.lineaService.getLinea(this.id).subscribe({
        next: (l) => {
          this.form.patchValue({ nombre: (l as any)?.nombre || '', descripcion: (l as any)?.descripcion || '' });
        },
        error: (err) => {
          this.snack.open(err?.error?.detail || err?.message || 'Error al cargar línea', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/transportes/lineas']);
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSaving = true;
    const payload = { ...this.form.value };
    if (this.isEdit && this.id) {
      this.lineaService.actualizarLinea(this.id, payload).subscribe({
        next: () => {
          this.snack.open('Línea actualizada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/transportes/lineas']);
        },
        error: (err) => {
          this.snack.open(err?.error?.detail || err?.message || 'Error desconocido', 'Cerrar', { duration: 5000 });
          this.isSaving = false;
        }
      });
    } else {
      this.lineaService.crearLinea(payload).subscribe({
        next: () => {
          this.snack.open('Línea creada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/transportes/lineas']);
        },
        error: (err) => {
          this.snack.open(err?.error?.detail || err?.message || 'Error desconocido', 'Cerrar', { duration: 5000 });
          this.isSaving = false;
        }
      });
    }
  }
}
