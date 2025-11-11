import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TarjetaService } from '../services/tarjeta.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recargar-tarjeta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">add_circle</mat-icon>
          Recargar Tarjeta
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" [routerLink]="['/tarjetas']">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <form [formGroup]="recargaForm" (ngSubmit)="onSubmit()" class="form-container">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Documento del Usuario</mat-label>
                <input
                  matInput
                  type="text"
                  formControlName="documento"
                  placeholder="Ingrese el documento"
                  required
                >
                <mat-icon matPrefix>badge</mat-icon>
                <mat-error *ngIf="recargaForm.get('documento')?.hasError('required')">
                  El documento es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Monto a Recargar</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="saldo"
                  placeholder="Ingrese el monto"
                  min="0.01"
                  step="0.01"
                  required
                >
                <mat-icon matPrefix>attach_money</mat-icon>
                <mat-error *ngIf="recargaForm.get('saldo')?.hasError('required')">
                  El monto es requerido
                </mat-error>
                <mat-error *ngIf="recargaForm.get('saldo')?.hasError('min')">
                  El monto debe ser mayor a 0
                </mat-error>
              </mat-form-field>

              <div class="actions">
                <button
                  mat-raised-button
                  color="accent"
                  type="submit"
                  [disabled]="!recargaForm.valid || isLoading">
                  <mat-icon>save</mat-icon>
                  {{ isLoading ? 'Recargando...' : 'Confirmar Recarga' }}
                </button>
              </div>
            </form>
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
      margin: 0 auto;
      max-width: 600px;
    }
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .full-width {
      width: 100%;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
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
    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class RecargarTarjetaComponent {
  recargaForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tarjetaService: TarjetaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.recargaForm = this.fb.group({
      documento: ['', [Validators.required]],
      saldo: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit() {
    if (this.recargaForm.valid) {
      this.isLoading = true;
      const { documento, saldo } = this.recargaForm.value;

      this.tarjetaService.recargarTarjeta(documento, saldo).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.snackBar.open('Recarga realizada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/tarjetas']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error al recargar tarjeta:', error);
          this.snackBar.open(
            error.error?.detail || 'Error al realizar la recarga',
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
}