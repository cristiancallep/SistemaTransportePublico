import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-transportes-placeholder',
  standalone: true,
  template: `
    <div class="container">
      <h2>Gestión de Transportes</h2>
      <p>Módulo en desarrollo...</p>
      <div class="mt-4">
        <button class="btn btn-primary me-2">Agregar Transporte</button>
        <button class="btn btn-warning me-2">Mantenimiento</button>
        <button class="btn btn-secondary">Ver Flota</button>
      </div>
    </div>
  `
})
export class TransportesPlaceholderComponent {}

export const transporteRoutes: Routes = [
  {
    path: '',
    component: TransportesPlaceholderComponent
  }
];

export default transporteRoutes;