import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta por defecto - redirigir a usuarios
  {
    path: '',
    redirectTo: '/usuarios',
    pathMatch: 'full'
  },

  // Rutas de autenticación (públicas - sin layout)
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

  // Rutas con layout (todas las rutas protegidas)
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./shared/components/layout/layout.component')
      .then(m => m.LayoutComponent),
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/components/dashboard.component')
          .then(m => m.DashboardComponent)
      },

      // Módulo de Usuarios
      {
        path: 'usuarios',
        data: { 
          permissions: ['usuarios:leer'],
          breadcrumb: 'Usuarios'
        },
        loadChildren: () => import('./features/usuarios/usuarios.routes')
          .then(m => m.usuarioRoutes)
      },

      // Módulo de Tarjetas
      {
        path: 'tarjetas',
        data: { 
          permissions: ['tarjetas:leer'],
          breadcrumb: 'Tarjetas'
        },
        loadChildren: () => import('./features/tarjetas/tarjetas.routes')
          .then(m => m.tarjetaRoutes)
      },

      // Módulo de Transportes
      {
        path: 'transportes',
        data: { 
          permissions: ['transportes:leer'],
          breadcrumb: 'Transportes'
        },
        loadChildren: () => import('./features/transportes/transportes.routes')
          .then(m => m.transporteRoutes)
      },

      // Módulo de Paradas
      {
        path: 'paradas',
        data: {
          permissions: ['paradas:leer', 'transportes:leer'],
          breadcrumb: 'Paradas'
        },
        loadChildren: () => import('./features/paradas/paradas.routes')
          .then(m => m.paradaRoutes)
      },

      // Módulo de Empleados
      {
        path: 'empleados',
        data: { 
          permissions: ['empleados:leer'],
          breadcrumb: 'Empleados'
        },
        loadChildren: () => import('./features/empleados/empleados.routes')
          .then(m => m.empleadoRoutes)
      },

      // Módulo de Transacciones
      {
        path: 'transacciones',
        data: { 
          permissions: ['reportes:ver'],
          breadcrumb: 'Transacciones'
        },
        loadChildren: () => import('./features/transacciones/transacciones.routes')
          .then(m => m.transaccionRoutes)
      },

      // Módulo de Reportes
      {
        path: 'reportes',
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
        loadComponent: () => import('./features/profile/components/profile.component')
          .then(m => m.ProfileComponent)
      },

      // Configuración
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/components/settings.component')
          .then(m => m.SettingsComponent)
      }
    ]
  },

  // Página de no autorizado (sin layout)
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },

  // Página de error 404 (sin layout)
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
