import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ListaTarjetasComponent } from './components/lista-tarjetas.component';
import { EmitirTarjetaComponent } from './components/emitir-tarjeta.component';
import { RecargarTarjetaComponent } from './components/recargar-tarjeta.component';

@Component({
  selector: 'app-tarjetas-menu',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">credit_card</mat-icon>
          Gestión de Tarjetas
        </span>
        <div class="spacer"></div>
      </mat-toolbar>

      <div class="main-content">
        <div class="cards-container">
          <mat-card class="action-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon class="card-icon">add_card</mat-icon>
                Emitir Tarjeta
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Crear una nueva tarjeta para un usuario del sistema</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-flat-button color="primary" [routerLink]="['emitir']">
                <mat-icon>add</mat-icon>
                Emitir Tarjeta
              </button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="action-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon class="card-icon">payments</mat-icon>
                Recargar Tarjeta
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Agregar saldo a una tarjeta existente del sistema</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-flat-button color="accent" [routerLink]="['recargar']">
                <mat-icon>add_circle</mat-icon>
                Recargar
              </button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="action-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon class="card-icon">list_alt</mat-icon>
                Lista de Tarjetas
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Ver y gestionar todas las tarjetas registradas</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-flat-button color="primary" [routerLink]="['lista']">
                <mat-icon>visibility</mat-icon>
                Ver Lista
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 60vh;
      background-color: #f5f5f5;
    }
    .dashboard-header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .title {
      display: flex;
      align-items: center;
      font-size: 1.1rem;
    }
    .title-icon {
      margin-right: 8px;
    }
    .spacer {
      flex: 1;
    }
    .main-content {
      padding: 24px;
    }
    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      padding: 16px;
    }
    .action-card {
      height: 100%;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .card-icon {
      font-size: 28px;
      margin-right: 8px;
      vertical-align: middle;
    }
    mat-card-header {
      margin-bottom: 16px;
    }
    mat-card-content {
      margin-bottom: 24px;
    }
    mat-card-actions {
      padding: 16px;
      display: flex;
      justify-content: center;
    }
    .btn-volver {
      color: #42a5f5;
      font-weight: 500;
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      margin-right: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
    .btn-volver:hover {
      background: #a8ccebff;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }
    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class TarjetasMenuComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

export const tarjetaRoutes: Routes = [
  {
    path: '',
    component: TarjetasMenuComponent
  },
  {
    path: 'lista',
    component: ListaTarjetasComponent
  },
  {
    path: 'emitir',
    component: EmitirTarjetaComponent
  },
  {
    path: 'recargar',
    component: RecargarTarjetaComponent
  }
];

export default tarjetaRoutes;