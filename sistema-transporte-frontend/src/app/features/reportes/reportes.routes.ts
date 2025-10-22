import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes-placeholder',
  standalone: true,
  template: `
    <div class="container">
      <h2>Reportes y Estadísticas</h2>
      <p>Módulo en desarrollo...</p>
      <div class="mt-4">
        <button class="btn btn-primary me-2">Generar Reporte</button>
        <button class="btn btn-info me-2">Estadísticas</button>
        <button class="btn btn-secondary">Exportar</button>
      </div>
    </div>
  `
})
export class ReportesPlaceholderComponent {}

export const reporteRoutes: Routes = [
  {
    path: '',
    component: ReportesPlaceholderComponent
  }
];

export default reporteRoutes;