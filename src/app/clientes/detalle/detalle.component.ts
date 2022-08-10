import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente = new Cliente();
  titulo: string = 'Detalle del cliente';
  //usamos el modificador "private" ya este atributo no será usado en la vista, solo en este archivo ".ts"
  fotoSeleccionada: File;
  //Variable que representará la barra de progreso
  progreso: number = 0;

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
    public modalService: ModalService
  ) {}

  ngOnInit(): void {
    //Esto iba cuando se obtenían los datos delk cliente en una nueva página
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

  seleccionarFoto(event: any): void {
    /* - event.target.files[0] : Asigna la imagen seleccionada en la variable local.
       - files[0] : Seleccionamos el primer índica ya que es el que contiene el archivo.
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
          //Si es un envento de barra de progreso, asignamos el valor a nuestra variable "this.progreso"
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          }
          //En caso el evento sea de una respuesta asgianmos el cuerpo de esa respuesta a nuestro variable "this.cliente"
          else if (event.type === HttpEventType.Response) {
            let resposne: any = event.body;

            this.cliente = resposne.cliente as Cliente;
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
}
