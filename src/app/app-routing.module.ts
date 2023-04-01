import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DirectivaComponent } from './directiva/directiva.component';

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
    path: 'clientes',
    loadChildren: () =>
      import('./clientes/clientes.module').then((m) => m.ClientesModule),
  },
  {
    path: 'facturas',
    loadChildren: () =>
      import('./facturas/facturas.module').then((m) => m.FacturasModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: 'clientes',
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
