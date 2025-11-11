import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [
    `
    :host { display: block; }
    .profile-container { max-width: 720px; margin: 2rem auto; }
    .profile-card { padding: 1rem; border-radius: .5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); background: var(--bs-white, #fff); }
    h2 { margin-bottom: 1rem; font-weight: 600; color: var(--bs-body-color, #222); }
    .profile-field { margin-bottom: .5rem; color: var(--bs-body-color, #5d4c4cff); }
    .profile-actions { margin-top: 1rem; }

    /* Avatar */
    .profile-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .avatar {font-size: 16px; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg,#6c757d22,#0d6efd22); display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff }
    .mb-0 { font-size: 18px; }
    /* Custom button to match app look but allow overrides */
    .btn-custom { padding: .45rem 1rem; font-size: .95rem; border-radius: .375rem; box-shadow: none; }
    .btn-custom.primary { background: var(--bs-primary, #0d6efd); color: #fff; border: 1px solid rgba(0,0,0,0.05); }
    .btn-custom.primary:hover { filter: brightness(.95); }
    .text-muted { font-size: 14px; }

    .btn_volver { margin-left: 20px; cursor: pointer; }
    .tex_rol{font-size: 14px;}

    /* Small responsive tweak */
    @media (max-width: 576px) {
      .profile-container { margin: 1rem; }
      .profile-top { flex-direction: row; gap: .75rem; }
    }
    `
  ],
  template: `
    <div class="container profile-container">
      <h2>Mi Perfil</h2>

      <ng-container *ngIf="authService.currentUser$ | async as user; else noUser">
        <div class="card profile-card p-3 mb-3">
          <div class="profile-top">
            <div class="avatar">{{ (user.nombre || user.email || '?') | slice:0:1 | uppercase }}</div>
            <div>
              <p class="mb-0"><strong>{{ user.nombre || '-' }}</strong></p>
              <small class="text-muted">{{ user.email }}</small>
            </div>
          </div>

          <p class="profile-field tex_rol"><strong>Rol:</strong> <span *ngIf="user.rol">{{ user.rol.nombre }}</span><span *ngIf="!user.rol">-</span></p>
          <!-- Añade más campos de usuario según tu entidad Usuario -->
        </div>

        <div class="mt-3 profile-actions">
          <!-- Convertimos a botón con navegación programática y clase personalizada -->
          <button class="btn btn-primary btn-custom me-2 primary" (click)="navigateToSettings()">Editar Perfil</button>
          <button class="btn btn-secondary btn-custom btn_volver" (click)="navigateToMenu()">Volver al menú</button>
        </div>
      </ng-container>

      <ng-template #noUser>
        <p>No hay usuario autenticado.</p>
        <a class="btn btn-primary" [routerLink]="['/login']">Iniciar sesión</a>
      </ng-template>
    </div>
  `
})
export class ProfileComponent {
  constructor(public authService: AuthService, private router: Router) {}

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  navigateToMenu(): void {
    this.router.navigate(['/dashboard']);
  }
}