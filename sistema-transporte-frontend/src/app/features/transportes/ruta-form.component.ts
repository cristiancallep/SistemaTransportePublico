import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { RutaService } from './services/ruta.service';
import { LineaService } from './services/linea.service';

@Component({
  selector: 'app-ruta-form',
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  template: `
    <div class="form-container">
      <mat-toolbar color="primary" class="form-header">
        <span class="title">
          <mat-icon class="title-icon">add_road</mat-icon>
          Crear Ruta
        </span>
        <div class="spacer"></div>
      </mat-toolbar>

      <div class="form-content">
        <mat-card>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="guardar()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput placeholder="Ruta A" formControlName="nombre" />
                <mat-error *ngIf="form.get('nombre')?.hasError('required')">Nombre es requerido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Origen</mat-label>
                <input matInput placeholder="Origen" formControlName="origen" />
                <mat-error *ngIf="form.get('origen')?.hasError('required')">Origen es requerido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Destino</mat-label>
                <input matInput placeholder="Destino" formControlName="destino" />
                <mat-error *ngIf="form.get('destino')?.hasError('required')">Destino es requerido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Duración estimada (min)</mat-label>
                <input matInput type="number" placeholder="30" formControlName="duracion_estimada" />
                <mat-error *ngIf="form.get('duracion_estimada')?.hasError('required')">Duración es requerida</mat-error>
                <mat-error *ngIf="form.get('duracion_estimada')?.hasError('min')">Debe ser mayor a 0</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Línea</mat-label>
                <mat-select placeholder="Selecciona una línea" formControlName="id_linea">
                  <mat-option *ngFor="let ln of lineas" [value]="ln.id_linea || ln.id || ln.idLinea">
                    {{ ln.nombre || 'Sin nombre' }} — {{ (ln.id_linea || ln.id || ln.idLinea) }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('id_linea')?.hasError('required')">Línea es requerida</mat-error>
              </mat-form-field>

              <div class="actions">
                <button mat-raised-button color="primary" [disabled]="form.invalid || saving">
                  <mat-icon>save</mat-icon>
                  Crear Ruta
                </button>
              </div>

              <div class="loading-state" *ngIf="saving">
                <mat-progress-spinner diameter="30" mode="indeterminate"></mat-progress-spinner>
                <p>Guardando...</p>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .form-container { min-height: 60vh; background:#f5f5f5; }
    .form-header { box-shadow: 0 2px 4px rgba(0,0,0,.1); }
    .title { display:flex; align-items:center; font-size:1.1rem; }
    .title-icon { margin-right:8px; }
    .spacer { flex:1; }
    .form-content { padding:24px; display:flex; justify-content:center; }
    mat-card { width:100%; max-width:900px; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
    .actions { grid-column: 1 / -1; display:flex; gap:12px; }
    .btn-volver { color:#42a5f5; font-weight:500; border-radius:8px; padding:.6rem 1.2rem; margin-left:16px; display:flex; align-items:center; box-shadow:0 3px 6px rgba(0,0,0,.15); transition:.2s; }
    .btn-volver:hover { background:#a8ccebff; transform:translateY(-2px); box-shadow:0 4px 10px rgba(0,0,0,.25); }
    .loading-state { display:flex; align-items:center; gap:8px; }
  `]
})
export class RutaFormComponent implements OnInit {
  form!: FormGroup;
  lineas: any[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private rutaService: RutaService,
    private lineaService: LineaService,
    private snack: MatSnackBar,
    private router: Router,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      origen: ['', [Validators.required]],
      destino: ['', [Validators.required]],
      duracion_estimada: [30, [Validators.required, Validators.min(1)]],
      id_linea: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarLineas();
  }

  cargarLineas() {
    this.lineaService.getLineas().subscribe({
      next: (ls) => this.lineas = Array.isArray(ls) ? ls : (ls as any)?.data || [],
      error: (err) => this.snack.open(`Error cargando líneas: ${err?.error?.detail || err?.message || 'Error desconocido'}`, 'Cerrar', { duration: 4000 })
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.saving = true;
    const body = {
      nombre: this.form.value.nombre!,
      origen: this.form.value.origen!,
      destino: this.form.value.destino!,
      duracion_estimada: Number(this.form.value.duracion_estimada),
      id_linea: this.form.value.id_linea!,
    };
  this.rutaService.crearRuta(body).subscribe({
      next: () => {
        this.snack.open('Ruta creada', 'Cerrar', { duration: 3000 });
        this.saving = false;
        this.router.navigate(['/transportes/rutas']);
      },
      error: (err: any) => {
        this.snack.open(err?.error?.detail || err?.message || 'Error al crear ruta', 'Cerrar', { duration: 5000 });
        this.saving = false;
      }
    });
  }
}
