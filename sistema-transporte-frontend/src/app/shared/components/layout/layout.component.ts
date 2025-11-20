import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../models';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  permission?: string;
  badge?: number;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container" [hasBackdrop]="isMobile">
      <!-- Sidebar -->
      <mat-sidenav
        #sidenav
        [mode]="isMobile ? 'over' : 'side'"
        [opened]="!isMobile"
        class="sidenav"
        [fixedInViewport]="isMobile"
      >
        <div class="sidebar-content">
          <!-- Logo y Título -->
          <div class="sidebar-header">
            <div class="logo-container">
              <mat-icon class="logo-icon">directions_bus</mat-icon>
              <h1 class="app-title" *ngIf="!sidenavCollapsed">
                Sistema Transporte
              </h1>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- User Info -->
          <div class="user-section" *ngIf="currentUser">
            <div class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-details" *ngIf="!sidenavCollapsed">
              <p class="user-name">{{ currentUser.nombre }}</p>
              <p class="user-role">{{ currentUser.rol?.nombre }}</p>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Navigation Menu -->
          <nav class="navigation-menu">
            <mat-nav-list>
              <a
                mat-list-item
                *ngFor="let item of menuItems"
                [routerLink]="item.route"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                [matTooltip]="sidenavCollapsed ? item.label : ''"
                matTooltipPosition="right"
                (click)="onMenuItemClick()"
              >
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <span matListItemTitle *ngIf="!sidenavCollapsed">{{ item.label }}</span>
                <span matListItemMeta *ngIf="item.badge && !sidenavCollapsed" class="badge">
                  {{ item.badge }}
                </span>
              </a>
            </mat-nav-list>
          </nav>

          <!-- Spacer -->
          <div class="spacer"></div>

          <!-- Bottom Actions -->
          <div class="sidebar-footer">
            <mat-divider></mat-divider>
            
            <mat-nav-list>
              <a
                mat-list-item
                routerLink="/profile"
                routerLinkActive="active-link"
                [matTooltip]="sidenavCollapsed ? 'Mi Perfil' : ''"
                matTooltipPosition="right"
                (click)="onMenuItemClick()"
              >
                <mat-icon matListItemIcon>person</mat-icon>
                <span matListItemTitle *ngIf="!sidenavCollapsed">Mi Perfil</span>
              </a>

              <a
                mat-list-item
                routerLink="/settings"
                routerLinkActive="active-link"
                [matTooltip]="sidenavCollapsed ? 'Configuración' : ''"
                matTooltipPosition="right"
                (click)="onMenuItemClick()"
              >
                <mat-icon matListItemIcon>settings</mat-icon>
                <span matListItemTitle *ngIf="!sidenavCollapsed">Configuración</span>
              </a>

              <a
                mat-list-item
                (click)="logout()"
                [matTooltip]="sidenavCollapsed ? 'Cerrar Sesión' : ''"
                matTooltipPosition="right"
              >
                <mat-icon matListItemIcon>exit_to_app</mat-icon>
                <span matListItemTitle *ngIf="!sidenavCollapsed">Cerrar Sesión</span>
              </a>
            </mat-nav-list>
          </div>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="main-content">
        <!-- Top Toolbar -->
        <mat-toolbar class="top-toolbar">
          <button
            mat-icon-button
            (click)="sidenav.toggle()"
            [matTooltip]="sidenav.opened ? 'Ocultar menú' : 'Mostrar menú'"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <span class="page-title">{{ pageTitle }}</span>

          <div class="spacer"></div>

          <!-- Quick Actions -->
          <button mat-icon-button [matMenuTriggerFor]="notificationsMenu" matTooltip="Notificaciones">
            <mat-icon [matBadge]="notifications" matBadgeColor="warn" [matBadgeHidden]="notifications === 0">
              notifications
            </mat-icon>
          </button>

          <mat-menu #notificationsMenu="matMenu">
            <div class="notifications-header">
              <h3>Notificaciones</h3>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item *ngIf="notifications === 0">
              <mat-icon>check_circle</mat-icon>
              <span>No hay notificaciones nuevas</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      width: 100%;
      overflow: hidden;
      display: flex;
    }

    .sidenav {
      width: 260px;
      background: #1E88E5;
      color: white;
      transition: width 0.3s ease;
      z-index: 2;
      flex-shrink: 0;
    }

    .sidenav.collapsed {
      width: 64px;
    }

    .sidebar-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .sidebar-header {
      padding: 12px;
      flex-shrink: 0;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #fff;
    }

    .app-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
      color: white;
      white-space: nowrap;
    }

    .user-section {
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.15);
      margin: 4px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .user-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      margin: 0;
      font-weight: 600;
      font-size: 12px;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      margin: 0;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .navigation-menu {
      flex: 1;
      overflow-y: visible;
      overflow-x: hidden;
      padding: 2px 0;
      display: flex;
      flex-direction: column;
    }

    .navigation-menu mat-nav-list {
      padding: 0;
    }

    .navigation-menu a {
      color: white;
      margin: 1px 6px;
      border-radius: 6px;
      transition: all 0.3s ease;
      min-height: 32px;
      padding: 4px 10px !important;
    }

    .navigation-menu a:hover {
      background: rgba(0, 0, 0, 0.15);
      color: white;
    }

    .navigation-menu a.active-link {
      background: rgba(0, 0, 0, 0.25);
      color: white;
      font-weight: 600;
    }

    .navigation-menu mat-icon {
      color: inherit;
    }

    .badge {
      background: #f44336;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .spacer {
      flex: 1;
    }

    .sidebar-footer {
      margin-top: auto;
      flex-shrink: 0;
      padding-bottom: 4px;
    }

    .sidebar-footer mat-nav-list {
      padding: 0;
    }

    .sidebar-footer a {
      color: white;
      margin: 1px 6px;
      border-radius: 6px;
      transition: all 0.3s ease;
      min-height: 32px;
      padding: 4px 10px !important;
    }

    .sidebar-footer a:hover {
      background: rgba(0, 0, 0, 0.15);
      color: white;
    }

    .sidebar-footer a.active-link {
      background: rgba(0, 0, 0, 0.25);
      color: white;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f5f5f5;
      overflow: hidden;
      width: 100%;
      min-width: 0;
    }

    .top-toolbar {
      background: white;
      color: #333;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1;
      flex-shrink: 0;
      position: relative;
      width: 100%;
    }

    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin-left: 16px;
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0;
      background: #f5f7fa;
      width: 100%;
      min-width: 0;
    }

    .notifications-header {
      padding: 16px;
    }

    .notifications-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    /* Scrollbar personalizado para el sidebar */
    .navigation-menu::-webkit-scrollbar {
      width: 0;
      display: none;
    }
    
    /* Asegurar que los iconos de Material sean del tamaño correcto */
    .navigation-menu mat-icon,
    .sidebar-footer mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    /* Ajustar el tamaño de fuente de los items del menú */
    .navigation-menu span,
    .sidebar-footer span {
      font-size: 15px;
    }

    /* Scrollbar personalizado para el contenido */
    .page-content::-webkit-scrollbar {
      width: 8px;
    }

    .page-content::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .page-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }

    .page-content::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-content {
        padding: 16px;
      }

      .page-title {
        font-size: 16px;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  currentUser: Usuario | null = null;
  sidenavCollapsed = false;
  isMobile = false;
  pageTitle = 'Dashboard';
  notifications = 0;

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'home',
      route: '/dashboard',
      permission: undefined // Accesible para todos
    },
    {
      label: 'Usuarios',
      icon: 'people',
      route: '/usuarios',
      permission: 'usuarios:leer'
    },
    {
      label: 'Tarjetas',
      icon: 'credit_card',
      route: '/tarjetas',
      permission: 'tarjetas:leer'
    },
    {
      label: 'Transportes',
      icon: 'directions_bus',
      route: '/transportes',
      permission: 'transportes:leer'
    },
    {
      label: 'Paradas',
      icon: 'place',
      route: '/paradas',
      permission: 'paradas:leer'
    },
    {
      label: 'Empleados',
      icon: 'badge',
      route: '/empleados',
      permission: 'empleados:leer'
    },
    {
      label: 'Transacciones',
      icon: 'receipt_long',
      route: '/transacciones',
      permission: 'reportes:ver'
    },
    {
      label: 'Reportes',
      icon: 'assessment',
      route: '/reportes',
      permission: 'reportes:ver'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    this.currentUser = this.authService.getCurrentUser();

    // Filtrar menú según permisos
    this.filterMenuByPermissions();

    // Detectar cambios en el tamaño de pantalla
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    // Actualizar título de página según la ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });

    // Título inicial
    this.updatePageTitle();
  }

  filterMenuByPermissions(): void {
    if (!this.currentUser?.rol?.permisos) {
      return;
    }

    const userPermissions = this.currentUser.rol.permisos as any[];
    this.menuItems = this.menuItems.filter(item => {
      if (!item.permission) {
        return true; // Mostrar items sin permisos requeridos
      }
      return userPermissions.some(p => {
        // Manejar el caso donde permisos puede ser string o objeto
        const permissionName = typeof p === 'string' ? p : p.nombre;
        return permissionName === item.permission;
      });
    });
  }

  updatePageTitle(): void {
    const currentRoute = this.router.url.split('?')[0];
    const menuItem = this.menuItems.find(item => currentRoute.startsWith(item.route));
    
    if (menuItem) {
      this.pageTitle = menuItem.label;
    } else if (currentRoute === '/dashboard') {
      this.pageTitle = 'Inicio';
    } else if (currentRoute === '/profile') {
      this.pageTitle = 'Mi Perfil';
    } else if (currentRoute === '/settings') {
      this.pageTitle = 'Configuración';
    } else {
      this.pageTitle = 'Sistema Transporte Público';
    }
  }

  onMenuItemClick(): void {
    // Cerrar sidebar en móvil después de hacer clic
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
