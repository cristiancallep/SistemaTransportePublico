import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tarjetas-placeholder',
  standalone: true,
  template: `
    <div class="container">
      <h2>Gestión de Tarjetas</h2>
      <p>Módulo en desarrollo...</p>
      <div class="mt-4">
        <button class="btn btn-primary me-2">Emitir Tarjeta</button>
        <button class="btn btn-success me-2">Recargar</button>
        <button class="btn btn-secondary">Ver Lista</button>
      </div>
    </div>
  `
})
export class TarjetasPlaceholderComponent {}

export const tarjetaRoutes: Routes = [
  {
    path: '',
    component: TarjetasPlaceholderComponent
  }
];

export default tarjetaRoutes;