import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  
  // Inyección de dependencias.
  constructor(private  clienteService: ClienteService) { }

  ngOnInit(): void {

    this.clienteService.getClientes().subscribe(
      (res) => this.clientes = res
    );
    
  }
  /*
  Método para eliminar un cliente
  cliente : Es objeto es enviado en el evento del botón.
   */
  delete(cliente: Cliente): void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estás seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre } ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //Hacemos le consumo de la API de eliminar
        this.clienteService.delete(cliente.id).subscribe(
          (response) => {
            //filter() : Usamos esta función de JS para iterar el arreglo, solo considerando los registros cuyo objeto cliente sea diferente del recibido a eliminar
            this.clientes = this.clientes.filter(cli => cli !== cliente);

            swalWithBootstrapButtons.fire(
              'Cliente eliminado!',
              `Cliente ${cliente.nombre}  ${cliente.apellido} eliminado con éxito!`,
              'success'
            )
          }
        );

        
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
    })
  }

}
