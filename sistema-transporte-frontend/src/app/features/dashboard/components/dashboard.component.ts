import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../usuarios/services/usuario.service';
import { TarjetaService } from '../../tarjetas/services/tarjeta.service';
import { TransporteService } from '../../transportes/services/transporte.service';
import { Usuario } from '../../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatGridListModule,
    MatDividerModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
          <mat-icon class="title-icon">directions_bus</mat-icon>
          Sistema Transporte Público
        </span>
        <div class="spacer"></div>
        <div class="user-info">
          <span class="welcome-text">Bienvenido, {{ currentUser?.nombre || 'Usuario' }}</span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="viewProfile()">
              <mat-icon>person</mat-icon>
              <span>Mi Perfil</span>
            </button>
            <button mat-menu-item (click)="settings()">
              <mat-icon>settings</mat-icon>
              <span>Configuración</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Stats Cards -->
        <div class="stats-section">
          <h2 class="section-title">Resumen General</h2>
          <mat-grid-list cols="4" rowHeight="160px" gutterSize="16px" class="stats-grid">
            
            <!-- Usuarios Card -->
            <mat-grid-tile>
              <mat-card class="stat-card usuarios-card">
                <mat-card-content class="stat-content">
                  <div class="stat-icon">
                    <mat-icon>people</mat-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-number">{{ stats.usuarios | number }}</h3>
                    <p class="stat-label">Usuarios</p>
                    <small class="stat-description">Total registrados</small>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>

            <!-- Tarjetas Card -->
            <mat-grid-tile>
              <mat-card class="stat-card tarjetas-card">
                <mat-card-content class="stat-content">
                  <div class="stat-icon">
                    <mat-icon>credit_card</mat-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-number">{{ stats.tarjetas | number }}</h3>
                    <p class="stat-label">Tarjetas</p>
                    <small class="stat-description">Activas en sistema</small>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>

            <!-- Transportes Card -->
            <mat-grid-tile>
              <mat-card class="stat-card transportes-card">
                <mat-card-content class="stat-content">
                  <div class="stat-icon">
                    <mat-icon>directions_bus</mat-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-number">{{ stats.transportes | number }}</h3>
                    <p class="stat-label">Transportes</p>
                    <small class="stat-description">En operación</small>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>

            <!-- Transacciones Card -->
            <mat-grid-tile>
              <mat-card class="stat-card transacciones-card">
                <mat-card-content class="stat-content">
                  <div class="stat-icon">
                    <mat-icon>payment</mat-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-number">{{ stats.transaccionesHoy | number }}</h3>
                    <p class="stat-label">Transacciones</p>
                    <small class="stat-description">Hoy</small>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>

          </mat-grid-list>
        </div>

        <!-- Modules Grid -->
        <div class="modules-section">
          <h2 class="section-title">Módulos del Sistema</h2>
          <mat-grid-list cols="3" rowHeight="200px" gutterSize="16px" class="modules-grid">
            
            <!-- Gestión de Usuarios -->
            <mat-grid-tile>
              <mat-card class="module-card" (click)="navigateTo('/usuarios')">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="module-icon users-icon">people</mat-icon>
                  <mat-card-title>Gestión de Usuarios</mat-card-title>
                  <mat-card-subtitle>Administrar usuarios del sistema</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>Crear, editar y gestionar usuarios. Control de roles y permisos.</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>arrow_forward</mat-icon>
                    Acceder
                  </button>
                </mat-card-actions>
              </mat-card>
            </mat-grid-tile>

            <!-- Gestión de Tarjetas -->
            <mat-grid-tile>
              <mat-card class="module-card" (click)="navigateTo('/tarjetas')">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="module-icon cards-icon">credit_card</mat-icon>
                  <mat-card-title>Gestión de Tarjetas</mat-card-title>
                  <mat-card-subtitle>Control de tarjetas de transporte</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>Emisión, recarga y bloqueo de tarjetas. Historial de transacciones.</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>arrow_forward</mat-icon>
                    Acceder
                  </button>
                </mat-card-actions>
              </mat-card>
            </mat-grid-tile>

            <!-- Flota de Transportes -->
            <mat-grid-tile>
              <mat-card class="module-card" (click)="navigateTo('/transportes')">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="module-icon transport-icon">directions_bus</mat-icon>
                  <mat-card-title>Flota de Transportes</mat-card-title>
                  <mat-card-subtitle>Gestión de vehículos</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>Control de la flota, mantenimientos y asignación de conductores.</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>arrow_forward</mat-icon>
                    Acceder
                  </button>
                </mat-card-actions>
              </mat-card>
            </mat-grid-tile>

            <!-- Empleados -->
            <mat-grid-tile>
              <mat-card class="module-card" (click)="navigateTo('/empleados')">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="module-icon employees-icon">business_center</mat-icon>
                  <mat-card-title>Empleados</mat-card-title>
                  <mat-card-subtitle>Administración de personal</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>Gestión de conductores, supervisores y personal administrativo.</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>arrow_forward</mat-icon>
                    Acceder
                  </button>
                </mat-card-actions>
              </mat-card>
            </mat-grid-tile>

            <!-- Transacciones -->
            <mat-grid-tile>
              <mat-card class="module-card" (click)="navigateTo('/transacciones')">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="module-icon transactions-icon">receipt</mat-icon>
                  <mat-card-title>Transacciones</mat-card-title>
                  <mat-card-subtitle>Historial y reportes</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>Consulta de transacciones, recargas y movimientos financieros.</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>arrow_forward</mat-icon>
                    Acceder
                  </button>
                </mat-card-actions>
              </mat-card>
            </mat-grid-tile>

            <!-- Reportes -->
            <mat-grid-tile>
              <mat-card class="module-card" (click)="navigateTo('/reportes')">
                <mat-card-header>
                  <mat-icon mat-card-avatar class="module-icon reports-icon">assessment</mat-icon>
                  <mat-card-title>Reportes</mat-card-title>
                  <mat-card-subtitle>Estadísticas y análisis</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>Reportes detallados, gráficos y análisis de datos del sistema.</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>arrow_forward</mat-icon>
                    Acceder
                  </button>
                </mat-card-actions>
              </mat-card>
            </mat-grid-tile>

          </mat-grid-list>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .dashboard-header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .title {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .title-icon {
      margin-right: 8px;
    }

    .spacer {
      flex: 1;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .welcome-text {
      font-size: 0.9rem;
    }

    .main-content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      margin: 0 0 16px 0;
      color: #333;
      font-weight: 500;
    }

    .stats-section {
      margin-bottom: 32px;
    }

    .stats-grid {
      margin-bottom: 16px;
    }

    .stat-card {
      height: 100%;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 16px;
    }

    .stat-icon {
      margin-right: 16px;
    }

    .stat-icon mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .usuarios-card .stat-icon mat-icon { color: #4CAF50; }
    .tarjetas-card .stat-icon mat-icon { color: #2196F3; }
    .transportes-card .stat-icon mat-icon { color: #FF9800; }
    .transacciones-card .stat-icon mat-icon { color: #9C27B0; }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .stat-label {
      font-size: 1rem;
      font-weight: 500;
      margin: 4px 0;
      color: #666;
    }

    .stat-description {
      color: #999;
      font-size: 0.8rem;
    }

    .modules-section {
      margin-top: 32px;
    }

    .modules-grid {
      gap: 16px;
    }

    .module-card {
      height: 100%;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .module-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .module-icon {
      font-size: 2rem !important;
      width: 2rem !important;
      height: 2rem !important;
    }

    .users-icon { background-color: #4CAF50 !important; color: white !important; }
    .cards-icon { background-color: #2196F3 !important; color: white !important; }
    .transport-icon { background-color: #FF9800 !important; color: white !important; }
    .employees-icon { background-color: #607D8B !important; color: white !important; }
    .transactions-icon { background-color: #9C27B0 !important; color: white !important; }
    .reports-icon { background-color: #795548 !important; color: white !important; }

    mat-card-content {
      flex: 1;
      padding: 8px 16px !important;
    }

    mat-card-content p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      margin: 0;
    }

    mat-card-actions {
      padding: 8px 16px !important;
      margin: 0 !important;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      
      .modules-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr !important;
      }
      
      .modules-grid {
        grid-template-columns: 1fr !important;
      }

      .welcome-text {
        display: none;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: Usuario | null = null;
  stats = {
    usuarios: 0,
    tarjetas: 0,
    transportes: 0,
    transaccionesHoy: 0
  };

  isLoading = true;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private tarjetaService: TarjetaService,
    private transporteService: TransporteService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Usar el nuevo endpoint de estadísticas del dashboard
    this.http.get<any>('http://127.0.0.1:8000/api/dashboard/estadisticas').subscribe({
      next: (data: any) => {
        this.stats = {
          usuarios: data.usuarios?.total || 0,
          tarjetas: data.tarjetas?.total || 0,
          transportes: data.transportes?.total || 0,
          transaccionesHoy: data.tarjetas?.transaccionesHoy || 0
        };
        this.isLoading = false;
        console.log('Datos del dashboard cargados:', this.stats);
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
        // Usar datos de ejemplo en caso de error
        this.stats = {
          usuarios: 0,
          tarjetas: 0,
          transportes: 0,
          transaccionesHoy: 0
        };
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  viewProfile(): void {
    this.router.navigate(['/profile']);
  }

  settings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}