import { Routes } from '@angular/router';
import { Component } from '@angular/core';

// Componente temporal simple
@Component({
  selector: 'app-usuarios-placeholder',
  standalone: true,
  template: `
    <div class="container">
      <h2>Gestión de Usuarios</h2>
      <p>Módulo en desarrollo...</p>
      <div class="mt-4">
        <button class="btn btn-primary me-2">Crear Usuario</button>
        <button class="btn btn-secondary">Ver Lista</button>
      </div>
    </div>
  `
})
export class UsuariosPlaceholderComponent {}

export const usuarioRoutes: Routes = [
  {
    path: '',
    component: UsuariosPlaceholderComponent
  }
];

export default usuarioRoutes;