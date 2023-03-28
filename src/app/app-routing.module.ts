import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { LoginComponent } from './usuarios/login.component';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas/facturas.component';

//Configuramos globalmente el i18n de forma global para toda la aplicación.
registerLocaleData(localeES, 'es');

const routes: Routes = [
  {
    path: '', // http://localhost:4200
    redirectTo: '/clientes',
    pathMatch: 'full',
  },
  {
    path: 'directivas', // http://localhost:4200/directivas
    component: DirectivaComponent,
  },
  {
    path: 'clientes', // http://localhost:4200/clientes
    component: ClientesComponent,
  },
  {
    path: 'clientes/page/:page', // http://localhost:4200/clientes/page/0
    component: ClientesComponent,
  },
  {
    path: 'clientes/form', // http://localhost:4200/clientes/form
    component: FormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' }, // Parámetro enviado a los guards, plero que solo será usado por "RoleGuard"
  },
  {
    path: 'clientes/form/:id', // http://localhost:4200/clientes/form/1
    component: FormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' }, // Parámetro enviado a los guards, plero que solo será usado por "RoleGuard"
  },
  {
    path: 'login', // http://localhost:4200/login
    component: LoginComponent,
  },
  {
    path: 'facturas/:id', // http://localhost:4200/facturas/1
    component: DetalleFacturaComponent,
  },
  {
    path: 'facturas/form/:clienteId', // http://localhost:4200/facturas/form/1
    component: FacturasComponent,
  },
  /*
  {
    path: 'clientes/ver/:id', // http://localhost:4200/clientes/ver/1
    component: DetalleComponent,
  },
  */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
