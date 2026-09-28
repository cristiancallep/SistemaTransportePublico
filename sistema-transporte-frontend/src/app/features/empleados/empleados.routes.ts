import { Routes } from '@angular/router';
import { EmpleadosListComponent } from './empleados-list.component';

export const empleadoRoutes: Routes = [
  {
    path: '',
    component: EmpleadosListComponent
  }
];

export default empleadoRoutes;