import { ItemFactura } from './item-factura';
import { Cliente } from '../../clientes/models/cliente';

export class Factura {
  id!: number;
  descripcion!: string;
  observacion!: string;
  cliente!: Cliente;
  items: ItemFactura[] = [];
  total!: number;
  createAt!: string;

  calcularGranTotal(): number {
    this.total = 0;

    this.items.forEach((item: ItemFactura) => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }
}
