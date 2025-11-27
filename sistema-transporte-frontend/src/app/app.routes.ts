import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/usuarios',
    pathMatch: 'full'
  },

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

  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./shared/components/layout/layout.component')
      .then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/components/dashboard.component')
          .then(m => m.DashboardComponent)
      },

      {
        path: 'usuarios',
        data: { 
          permissions: ['usuarios:leer'],
          breadcrumb: 'Usuarios'
        },
        loadChildren: () => import('./features/usuarios/usuarios.routes')
          .then(m => m.usuarioRoutes)
      },

      {
        path: 'tarjetas',
        data: { 
          permissions: ['tarjetas:leer'],
          breadcrumb: 'Tarjetas'
        },
        loadChildren: () => import('./features/tarjetas/tarjetas.routes')
          .then(m => m.tarjetaRoutes)
      },

      {
        path: 'transportes',
        data: { 
          permissions: ['transportes:leer'],
          breadcrumb: 'Transportes'
        },
        loadChildren: () => import('./features/transportes/transportes.routes')
          .then(m => m.transporteRoutes)
      },

      {
        path: 'paradas',
        data: {
          permissions: ['paradas:leer', 'transportes:leer'],
          breadcrumb: 'Paradas'
        },
        loadChildren: () => import('./features/paradas/paradas.routes')
          .then(m => m.paradaRoutes)
      },

      {
        path: 'empleados',
        data: { 
          permissions: ['empleados:leer'],
          breadcrumb: 'Empleados'
        },
        loadChildren: () => import('./features/empleados/empleados.routes')
          .then(m => m.empleadoRoutes)
      },

      {
        path: 'transacciones',
        data: { 
          permissions: ['reportes:ver'],
          breadcrumb: 'Transacciones'
        },
        loadChildren: () => import('./features/transacciones/transacciones.routes')
          .then(m => m.transaccionRoutes)
      },

      {
        path: 'reportes',
        data: { 
          permissions: ['reportes:ver'],
          breadcrumb: 'Reportes'
        },
        loadChildren: () => import('./features/reportes/reportes.routes')
          .then(m => m.reporteRoutes)
      },

      {
        path: 'profile',
        loadComponent: () => import('./features/profile/components/profile.component')
          .then(m => m.ProfileComponent)
      },

      {
        path: 'settings',
        loadComponent: () => import('./features/settings/components/settings.component')
          .then(m => m.SettingsComponent)
      }
    ]
  },

  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },

  {
    path: '404',
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  },

  {
    path: '**',
    redirectTo: '/404'
  }
];
