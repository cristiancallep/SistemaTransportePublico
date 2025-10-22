import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container text-center mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="display-1 text-warning">404</h1>
          <h2>Página No Encontrada</h2>
          <p class="lead">La página que estás buscando no existe.</p>
          <div class="mt-4">
            <button class="btn btn-primary me-2" routerLink="/dashboard">
              Ir al Dashboard
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
export class NotFoundComponent {}