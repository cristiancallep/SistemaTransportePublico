import { Routes } from '@angular/router';

export const paradaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-paradas.component')
      .then(m => m.ListaParadasComponent)
  },
  {
    path: 'crear',
    loadComponent: () => import('./parada-form.component')
      .then(m => m.ParadaFormComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./parada-form.component')
      .then(m => m.ParadaFormComponent)
  },
];
