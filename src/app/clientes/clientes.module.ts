import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClienteAddComponent } from './pages/cliente-add/cliente-add.component';
import { ClienteListComponent } from './pages/cliente-list/cliente-list.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { PaginatorComponent } from './pages/paginator/paginator.component';

@NgModule({
  declarations: [
    PaginatorComponent,
    ClienteComponent,
    ClienteAddComponent,
    ClienteListComponent,
  ],
  imports: [CommonModule, ClientesRoutingModule, MaterialModule],
})
export class ClientesModule {}
