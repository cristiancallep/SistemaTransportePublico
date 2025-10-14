import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container text-center mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="display-1 text-danger">403</h1>
          <h2>Acceso No Autorizado</h2>
          <p class="lead">No tienes permisos para acceder a esta página.</p>
          <div class="mt-4">
            <button class="btn btn-primary me-2" routerLink="/dashboard">
              Volver al Dashboard
            </button>
            <button class="btn btn-secondary" onclick="history.back()">
              Volver Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}