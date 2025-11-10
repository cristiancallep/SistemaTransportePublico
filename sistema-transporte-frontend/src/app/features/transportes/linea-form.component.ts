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
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">route</mat-icon>
          Crear Línea
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
                <label>Nombre</label>
                <input class="input" placeholder="Línea 1" formControlName="nombre" />
                <div class="error" *ngIf="form.get('nombre')?.invalid && form.get('nombre')?.touched">Nombre requerido</div>
              </div>

              <div class="form-row">
                <label>Descripción</label>
                <textarea class="input" rows="3" placeholder="Descripción opcional" formControlName="descripcion"></textarea>
              </div>

              <div class="actions">
                <button mat-raised-button color="accent" [disabled]="form.invalid || isSaving">
                  <mat-icon>save</mat-icon>
                  Crear Línea
                </button>
              </div>
            </form>
            <div class="loading-state" *ngIf="isSaving">
              <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
              <p>Guardando...</p>
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

    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .form-row { display: flex; flex-direction: column; gap: 6px; }
    .input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit; }
    textarea.input { resize: vertical; }
    .error { color: #d32f2f; font-size: .82rem; }
    .actions { margin-top: 8px; }
    .loading-state { display: flex; flex-direction: column; align-items: center; margin-top: 12px; gap: 8px; }
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
      // Podríamos cargar la línea, pero solo necesitamos valores iniciales si los tuviéramos
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
