import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-empleados-placeholder',
  standalone: true,
  template: `
    <div class="container">
      <h2>Gestión de Empleados</h2>
      <p>Módulo en desarrollo...</p>
      <div class="mt-4">
        <button class="btn btn-primary me-2">Agregar Empleado</button>
        <button class="btn btn-info me-2">Asignaciones</button>
        <button class="btn btn-secondary">Ver Lista</button>
      </div>
    </div>
  `
})
export class EmpleadosPlaceholderComponent {}

export const empleadoRoutes: Routes = [
  {
    path: '',
    component: EmpleadosPlaceholderComponent
  }
];

export default empleadoRoutes;