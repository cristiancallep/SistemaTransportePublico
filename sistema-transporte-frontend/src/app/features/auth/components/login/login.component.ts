import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../shared/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card-container">
        <mat-card class="login-card">
          <mat-card-header>
            <div class="header-content">
              <div class="logo">
                <mat-icon class="logo-icon">directions_bus</mat-icon>
              </div>
              <mat-card-title>Sistema Transporte Público</mat-card-title>
              <mat-card-subtitle>Iniciar Sesión</mat-card-subtitle>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Correo Electrónico</mat-label>
                <input 
                  matInput 
                  type="email" 
                  formControlName="email"
                  placeholder="usuario@ejemplo.com"
                  [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  El correo electrónico es requerido
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  Ingresa un correo electrónico válido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contraseña</mat-label>
                <input 
                  matInput 
                  [type]="hidePassword ? 'password' : 'text'" 
                  formControlName="password"
                  placeholder="Tu contraseña"
                  [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <button 
                  mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'" 
                  [attr.aria-pressed]="hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                  La contraseña debe tener al menos 6 caracteres
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button 
                  mat-raised-button 
                  color="primary" 
                  type="submit" 
                  [disabled]="loginForm.invalid || isLoading"
                  class="login-button">
                  <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
                  <span *ngIf="!isLoading">Iniciar Sesión</span>
                  <span *ngIf="isLoading">Iniciando...</span>
                </button>
              </div>

              <div class="form-links">
                <a href="#" class="forgot-password" (click)="forgotPassword($event)">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <div class="login-footer">
          <p>&copy; 2025 Sistema Transporte Público. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card-container {
      width: 100%;
      max-width: 400px;
    }

    .login-card {
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .header-content {
      text-align: center;
      width: 100%;
    }

    .logo {
      margin-bottom: 1rem;
    }

    .logo-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #667eea;
    }

    .login-form {
      margin-top: 1.5rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-actions {
      margin: 1.5rem 0;
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
    }

    .spinner {
      margin-right: 10px;
    }

    .form-links {
      text-align: center;
      margin-top: 1rem;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .login-footer {
      text-align: center;
      margin-top: 2rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.8rem;
    }

    .is-invalid {
      border-color: #f44336 !important;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 10px;
      }
      
      .login-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Obtener URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    
    const credentials: LoginRequest = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccess('¡Bienvenido! Inicio de sesión exitoso');
        
        // Redirigir después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          this.router.navigate([this.returnUrl]);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en login:', error);
        
        let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        }
        
        this.showError(errorMessage);
      }
    });
  }

  forgotPassword(event: Event): void {
    event.preventDefault();
    // TODO: Implementar recuperación de contraseña
    this.showInfo('Funcionalidad de recuperación de contraseña próximamente');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
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

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}