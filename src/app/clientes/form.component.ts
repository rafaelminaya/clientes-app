import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  titulo: string = 'Crear cliente';
  cliente: Cliente = new Cliente();
  regiones: Region[] = [];
  errores: string[] = [];
  //Atributo que contiene los diferentes mensajes de error de validaciones del backend

  /*
  private clienteService: ClienteService : Inyección de dependencias del servicio para las peticiones http
  private router: Router : Inyectamos la dependencia del Router para poder hacer redirecciones.
  ActivatedRoute: Permtie obtener datos de la url, es decir observa el cambio en el parámetro.
  */
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCliente();
  }

  //Función que obtiene la información de un cliente para luedo ser editada
  cargarCliente(): void {
    /**
     * this.activatedRoute.params.subscribe:
     * Permite obtener los valores de la url, en este caso el valor {id} enviado por la ruta.
     * Esto requiere de una subscripción.
     */
    this.activatedRoute.params.subscribe((params) => {
      //Obtenemos el parámtro id obtenido por la ruta. Ruta "clientes/:id" del archivo "AppRoutingModule"
      let id = params['id'];

      //Validación de la existencia del id para hacer la suscripción al servicio.
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((response) => (this.cliente = response));
      }
    });

    this.clienteService.getRegiones().subscribe((response) => {
      this.regiones = response;
    });
  }

  create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      //Primer parámetro que contiene los mensajes de éxito.
      (cliente) => {
        // Usamos la librería "SweetAlert2" instalada por medio ded npm
        Swal.fire(
          'Nuevo cliente',
          `Cliente ${cliente.nombre} creado con éxito!`,
          'success'
        );
        /*   
        Swal.fire({
          title: 'Nuevo cliente',
          text: `Cliente ${cliente.nombre} creado con éxito!`,
          icon: 'success',
          confirmButtonText: 'De acuerdo',        
         //timer: 3000          
        })
        */

        //Redireccionamos a la ruta "http://localhost:4200/clientes"
        this.router.navigate(['/clientes']);
      },
      //Segundo parámetro que contiene los mensajes de error
      //Asignamos los valores obtenidos del error a la variable local "this.errores", parseado en arreglo de strings "string[]"
      (err) => {
        this.errores = err.error.errors as string[];
        console.log('Codigo de error desde el backend: ' + err.status);
        console.log('err.error.errors: ' + err.error.errors);
      }
    );
  }

  update(): void {
    console.log(this.cliente);
    // OPCIONAL SI YA ESTÁ EL "allowSetters = true" EN EL BACKEND. Asignamos las facturas como "null", ya que debe ser enviado este atributo, sin embargo no hará ninguna modificación
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(
      (response) => {
        Swal.fire({
          title: 'Cliente actualizado',
          text: `${response.mensaje} : ${response.cliente.nombre}`,
          icon: 'success',
          confirmButtonText: 'De acuerdo',
          timer: 3000,
        });

        this.router.navigate(['/clientes']);
      },
      //Segundo parámetro que contiene los mensajes de error
      //Asignamos los valores obtenidos del error a la variable local "this.errores", parseado en arreglo de strings "string[]"
      (err) => {
        this.errores = err.error.errors as string[];
        console.log('Codigo de error desde el backend: ' + err.status);
        console.log('err.error.errors: ' + err.error.errors);
      }
    );
  }
  /*
  Método que permite comprar 2 objetos que será usado en la vista.
  el primer parámetro representa la interación y el segundo el objeto es el que está asginado al cliente.
  Retornará un boolean
  */
  compararRegion(objeto1: Region, objeto2: Region): boolean {
    /*
    Esta función será exclusiva para EDITAR un cliente, ya que para crear será nulo en la condición.
    Primero comprarmos que cualquiera de los dos objetos sean nulo, de ser así retonarmos "false",
    caso contrario comparamos los "id" de los objetos, retornando "true" o  "false" en caso coincidan o no y seleccionamos el "id" que coincida
    */
    // Primera condición para seleccionar el primer "option" y muestra la selección con el mensaje "Seleccione una región"
    if (objeto1 === undefined && objeto2 === undefined) {
      return true;
    }
    return objeto1 === null ||
      objeto2 === null ||
      objeto1 === undefined ||
      objeto2 === undefined
      ? false
      : objeto1.id === objeto2.id;
  }
}
