import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styles: [
    `
    :host { display:block }
    .container { max-width: 720px; margin: 2rem auto; }
    .form-card { padding: 1rem; border-radius: .5rem; background: var(--bs-white,#fff); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    h2 { margin-bottom: 1rem; }
    .section { margin-top: 1rem; }
    .small-note { font-size: .9rem; color: #6c757d; }

    /* Form input styles */
    .form-control {
      padding: .5rem .75rem;
      border: 1px solid #e2e8f0;
      border-radius: .375rem;
      transition: box-shadow .12s ease, border-color .12s ease;
      background: #fff;
      margin: 8px;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--bs-primary, #0d6efd);
      box-shadow: 0 0 0 0.12rem rgba(13,110,253,0.12);
    }

    /* Button styles */
    .btn{margin:5px; cursor:pointer;}
    .btn-custom { padding: .45rem 1rem; border-radius: .375rem; font-weight:600; }
    .btn-custom.primary { background: var(--bs-primary,#0d6efd); color: #fff; border: none; }
    .btn-custom.secondary { background: #6c757d; color: #fff; border: none; }
    .btn-custom.warning { background: #ffc107; color: #212529; border: none; }
    .btn-custom.outline { background: transparent; border: 1px solid #ced4da; color: inherit; }
    `
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2 class="title">Configuración / Editar Perfil</h2>

      </div>

      <div class="form-card">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div *ngIf="updateSuccess" class="alert alert-success">Perfil actualizado correctamente.</div>

          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input class="form-control" formControlName="nombre" />
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input class="form-control" formControlName="email" />
          </div>

          <!-- Agrega aquí más campos editables según la entidad Usuario -->

          <div class="mt-4">
            <button class="btn btn-custom primary me-2" [disabled]="profileForm.invalid || isLoading" type="submit">
              {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button class="btn btn-custom secondary me-2" type="button" (click)="resetForm()">Restablecer</button>
          </div>
        </form>
      </div>

      <div class="form-card section">
        <h3>Cambiar contraseña</h3>
        <p class="small-note">Ingrese la nueva contraseña y confírmela.</p>
        <form [formGroup]="changePasswordForm" (ngSubmit)="changePassword()">
          <div *ngIf="pwSuccess" class="alert alert-success">Contraseña cambiada correctamente.</div>

          <div class="mb-3">
            <label class="form-label">Nueva contraseña</label>
            <input type="password" class="form-control" formControlName="newPassword" />
          </div>

          <div class="mb-3">
            <label class="form-label">Confirmar nueva contraseña</label>
            <input type="password" class="form-control" formControlName="confirmPassword" />
          </div>

          <div class="mt-3">
            <button class="btn btn-custom warning me-2" [disabled]="changePasswordForm.invalid || pwLoading" type="submit">
              {{ pwLoading ? 'Cambiando...' : 'Cambiar contraseña' }}
            </button>
            <button class="btn btn-custom secondary" type="button" (click)="resetPasswordForm()">Limpiar</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  profileForm: any;

  changePasswordForm: any;

  isLoading = false;
  pwLoading = false;
  updateSuccess = false;
  pwSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar formulario aquí (fb ya inyectado)
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue({
        nombre: (user as any).nombre || (user as any).nombre_completo || '',
        email: user.email || ''
      });
    } else {
      // si no está en memoria, intentar obtener desde el observable
      this.authService.currentUser$.subscribe(u => {
        if (u) {
          this.profileForm.patchValue({
            nombre: (u as any).nombre || (u as any).nombre_completo || '',
            email: u.email || ''
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

  this.isLoading = true;
  const payload = this.profileForm.value as Partial<any>;

  this.authService.updateProfile(payload as any).subscribe({
      next: (user) => {
        this.isLoading = false;
        // Ya actualizamos el currentUser en el servicio; mostrar confirmación y actualizar el formulario
        this.updateSuccess = true;
        try {
          this.profileForm.patchValue({
            nombre: (user as any).nombre || (user as any).nombre_completo || '',
            email: user.email || ''
          });
        } catch {}
        setTimeout(() => this.updateSuccess = false, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error actualizando perfil:', err);
        window.alert('Error al actualizar perfil. Intente nuevamente.');
      }
    });
  }

  changePassword(): void {
    if (this.changePasswordForm.invalid) return;

    const { newPassword, confirmPassword } = this.changePasswordForm.value;
    if (newPassword !== confirmPassword) {
      window.alert('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    // Obtener email del usuario actualmente en sesión o del formulario de perfil
    const current = this.authService.getCurrentUser();
    const email = (current as any)?.email || this.profileForm.value.email;
    if (!email) {
      window.alert('No se pudo determinar el email del usuario para cambiar la contraseña.');
      return;
    }

    this.pwLoading = true;
    this.authService.changePassword(email, newPassword, confirmPassword).subscribe({
      next: () => {
        this.pwLoading = false;
        this.pwSuccess = true;
        this.changePasswordForm.reset();
        setTimeout(() => this.pwSuccess = false, 3000);
      },
      error: (err) => {
        this.pwLoading = false;
        console.error('Error cambiando contraseña:', err);
        window.alert('Error al cambiar la contraseña. Intente nuevamente.');
      }
    });
  }

  resetForm(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue({
        nombre: (user as any).nombre || (user as any).nombre_completo || '',
        email: user.email || ''
      });
    }
  }

  resetPasswordForm(): void {
    this.changePasswordForm.reset();
  }

  goToMenu(): void {
    this.router.navigate(['/dashboard']);
  }
}