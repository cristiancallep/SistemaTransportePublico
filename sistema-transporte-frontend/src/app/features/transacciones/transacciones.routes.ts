import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-transacciones-placeholder',
  standalone: true,
  template: `
    <div class="container">
      <h2>Transacciones</h2>
      <p>Módulo en desarrollo...</p>
      <div class="mt-4">
        <button class="btn btn-info me-2">Ver Historial</button>
        <button class="btn btn-success me-2">Procesar Pago</button>
        <button class="btn btn-secondary">Reportes</button>
      </div>
    </div>
  `
})
export class TransaccionesPlaceholderComponent {}

export const transaccionRoutes: Routes = [
  {
    path: '',
    component: TransaccionesPlaceholderComponent
  }
];

export default transaccionRoutes;