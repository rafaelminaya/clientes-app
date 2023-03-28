import { Component, OnInit } from '@angular/core';
import { FacturaService } from './services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { Factura } from './models/factura';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css'],
})
export class DetalleFacturaComponent implements OnInit {
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
