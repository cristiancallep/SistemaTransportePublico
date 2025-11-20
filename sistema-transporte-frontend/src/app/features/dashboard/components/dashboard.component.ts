import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
    MatDividerModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">¡Bienvenido, {{ currentUser?.nombre }}!</h1>
          <p class="welcome-subtitle">Panel de control del Sistema de Transporte Público</p>
        </div>
        <div class="current-date">
          <mat-icon>event</mat-icon>
          <span>{{ currentDate | date:'fullDate':'':'es' }}</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <div class="stats-grid">
          
          <!-- Usuarios Card -->
          <mat-card class="stat-card usuarios-card">
            <mat-card-content class="stat-content">
              <div class="stat-header">
                <div class="stat-icon-wrapper usuarios-icon-bg">
                  <mat-icon class="stat-icon">people</mat-icon>
                </div>
                <div class="stat-trend positive">
                  <mat-icon>trending_up</mat-icon>
                  <span>+12%</span>
                </div>
              </div>
              <div class="stat-info">
                <h3 class="stat-number">{{ stats.usuarios | number }}</h3>
                <p class="stat-label">Usuarios Registrados</p>
                <small class="stat-description">Total en el sistema</small>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Tarjetas Card -->
          <mat-card class="stat-card tarjetas-card">
            <mat-card-content class="stat-content">
              <div class="stat-header">
                <div class="stat-icon-wrapper tarjetas-icon-bg">
                  <mat-icon class="stat-icon">credit_card</mat-icon>
                </div>
                <div class="stat-trend positive">
                  <mat-icon>trending_up</mat-icon>
                  <span>+8%</span>
                </div>
              </div>
              <div class="stat-info">
                <h3 class="stat-number">{{ stats.tarjetas | number }}</h3>
                <p class="stat-label">Tarjetas Activas</p>
                <small class="stat-description">En circulación</small>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Transportes Card -->
          <mat-card class="stat-card transportes-card">
            <mat-card-content class="stat-content">
              <div class="stat-header">
                <div class="stat-icon-wrapper transportes-icon-bg">
                  <mat-icon class="stat-icon">directions_bus</mat-icon>
                </div>
                <div class="stat-trend positive">
                  <mat-icon>trending_up</mat-icon>
                  <span>+5%</span>
                </div>
              </div>
              <div class="stat-info">
                <h3 class="stat-number">{{ stats.transportes | number }}</h3>
                <p class="stat-label">Transportes</p>
                <small class="stat-description">En operación</small>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Transacciones Card -->
          <mat-card class="stat-card transacciones-card">
            <mat-card-content class="stat-content">
              <div class="stat-header">
                <div class="stat-icon-wrapper transacciones-icon-bg">
                  <mat-icon class="stat-icon">payments</mat-icon>
                </div>
                <div class="stat-trend positive">
                  <mat-icon>trending_up</mat-icon>
                  <span>+24%</span>
                </div>
              </div>
              <div class="stat-info">
                <h3 class="stat-number">{{ stats.transaccionesHoy | number }}</h3>
                <p class="stat-label">Transacciones Hoy</p>
                <small class="stat-description">Últimas 24 horas</small>
              </div>
            </mat-card-content>
          </mat-card>

        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Quick Stats -->
        <mat-card class="quick-stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="header-icon">analytics</mat-icon>
            <mat-card-title>Estadísticas del Sistema</mat-card-title>
            <mat-card-subtitle>Información general</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-stat-item">
              <div class="quick-stat-label">
                <mat-icon>route</mat-icon>
                <span>Rutas Registradas</span>
              </div>
              <div class="quick-stat-value">{{ stats.rutas }}</div>
            </div>
            <mat-divider></mat-divider>
            <div class="quick-stat-item">
              <div class="quick-stat-label">
                <mat-icon>people_outline</mat-icon>
                <span>Empleados Activos</span>
              </div>
              <div class="quick-stat-value">{{ stats.empleados }}</div>
            </div>
            <mat-divider></mat-divider>
            <div class="quick-stat-item">
              <div class="quick-stat-label">
                <mat-icon>location_on</mat-icon>
                <span>Paradas Disponibles</span>
              </div>
              <div class="quick-stat-value">{{ stats.paradas }}</div>
            </div>
            <mat-divider></mat-divider>
            <div class="quick-stat-item">
              <div class="quick-stat-label">
                <mat-icon>local_shipping</mat-icon>
                <span>Líneas Operativas</span>
              </div>
              <div class="quick-stat-value">{{ stats.lineas }}</div>
            </div>
          </mat-card-content>
        </mat-card>

          <!-- System Status -->
        <mat-card class="system-status-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="header-icon">info</mat-icon>
            <mat-card-title>Estado del Sistema</mat-card-title>
            <mat-card-subtitle>Monitoreo en tiempo real</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="status-list">
              <div class="status-item">
                <mat-icon [class]="'status-icon ' + (systemHealth.api?.status === 'operational' ? 'success' : systemHealth.api?.status === 'warning' ? 'warning' : 'error')">
                  {{ systemHealth.api?.status === 'operational' ? 'check_circle' : systemHealth.api?.status === 'warning' ? 'warning' : 'error' }}
                </mat-icon>
                <div class="status-details">
                  <p class="status-label">Servidor API</p>
                  <p [class]="'status-value ' + (systemHealth.api?.status === 'operational' ? 'success' : systemHealth.api?.status === 'warning' ? 'warning' : 'error')">
                    {{ systemHealth.api?.message || 'Verificando...' }}
                  </p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="status-item">
                <mat-icon [class]="'status-icon ' + (systemHealth.database?.status === 'operational' ? 'success' : systemHealth.database?.status === 'warning' ? 'warning' : 'error')">
                  {{ systemHealth.database?.status === 'operational' ? 'check_circle' : systemHealth.database?.status === 'warning' ? 'warning' : 'error' }}
                </mat-icon>
                <div class="status-details">
                  <p class="status-label">Base de Datos</p>
                  <p [class]="'status-value ' + (systemHealth.database?.status === 'operational' ? 'success' : systemHealth.database?.status === 'warning' ? 'warning' : 'error')">
                    {{ systemHealth.database?.message || 'Verificando...' }}
                  </p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="status-item">
                <mat-icon [class]="'status-icon ' + (systemHealth.services?.status === 'operational' ? 'success' : systemHealth.services?.status === 'warning' ? 'warning' : 'error')">
                  {{ systemHealth.services?.status === 'operational' ? 'check_circle' : systemHealth.services?.status === 'warning' ? 'warning' : 'error' }}
                </mat-icon>
                <div class="status-details">
                  <p class="status-label">Servicios</p>
                  <p [class]="'status-value ' + (systemHealth.services?.status === 'operational' ? 'success' : systemHealth.services?.status === 'warning' ? 'warning' : 'error')">
                    {{ systemHealth.services?.message || 'Verificando...' }}
                  </p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="status-item">
                <mat-icon [class]="'status-icon ' + (systemHealth.system?.status === 'operational' ? 'success' : systemHealth.system?.status === 'warning' ? 'warning' : 'error')">
                  {{ systemHealth.system?.status === 'operational' ? 'check_circle' : systemHealth.system?.status === 'warning' ? 'warning' : 'error' }}
                </mat-icon>
                <div class="status-details">
                  <p class="status-label">Sistema</p>
                  <p [class]="'status-value ' + (systemHealth.system?.status === 'operational' ? 'success' : systemHealth.system?.status === 'warning' ? 'warning' : 'error')">
                    {{ systemHealth.system?.message || 'Verificando...' }}
                  </p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      background-color: #f5f7fa;
      min-height: calc(100vh - 64px);
    }

    /* Welcome Section */
    .welcome-section {
      background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(30, 136, 229, 0.3);
    }

    .welcome-content {
      flex: 1;
    }

    .welcome-title {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    .welcome-subtitle {
      margin: 8px 0 0;
      font-size: 16px;
      opacity: 0.9;
    }

    .current-date {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      padding: 12px 20px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .current-date mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Stats Section */
    .stats-section {
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }

    .stat-card {
      cursor: default;
      transition: all 0.3s ease;
      border-radius: 16px;
      border: none;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-content {
      padding: 24px !important;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .stat-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .stat-card:hover .stat-icon-wrapper {
      transform: scale(1.1);
    }

    .stat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .usuarios-icon-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .tarjetas-icon-bg {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .transportes-icon-bg {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .transacciones-icon-bg {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
    }

    .stat-trend.positive {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .stat-trend mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .stat-info {
      text-align: left;
    }

    .stat-number {
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #1a1a1a;
      line-height: 1;
    }

    .stat-label {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #555;
    }

    .stat-description {
      font-size: 13px;
      color: #999;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    /* Quick Stats Card */
    .quick-stats-card {
      border-radius: 16px;
      border: none;
    }

    .quick-stats-card mat-card-header {
      padding: 24px 24px 0;
    }

    .quick-stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .quick-stat-label {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #555;
      font-weight: 500;
    }

    .quick-stat-label mat-icon {
      color: #1E88E5;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .quick-stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
    }

    mat-divider {
      margin: 0;
    }

    /* System Status Card */
    .system-status-card {
      border-radius: 16px;
      border: none;
    }

    .system-status-card mat-card-header {
      padding: 24px 24px 0;
    }

    .status-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
    }

    .status-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .status-icon.success {
      color: #2e7d32;
    }

    .status-icon.warning {
      color: #f57c00;
    }

    .status-icon.error {
      color: #d32f2f;
    }

    .status-details {
      flex: 1;
    }

    .status-label {
      margin: 0;
      font-size: 15px;
      color: #555;
      font-weight: 500;
    }

    .status-value {
      margin: 4px 0 0;
      font-size: 15px;
      font-weight: 600;
    }

    .status-value.success {
      color: #2e7d32;
    }

    .status-value.warning {
      color: #f57c00;
    }

    .status-value.error {
      color: #d32f2f;
    }

    .header-icon {
      background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
      color: white !important;
      border-radius: 12px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .welcome-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .welcome-title {
        font-size: 24px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .status-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
  })
  export class DashboardComponent implements OnInit {
  currentUser: Usuario | null = null;
  currentDate = new Date();
  stats = {
    usuarios: 0,
    tarjetas: 0,
    transportes: 0,
    transaccionesHoy: 0,
    rutas: 0,
    empleados: 0,
    paradas: 0,
    lineas: 0
  };

  systemHealth = {
    api: { status: 'operational', message: 'Verificando...' },
    database: { status: 'operational', message: 'Verificando...' },
    services: { status: 'operational', message: 'Verificando...' },
    system: { status: 'operational', message: 'Verificando...' }
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
    this.checkSystemHealth();
  }

  private loadDashboardData(): void {
    // Usar el nuevo endpoint de estadísticas del dashboard
    this.http.get<any>('http://127.0.0.1:8000/api/dashboard/estadisticas').subscribe({
      next: (data: any) => {
        this.stats = {
          usuarios: data.usuarios?.total || 0,
          tarjetas: data.tarjetas?.total || 0,
          transportes: data.transportes?.total || 0,
          transaccionesHoy: data.tarjetas?.transaccionesHoy || 0,
          rutas: data.rutas?.total || 0,
          empleados: data.empleados?.total || 0,
          paradas: data.paradas?.total || 0,
          lineas: data.lineas?.total || 0
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
          transaccionesHoy: 0,
          rutas: 0,
          empleados: 0,
          paradas: 0,
          lineas: 0
        };
        this.isLoading = false;
      }
    });
  }

  private checkSystemHealth(): void {
    // Verificar el estado del sistema en tiempo real
    this.http.get<any>('http://127.0.0.1:8000/api/dashboard/health').subscribe({
      next: (data: any) => {
        this.systemHealth = {
          api: data.api || { status: 'operational', message: 'API funcionando' },
          database: data.database || { status: 'operational', message: 'Base de datos conectada' },
          services: data.services || { status: 'operational', message: 'Servicios activos' },
          system: data.system || { status: 'operational', message: 'Sistema funcionando' }
        };
        console.log('Estado del sistema:', this.systemHealth);
      },
      error: (error: any) => {
        console.error('Error verificando estado del sistema:', error);
        // Si no puede conectarse a la API, marcar todo como error
        this.systemHealth = {
          api: { status: 'error', message: 'No se puede conectar' },
          database: { status: 'error', message: 'Sin conexión' },
          services: { status: 'error', message: 'No disponibles' },
          system: { status: 'error', message: 'Sistema caído' }
        };
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}