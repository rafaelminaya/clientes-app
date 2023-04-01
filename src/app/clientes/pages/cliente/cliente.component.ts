import { Component, Input, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Factura } from 'src/app/facturas/models/factura';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';

import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  // PROPIEDADES
  @Input() cliente: Cliente = new Cliente();
  titulo: string = 'Detalle del cliente';
  //usamos el modificador "private" ya este atributo no será usado en la vista, solo en este archivo ".ts"
  fotoSeleccionada: File;
  //Variable que representará la barra de progreso
  progreso: number = 0;

  get service() {
    return this.authService;
  }

  /*
  private clienteService: ClienteService : 
  Inyección de dependencias del servicio para las peticiones http.
  Para poder suscribir cuando cuando el parámetro del ID.

  private router: Router : 
  Inyectamos la dependencia del Router para poder hacer redirecciones. 
  lo utilizaremos en el ngoniit, para suscribirisnos cuando cambie el parámetro del ID y así obtener el cliente.

  ModalService : Servicio inyectado que permite abrir y cerrar el modal. Será "public" para poder ser accedido desde la vista.
  */
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    private authService: AuthService,
    private facturaService: FacturaService
  ) {}

  // MÉTODOS
  ngOnInit(): void {
    //Esto iba cuando se obtenían los datos del cliente en una nueva página
    /*
    this.activatedRoute.paramMap.subscribe((params) => {
      //El signo "+"" convierte a tipo de dato number.
      let id: number = +params.get('id');

      //verificamos la existencia del id proveniente de la URL
      if (id) {
        //Asignamos el cliente recibido por la función  "getCliente()" (que consume el enpoint) a nuestra variable local.

        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });
    */
  }

  ngOnDestroy(): void {
    this.cerrarModal();
  }

  seleccionarFoto(event: any): void {
    /* - event.target.files[0] : Asigna la imagen seleccionada en la variable local.
       - files[0] : Seleccionamos el primer índice ya que es el que contiene el archivo.
    */
    this.fotoSeleccionada = event.target.files[0];
    //Reiniciamos la barra de progreso al seleccionar una nueva foto
    this.progreso = 0;
    console.log(this.fotoSeleccionada);

    //Validamos que el tipo de archivo seleccionado sea una foto
    //indexOf() : método del objeto string que busca en esta cadena que haya un coincidencia con "image".
    //Si lo encuentra retornará la posición en que se encuentre, de lo contrario retornará "-1"
    //Por lo tanto validamos con -1 ya que significa que no es del tipo "image"
    //pdf: application/pdf jpg: image/jpeg png: image/png mp4: video/mp4
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire(
        'Error seleccionar imagen: ',
        'El archivo debe ser del tipo imagen',
        'error'
      );
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(): void {
    //validamos que exista una imagen seleccionada a ser subida
    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService
        .subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe((event) => {
          //La respuesta será de tipo "HttpEventType", necesario para controlar el diseño de una barra de progreso
          //Si es un evento de barra de progreso, asignamos el valor a nuestra variable "this.progreso"
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          }
          //En caso el evento sea de una respuesta asignamos el cuerpo de esa respuesta a nuestro variable "this.cliente"
          else if (event.type === HttpEventType.Response) {
            let response: any = event.body;

            this.cliente = response.cliente as Cliente;
            //emit() : Función que permite emitir, en este caso enviar el valor de la variable por el método "get()" de la variable "_notificarUpload" del "modalService"
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire(
              'La foto se ha subido exitosamente!',
              `La foto ${this.cliente.foto} subido con éxito!`,
              'success'
            );
          }
        });
    }
  }

  //Método para cerrar la ventana modal
  cerrarModal(): void {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void {
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
        text: `¿Seguro que desea eliminar la factura ${factura.descripcion} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          //Hacemos le consumo de la API de eliminar
          this.facturaService.delete(factura.id).subscribe(() => {
            //filter() : Usamos esta función de JS para iterar el arreglo, solo considerando los registros cuyo objeto cliente sea diferente del recibido a eliminar
            this.cliente.facturas = this.cliente.facturas.filter(
              (fac) => fac !== factura
            );

            swalWithBootstrapButtons.fire(
              'Factura eliminada!',
              `Factura ${factura.descripcion} eliminado con éxito!`,
              'success'
            );
          });
        }
      });
  }
}
