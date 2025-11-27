import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Recuperar Contraseña</h2>
    <div mat-dialog-content>
      <p class="dialog-description">
        Ingresa tu email y nueva contraseña. Se actualizará inmediatamente tu contraseña en el sistema.
      </p>
      
      <form [formGroup]="forgotPasswordForm" class="forgot-password-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Correo Electrónico</mat-label>
          <input 
            matInput 
            type="email" 
            formControlName="email"
            placeholder="usuario@ejemplo.com"
            [class.is-invalid]="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched">
          <mat-icon matSuffix>email</mat-icon>
          <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
            El correo electrónico es requerido
          </mat-error>
          <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
            Ingresa un correo electrónico válido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nueva Contraseña</mat-label>
          <input 
            matInput 
            [type]="hideNewPassword ? 'password' : 'text'" 
            formControlName="newPassword"
            placeholder="Nueva contraseña"
            [class.is-invalid]="forgotPasswordForm.get('newPassword')?.invalid && forgotPasswordForm.get('newPassword')?.touched">
          <button 
            mat-icon-button 
            matSuffix 
            type="button"
            (click)="hideNewPassword = !hideNewPassword"
            [attr.aria-label]="'Hide password'" 
            [attr.aria-pressed]="hideNewPassword">
            <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="forgotPasswordForm.get('newPassword')?.hasError('required')">
            La nueva contraseña es requerida
          </mat-error>
          <mat-error *ngIf="forgotPasswordForm.get('newPassword')?.hasError('minlength')">
            La contraseña debe tener al menos 6 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirmar Nueva Contraseña</mat-label>
          <input 
            matInput 
            [type]="hideConfirmPassword ? 'password' : 'text'" 
            formControlName="confirmPassword"
            placeholder="Confirma la nueva contraseña"
            [class.is-invalid]="forgotPasswordForm.get('confirmPassword')?.invalid && forgotPasswordForm.get('confirmPassword')?.touched">
          <button 
            mat-icon-button 
            matSuffix 
            type="button"
            (click)="hideConfirmPassword = !hideConfirmPassword"
            [attr.aria-label]="'Hide password'" 
            [attr.aria-pressed]="hideConfirmPassword">
            <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="forgotPasswordForm.get('confirmPassword')?.hasError('required')">
            Confirma tu nueva contraseña
          </mat-error>
          <mat-error *ngIf="forgotPasswordForm.get('confirmPassword')?.hasError('passwordMismatch')">
            Las contraseñas no coinciden
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    
    <div mat-dialog-actions class="dialog-actions">
      <button 
        mat-button 
        (click)="onCancel()" 
        [disabled]="isLoading">
        Cancelar
      </button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onResetPassword()" 
        [disabled]="forgotPasswordForm.invalid || isLoading">
        <mat-spinner *ngIf="isLoading" diameter="16" class="spinner"></mat-spinner>
        <span *ngIf="!isLoading">Cambiar Contraseña</span>
        <span *ngIf="isLoading">Cambiando...</span>
      </button>
    </div>
  `,
  styles: [`
    .dialog-description {
      margin-bottom: 20px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
    }

    .forgot-password-form {
      width: 100%;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .dialog-actions {
      justify-content: flex-end;
      padding-top: 16px;
      gap: 8px;
    }

    .spinner {
      margin-right: 8px;
    }

    .is-invalid {
      border-color: #f44336 !important;
    }

    mat-dialog-content {
      max-height: 60vh;
      overflow: auto;
    }
  `]
})
export class ForgotPasswordModalComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ForgotPasswordModalComponent>,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  onResetPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    
    const email = this.forgotPasswordForm.get('email')?.value;
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.forgotPasswordForm.get('confirmPassword')?.value;

    this.authService.resetPassword(email, newPassword, confirmPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccess('Contraseña actualizada exitosamente');
        
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cambiar contraseña:', error);
        
        let errorMessage = 'Error al cambiar la contraseña. Inténtalo de nuevo.';
        
        if (error.error?.detail) {
          errorMessage = error.error.detail;
        } else if (error.status === 404) {
          errorMessage = 'Usuario no encontrado. Verifica el email.';
        } else if (error.status === 400) {
          errorMessage = 'Datos inválidos. Verifica la información ingresada.';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        }
        
        this.showError(errorMessage);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}