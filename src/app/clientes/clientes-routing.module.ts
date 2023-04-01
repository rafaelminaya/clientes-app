import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { AgregarComponent } from './pages/agregar/agregar.component';
import { ListadoComponent } from './pages/listado/listado.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', // http://localhost:4200/clientes
        component: ListadoComponent,
      },
      {
        path: 'page/:page', // http://localhost:4200/clientes/page/0
        component: ListadoComponent,
      },
      {
        path: 'form', // http://localhost:4200/clientes/form
        component: AgregarComponent,
        canLoad: [AuthGuard, RoleGuard],
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'ROLE_ADMIN' }, // Parámetro enviado a los guards, pero que solo será usado por "RoleGuard"
      },
      {
        path: 'form/:id', // http://localhost:4200/clientes/form/1
        component: AgregarComponent,
        canLoad: [AuthGuard, RoleGuard],
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'ROLE_ADMIN' }, // Parámetro enviado a los guards, pero que solo será usado por "RoleGuard"
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule {}
