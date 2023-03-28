import { ItemFactura } from './item-factura';
import { Cliente } from '../../clientes/cliente';

export class Factura {
  id!: number;
  descripcion!: string;
  observacion!: string;
  cliente!: Cliente;
  items: ItemFactura[] = [];
  total!: number;
  createAt!: string;
}
