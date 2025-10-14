import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Mi Perfil</h2>
      <p>Información del usuario...</p>
      <div class="mt-4">
        <button class="btn btn-primary me-2">Editar Perfil</button>
        <button class="btn btn-warning">Cambiar Contraseña</button>
      </div>
    </div>
  `
})
export class ProfileComponent {}