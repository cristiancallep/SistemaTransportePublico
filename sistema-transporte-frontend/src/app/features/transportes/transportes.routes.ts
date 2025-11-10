import { Routes } from '@angular/router';
import { ListaTransportesComponent } from './lista-transportes.component';
import { TransporteFormComponent } from './transporte-form.component';
import { LineaFormComponent } from './linea-form.component';
import { LineasListComponent } from './lineas-list.component';

export const transporteRoutes: Routes = [
  { path: '', component: ListaTransportesComponent },
  { path: 'crear', component: TransporteFormComponent },
  { path: 'editar/:id', component: TransporteFormComponent },
  { path: 'lineas/crear', component: LineaFormComponent },
  { path: 'lineas/editar/:id', component: LineaFormComponent },
  { path: 'lineas', component: LineasListComponent },
];

export default transporteRoutes;