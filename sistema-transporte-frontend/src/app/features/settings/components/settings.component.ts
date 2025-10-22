import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Configuración</h2>
      <p>Configuración del sistema...</p>
      <div class="mt-4">
        <button class="btn btn-primary me-2">Guardar Cambios</button>
        <button class="btn btn-secondary">Restablecer</button>
      </div>
    </div>
  `
})
export class SettingsComponent {}