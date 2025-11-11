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
import { MatSelectModule } from '@angular/material/select';
import { TarjetaService } from '../services/tarjeta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emitir-tarjeta',
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
    MatSelectModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">add_card</mat-icon>
          Emitir Nueva Tarjeta
        </span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" (click)="onCancel()">
          <mat-icon class="me-2">arrow_back</mat-icon>
          Volver
        </button>
      </mat-toolbar>

      <div class="main-content">
        <mat-card>
          <mat-card-content>
            <form [formGroup]="tarjetaForm" (ngSubmit)="onSubmit()" class="form-container">
              <mat-form-field appearance="outline">
                <mat-label>Documento del Usuario</mat-label>
                <input 
                  matInput 
                  formControlName="documento" 
                  required 
                  placeholder="Ingrese el documento del usuario"
                  type="text"
                  autocomplete="off"
                >
                <mat-icon matSuffix>badge</mat-icon>
                <mat-error *ngIf="tarjetaForm.get('documento')?.errors?.['required']">
                  El documento es requerido
                </mat-error>
              </mat-form-field>

              <div class="actions">
                <button 
                  mat-stroked-button 
                  color="warn" 
                  type="button" 
                  (click)="onCancel()"
                  [disabled]="isLoading">
                  <mat-icon>close</mat-icon>
                  Cancelar
                </button>
                <button 
                  mat-flat-button 
                  color="primary" 
                  type="submit"
                  [disabled]="!tarjetaForm.valid || isLoading">
                  <mat-icon>save</mat-icon>
                  {{ isLoading ? 'Emitiendo...' : 'Emitir Tarjeta' }}
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
export class EmitirTarjetaComponent {
  tarjetaForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tarjetaService: TarjetaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.tarjetaForm = this.fb.group({
      documento: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.tarjetaForm.valid) {
      this.isLoading = true;
      try {
        const documento = this.tarjetaForm.value.documento;
        
        // El documento será validado en el backend
        console.log('Procesando solicitud para documento:', documento);

        // Crear la tarjeta con los valores por defecto
        console.log('Creando tarjeta con:', {
          documento: documento,
          tipo_tarjeta: 'Frecuentes',
          estado: 'Activa',
          saldo: 0
        });
        
        await this.tarjetaService.crearTarjeta({
          documento: documento,
          tipo_tarjeta: 'Frecuente',
          estado: 'Activa',
          saldo: 0.0
        }).toPromise();

        this.snackBar.open('Tarjeta emitida exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        
        this.router.navigate(['/tarjetas']);
      } catch (error) {
        console.error('Error al emitir tarjeta:', error);
        this.snackBar.open('Error al emitir la tarjeta', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      } finally {
        this.isLoading = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/tarjetas']);
  }
}