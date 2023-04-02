import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { FacturaAddComponent } from './pages/factura-add/factura-add.component';
import { FacturaComponent } from './pages/factura/factura.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id', // http://localhost:4200/facturas/1
        component: FacturaComponent,
        canLoad: [AuthGuard, RoleGuard],
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'ROLE_USER' }, // Parámetro enviado a los guards, pero que solo será usado por "RoleGuard"
      },
      {
        path: 'form/:clienteId', // http://localhost:4200/facturas/form/1
        component: FacturaAddComponent,
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
export class FacturasRoutingModule {}
