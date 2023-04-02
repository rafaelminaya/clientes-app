import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { FacturasRoutingModule } from './facturas-routing.module';
import { FacturaAddComponent } from './pages/factura-add/factura-add.component';
import { FacturaComponent } from './pages/factura/factura.component';

@NgModule({
  declarations: [FacturaComponent, FacturaAddComponent],
  imports: [CommonModule, FacturasRoutingModule, MaterialModule],
})
export class FacturasModule {}
