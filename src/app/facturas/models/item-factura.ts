import { Producto } from './producto';

export class ItemFactura {
  producto!: Producto;
  cantidad: number = 1;
  importe!: number;
  // debemos elegir entre usar el "importe" como una propiedad o un método
  calcularImporte(): number {
    return this.cantidad * this.producto.precio;
  }
}
