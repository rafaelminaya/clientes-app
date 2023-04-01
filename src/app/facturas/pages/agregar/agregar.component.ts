import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, map, switchMap } from 'rxjs';
import { ClienteService } from 'src/app/clientes/services/cliente.service';
import Swal from 'sweetalert2';
import { Factura } from '../../models/factura';
import { ItemFactura } from '../../models/item-factura';
import { Producto } from '../../models/producto';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [],
})
export class AgregarComponent implements OnInit {
  // PROPIEDADES
  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  // propiedades para el auto complete
  autocompleteControl = new FormControl();
  productos: string[] = ['Mesa', 'Tablet', 'Sony', 'Samsung'];
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  // MÉTODOS
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let clienteId = +params.get('clienteId');

      this.clienteService.getCliente(clienteId).subscribe((cliente) => {
        this.factura.cliente = cliente;
      });
    });

    // auto complete
    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      //  devolvemos el valor si es de tipo string, de lo contrario retornamos su propiedad "nombre"
      map((value) => (typeof value === 'string' ? value : value.nombre)),
      // validamos que el valor exista, para proceder con la función, de lo contrario un arreglo vacio
      switchMap((value) => (value ? this._filter(value) : []))
    );
  }

  // Método para filtrar auto complete
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtarProductos(filterValue);
  }

  // producto? : El signo "?" es para indicar que es un parámetro opcional
  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  // método lanzado al seleccionar un producto de entre el resultado filtado
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    // Obtenemos el valor de producto y lo convertimos al tipo "Producto"
    let producto = event.option.value as Producto;
    console.log('producto', producto);

    // Controlamos en caso se seleccione un producto en los items, solo aumente la cantidad y no añada otro item
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem = new ItemFactura();

      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    // limpiamos el auto complete
    this.autocompleteControl.setValue('');
    // quitamos el focus del aut complete del evento
    event.option.focus();
    // deseleccionamos el producto previamente seleccionado
    event.option.deselect();
    console.log('items1', this.factura.items);
  }

  // método lanzado al manipular la cantidad de productos en cada item
  actualizarCantidad(productoId: number, event: any): void {
    // Obtebemos el valor del event, ene este caso el de la caja de texto
    let cantidad: number = event.target.value as number;
    // OPCIONARL - Eliminamos el item en caso la cantidad baje a cero
    if (cantidad == 0) {
      this.eliminarItemFactura(productoId);
    }

    // asginamos a los items, estos mismos items, manipulados por la función "map()" de JS
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      // Si el parámetro "productoId" coincide con algún "id" de entre los "items" actuales le asignamos la cantidad de la caja de texto
      if (productoId === item.producto.id) {
        item.cantidad = cantidad;
      }
      // Devolvemos el item con la nueva cantidad asignada, así actualiza el importe
      return item;
    });
    console.log('item2s', this.factura.items);
  }

  // método que verifica la existencia de un producto entre los items
  existeItem(productoId: number): boolean {
    let existe: boolean = false;

    this.factura.items.forEach((item: ItemFactura) => {
      // comparamos el parámetro con el "id" de productos ya existentes entre los "items"
      if (productoId === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }
  // actualiza el item producto incrementando la cantidad
  incrementaCantidad(productoId: number): void {
    // asginamos a los items, estos mismos items, manipulados por la función "map()" de JS
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      // comparamos parámetro con los items, para hacer un pre incremento de la cantidad
      if (productoId === item.producto.id) {
        ++item.cantidad;
      }
      // Devolvemos el item con la nueva cantidad asignada, así actualiza el importe
      return item;
    });
  }

  // método para eliminar un item
  eliminarItemFactura(productoId: number): void {
    // re asignamos los items, con el método "filter()" de JS, todos aquellos que no coincidan con el parámetro "productoId"
    this.factura.items = this.factura.items.filter(
      (item: ItemFactura) => productoId !== item.producto.id
    );
  }

  // método para crear una nueva factura
  create(facturaForm) {
    console.log('facura', this.factura);

    // validación en caso no haya items
    if (this.factura.items.length == 0) {
      this.autocompleteControl.setErrors({ invalid: true });
    }

    // validación del fomrulario
    if (facturaForm.valid && this.factura.items.length > 0) {
      // procedemos a registar el formulario si es válido y tiene item
      this.facturaService.create(this.factura).subscribe((factura) => {
        Swal.fire(
          this.titulo,
          `Factura ${factura.descripcion} creada con éxito!`,
          'success'
        );
        this.router.navigate(['/clientes']);
      });
    }
  }
}
