import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Factura } from '../../models/factura';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styles: [],
})
export class FacturaComponent implements OnInit {
  factura: Factura;
  titulo: string = 'Factura';

  constructor(
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      // +params.get('id'); : Con este "+" estaríamos parseando a tipo "number"
      let id = +params.get('id');

      this.facturaService.getFactura(id).subscribe((factura) => {
        console.log('factura', factura);

        this.factura = factura;
      });
    });
  }
}
