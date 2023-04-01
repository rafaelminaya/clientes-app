import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { AgregarComponent } from './pages/agregar/agregar.component';
import { ListadoComponent } from './pages/listado/listado.component';
import { PaginatorComponent } from './pages/paginator/paginator.component';
import { ClienteComponent } from './pages/cliente/cliente.component';

@NgModule({
  declarations: [AgregarComponent, ListadoComponent, PaginatorComponent, ClienteComponent],
  imports: [CommonModule, ClientesRoutingModule, MaterialModule],
})
export class ClientesModule {}
