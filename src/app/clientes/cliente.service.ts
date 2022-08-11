import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Cliente } from './cliente';
//import { CLIENTES } from './clientes.json';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { Region } from './region';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEnPoint: string = 'http://localhost:8080/api/clientes';

  //HttpHeaders : Clase que para añadir una cabecera a la petición que la necesite
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEnPoint + '/regiones');
  }

  //1° Opción con paginación, que es la que usaremos en adelante
  getClientesPagination(page: number): Observable<any> {
    return this.http.get(this.urlEnPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap1');
        //response.content : Este atributo "content" almacena los datos a mostrar de la páginación
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
      }),
      tap((response) => {
        console.log('ClienteService: tap2');

        //Iteramos e imprimimos la respuesta hasta ahora obtenida
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      })
    );
  }
  /* 
  - 2° Opción que es la lista sin paginar, la cual ya no usaremos.
  - Observable: Tipo de dato o clase que representa nuestro flujo reactivo.
  - of : método de construcción para crear/convertir/parsear a un tipo Observable.
  - Observable está basado en el "patrón de diseño observador", es decir, tenemos un "sujeto" que es "observable", 
   este caso el "Cliente" y el "observador" que está atento escuchando un posible cambio en el "sujeto".
  - Estos observadores se "suscriben" al sujeto que sería el "observable" y cuando cambia su estado se notifican a los observadores y se lanza algún tipo de proceso/evento.
  */
  getClientes(): Observable<Cliente[]> {
    /* - this.http.get<Cliente[]> : Ya tenemos a "this.http.get" como el tipo "Observable" a retornar, 
         pero de tipo genérico "any", así que le añdimos "<Cliente[]>" para parsearlo al tipo de dato exacto a retornar.
       - Un tipo "observable" siempre retornará dentro del cuerpo de la respuesta de su promesa un tipo "json", por defecto de tipo "any" */

    //return this.http.get<Cliente[]>(this.urlEnPoint);

    /* - Otra alternativa sería usando el operador "map" para convertir el tipo "json" a "Cliente[]"
       - pipe :  Permite agregar más operadores
       - of: Operador que puede convertir un listado a Observable
       - map : Operador "rxjs" que permite transformar la respuesta del servidor. En este caso, nuestro  todo el "response" lo parsea a tipo "cliente[]" 
       - tap : Operador que permite realizar algún tipo de tarea sin manipular la información a retornar, ya que es un tipo "void" que no retorna un valor. */
    return this.http.get(this.urlEnPoint).pipe(
      tap((response: any) => {
        let clientes = response as Cliente[];

        console.log('ClienteService: tap1');

        //Iteramos e imprimimos la respuesta hasta ahora obtenida
        clientes.forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      //map( (response) => response as Cliente[])
      map((response) => {
        /*Esta función, importada de angular permite que el constructor "DatePipe('es')" más abajo funcione en español, 
         de lo contrario seía solo en inlgés con "DatePipe('en_US');"
         Enviamos esta función con al "app-routing.modules.ts" para su uso global*/
        //registerLocaleData(localeES, 'es');

        let clientes = response as Cliente[];

        //retornamos el array de clientes
        return clientes.map((cliente) => {
          //Iteramos y retornamos el cliente con su nombre en mayúsculas.
          cliente.nombre = cliente.nombre.toUpperCase();

          //FORMATO PARA FECHAS DESDE EL SERVICE
          //DatePipe('es') : Función importada de angular para que lo fecha salga en español y no en inglés que es por defecto.
          //let datePipe = new DatePipe('es');

          /* 1° Opción para formato de fecha
             - formatDate() : Función para formatear la fecha desde un observable
             - 'dd-MM-yyyy' : Formato de fecha, también puede ser en dígitos, palabras, etc
             - 'en-US' : Este sería el "Locate estándar". */
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');

          // 2° Opción para formato de fecha, necesita modificar el archivo "tsconfig.json" para funcionar.
          // cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy');

          /* EEEE : Nombre del día de la semana conpleto, EEE: Nombre del día de la semana abreviado
             MMMM : Nombre del mes conpleto, MMM: Nombre del mes abreviado
             Se podría separar el formato por comas, slash, espacios, guiamos, etc:  EEEE dd/MMMM/yyyy */

          // cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');

          return cliente;
        });
      }),
      tap((response) => {
        console.log('ClienteService: tap2');

        //Iteramos e imprimimos la respuesta hasta ahora obtenida
        response.forEach((cliente) => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  //1° Opción de manipular el response del backend, usando el operador "map()"
  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEnPoint, cliente, { headers: this.httpHeaders })
      .pipe(
        //map : Transformamos la respuesta, primero indicar que es de tipo "any" (ya que tendremos 2 objetos en la respuesta) y parsemos uno de ellos a tipo "Cliente"
        map((response: any) => response.cliente as Cliente),
        catchError((err) => {
          //obtener y trabajar las validaciones/errores del backend
          if (err.status == 400) {
            return throwError(() => err);
          }

          console.log(err.error.mensaje);

          Swal.fire(err.error.mensaje, err.error.error, 'error');

          return throwError(() => err);
        })
      );
  }

  //2° Opción de manipular el response del backend, usando el tipo de dato "any"
  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(`${this.urlEnPoint}/${cliente.id} `, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((err) => {
          if (err.status == 400) {
            return throwError(() => err);
          }

          console.log(err.error.mensaje);

          Swal.fire(err.error.mensaje, err.error.error, 'error');

          return throwError(() => err);
        })
      );
  }

  getCliente(id: number): Observable<Cliente> {
    /* - catchError : Este operador de "rxjs" se encarga de intercepetar el Observable, intercepta el flujo, en busca de fallos, 
         si falla obtiene el error dentro de una función de flecha, para poder manejarlo.
       - pipe : Sirve para poder contener a todos los operadorre del flujo. */
    return this.http.get<Cliente>(`${this.urlEnPoint}/${id}`).pipe(
      catchError((err) => {
        //Al fallar en obtener un cliente, redireccionamos de nuevo al listado.
        this.router.navigate(['/clientes']);

        console.log(err.error.mensaje);

        //err.error : la palabra "error" es un atributo necesario a utilizar para obtener la información del error recibido por el backend.
        Swal.fire('Error al editar', err.error.mensaje, 'error');
        //throwError : Operador necesario para poder lanzar el error y de tipo Observable, ya que la función "getCliente" es de tipo Observable
        return throwError(() => err);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEnPoint}/${id} `).pipe(
      catchError((err) => {
        console.log(err.error.mensaje);
        Swal.fire(err.error.mensaje, err.error.error, 'error');
        return throwError(() => err);
      })
    );
  }

  subirFoto(archivo: File, id: any): Observable<HttpEvent<{}>> {
    /* - FormData: 
       Clase propia de JS que tiene soporte "multipart/form-data" para enviar archivos(una foto en este caso)
       Utiliza el mismo formato que usaría un formulario si el tipo de codificación fuera "multipart/form-data
       Usar este objeto sería simlar a obtener un objeto del sgte. elemento html: "<form enctype="multiparty/form-data" method=post "
    */
    let formData = new FormData();
    //append() : Añade campos a la instancia del "formData()" usando la notación llave y valor
    formData.append('archivo', archivo);
    formData.append('id', id);

    //La respuesta será de tipo "HttpEventType", necesario para controlar el diseño de una barra de progreso
    const req = new HttpRequest('POST', `${this.urlEnPoint}/upload`, formData, {
      reportProgress: true,
    });

    //No necesitará un método "pipe()" puesto que ya no retornará un "Observable<Cliente>" sino un "Observable<HttpEvent>"
    //request() : Función que hace la petición y retorna un tipo "HttpEvent"
    return this.http.request(req);
  }
}
