import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { FacturasRoutingModule } from './facturas-routing.module';
import { AgregarComponent } from './pages/agregar/agregar.component';
import { FacturaComponent } from './pages/factura/factura.component';

@NgModule({
  declarations: [FacturaComponent, AgregarComponent],
  imports: [CommonModule, FacturasRoutingModule, MaterialModule],
})
export class FacturasModule {}
