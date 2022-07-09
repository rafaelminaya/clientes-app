import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { FormComponent } from './clientes/form.component';

const routes: Routes = [
  {
    path: '', // http://localhost:4200
    redirectTo: '/clientes',
    pathMatch: 'full'
  },
  {
    path: 'directivas', // http://localhost:4200/directivas
    component: DirectivaComponent
  },
  {
    path: 'clientes', // http://localhost:4200/clientes
    component: ClientesComponent
  },
  {
    path: 'clientes/form', // http://localhost:4200/clientes/form
    component: FormComponent
  },
  {
    path: 'clientes/form/:id', // http://localhost:4200/clientes/form/1
    component: FormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
