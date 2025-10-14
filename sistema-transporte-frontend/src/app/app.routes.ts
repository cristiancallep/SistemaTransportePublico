import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta por defecto - redirigir a dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Rutas de autenticación (públicas)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Dashboard (protegido)
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/components/dashboard.component')
      .then(m => m.DashboardComponent)
  },

  // Módulo de Usuarios (protegido)
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    data: { 
      permissions: ['usuarios:leer'],
      breadcrumb: 'Usuarios'
    },
    loadChildren: () => import('./features/usuarios/usuarios.routes')
      .then(m => m.usuarioRoutes)
  },

  // Módulo de Tarjetas (protegido)
  {
    path: 'tarjetas',
    canActivate: [AuthGuard],
    data: { 
      permissions: ['tarjetas:leer'],
      breadcrumb: 'Tarjetas'
    },
    loadChildren: () => import('./features/tarjetas/tarjetas.routes')
      .then(m => m.tarjetaRoutes)
  },

  // Módulo de Transportes (protegido)
  {
    path: 'transportes',
    canActivate: [AuthGuard],
    data: { 
      permissions: ['transportes:leer'],
      breadcrumb: 'Transportes'
    },
    loadChildren: () => import('./features/transportes/transportes.routes')
      .then(m => m.transporteRoutes)
  },

  // Módulo de Empleados (protegido)
  {
    path: 'empleados',
    canActivate: [AuthGuard],
    data: { 
      permissions: ['empleados:leer'],
      breadcrumb: 'Empleados'
    },
    loadChildren: () => import('./features/empleados/empleados.routes')
      .then(m => m.empleadoRoutes)
  },

  // Módulo de Transacciones (protegido)
  {
    path: 'transacciones',
    canActivate: [AuthGuard],
    data: { 
      permissions: ['reportes:ver'],
      breadcrumb: 'Transacciones'
    },
    loadChildren: () => import('./features/transacciones/transacciones.routes')
      .then(m => m.transaccionRoutes)
  },

  // Módulo de Reportes (protegido)
  {
    path: 'reportes',
    canActivate: [AuthGuard],
    data: { 
      permissions: ['reportes:ver'],
      breadcrumb: 'Reportes'
    },
    loadChildren: () => import('./features/reportes/reportes.routes')
      .then(m => m.reporteRoutes)
  },

  // Perfil de usuario
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/components/profile.component')
      .then(m => m.ProfileComponent)
  },

  // Configuración
  {
    path: 'settings',
    canActivate: [AuthGuard],
    data: { 
      permissions: ['admin:configuracion']
    },
    loadComponent: () => import('./features/settings/components/settings.component')
      .then(m => m.SettingsComponent)
  },

  // Página de no autorizado
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },

  // Página de error 404
  {
    path: '404',
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  },

  // Wildcard - debe estar al final
  {
    path: '**',
    redirectTo: '/404'
  }
];
