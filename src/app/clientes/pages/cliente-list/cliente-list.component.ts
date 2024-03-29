import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styles: [],
})
export class ClienteListComponent implements OnInit {
  // PROPIEDADES
  clientes: Cliente[] = [];
  paginador: any;
  clienteSeleccionado: Cliente = new Cliente();

  get service() {
    return this.authService;
  }

  /* - Inyección de dependencias.
     - private clienteService: ClienteService : Inyección de dependencias del servicio para las peticiones http.
     - ActivatedRoute: Permite obtener datos de la url, es decir, observa el cambio en el parámetro en la URL.
     - ModalService : Servicio inyectado que permite abrir y cerrar el modal. */
  // CONSTRUCTOR
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  // MÉTODOS
  ngOnInit(): void {
    /* - this.activatedRoute.paramMap : Observable que permite recuperar un parámetro de la ruta que cambie constantemente.*/
    this.activatedRoute.paramMap.subscribe((params) => {
      //get('page') : Es el nombre del parámetro que obtenemos de la URL.
      let page: number = +params.get('page');

      //Validación para la primera página, para cuando no haya este parámetro se le asigne el valor de cero "0".
      if (!page) {
        page = 0;
      }
      //tap() : Nos permite hacer una tarea. En este caso trabajar dentro de esta función, el asignar a "this.clientes" el "response" obtenida de la suscripción
      this.clienteService
        .getClientesPagination(page)
        .pipe(
          tap((response) => {
            console.log('ClientesComponent: tap3');
            //this.clientes = clientes
            (response.content as Cliente[]).forEach((cliente) => {
              //console.log(cliente.nombre);
            });
          })
        )
        .subscribe((response) => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });

    /* Nos suscribimos al posible cambio de la variable "notificarUpload" el cual contendrá el cliente modificado por la subida de una imagen.
       Acá compararemos el ID del cliente ("cliente") recibido por el cambio de imagen con el cliente actual ("clienteOriginal") para así actualizar la imagen.
     */
    this.modalService.notificarUpload.subscribe((cliente) => {
      this.clientes = this.clientes.map((clienteOriginal) => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }
  /* - Método para eliminar un cliente
     - cliente : Este objeto es enviado en el evento del botón. */
  delete(cliente: Cliente): void {
    //Aplicamos una venta de alerta de la plantilla de la documentación de "sweetalert2"
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estás seguro?',
        text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          //Hacemos le consumo de la API de eliminar
          this.clienteService.delete(cliente.id).subscribe((response) => {
            //filter() : Usamos esta función de JS para iterar el arreglo, solo considerando los registros cuyo objeto cliente sea diferente del recibido a eliminar
            this.clientes = this.clientes.filter((cli) => cli !== cliente);

            swalWithBootstrapButtons.fire(
              'Cliente eliminado!',
              `Cliente ${cliente.nombre}  ${cliente.apellido} eliminado con éxito!`,
              'success'
            );
          });
        }
        //Comentaremos estas líneas que muestran un mensaje en caso elijamos cerrar ventana flotante
        /*
      else if (
        
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu cliente no ha sido eliminado!',
          'error'
        )
      }
      */
      });
  }
  //Método que se encarga de abrir el modal y asigna los datos del cliente para que los tenga la vista
  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
