import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEnPoint: string = 'http://localhost:8080/api/clientes';
  
  //HttpHeaders : Clase que para añadir una cabecera a la petición que la necesite
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  /* 
  - Observable: Tipo de dato o clase que representa nuestro flujo reactivo.
  - of : método de construcción para crear/convertir/parsear a un tipo Observable.
  - Observable está basado en el "patrón de diseño observador", es decir, tenemos un "sujeto" que es "observable", 
   este caso el "Cliente" y el "observador" que está atento escuchando un posible cambio en el "sujeto".
  - Estos observadores se "suscriben" al sujeto que sería el "observable" y cuando cambia su estado se notifican a los observadores y se lanza algún tipo de proceso/evento.
  */
  getClientes() : Observable<Cliente[]> {

    /* - this.http.get<Cliente[]> : Ya tenemos a "this.http.get" como el tipo "Observable" a retornar, 
         pero de tipo genérico "any", así que le añdimos "<Cliente[]>" para parsearlo al tipo de dato exacto a retonar.
       - Un tipo "observable" siempre retornará dentro del cuerpo de la respuesta de su promesa un tipo "json", por defecto de tipo "any" */

    //return this.http.get<Cliente[]>(this.urlEnPoint);

    /* - Otra alternativa sería usando el operador "map" para convertir el tipo "json" a "Cliente[]"
       - pipe :  permite agregar más operadores
       - of: Operador que puede convertir un listado a Observable
       - map : operador "rxjs" que permite transformar la respuesta del servidor. En este caso, nuestro  todo el "response" lo parsea a tipo "cliente[]" */
    return this.http.get(this.urlEnPoint)
    .pipe(
      map( (response) => response as Cliente[])
    );
  }
  
  //1° Opción de manipular el response del backend, usando el operador "map()"
  create(cliente: Cliente) : Observable<Cliente>{

    return this.http.post(this.urlEnPoint, cliente, {headers: this.httpHeaders})
    .pipe(
      //map : Transformamos la respuesta, primero indicar que es de tipo "any" (ya que tendremos 2 objetos en la respuesta) y parsemos uno de ellos a tipo "Cliente"
      map( (response: any) => response.cliente as Cliente),
      catchError(err => {

        //obtener y trabajar las validaciones/errores del backend
        if(err.status == 400){
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
    return this.http.put<any>(`${this.urlEnPoint}/${cliente.id} `, cliente, {headers: this.httpHeaders})
    .pipe(
      catchError(err => {

        if(err.status == 400){
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
    return this.http.get<Cliente>(`${this.urlEnPoint}/${id}`)
    .pipe(

      catchError(err => {
        //Al fallar en obtener un cliente, redireccionamos de nuevo al listado.
        this.router.navigate(['/clientes']);
        console.log("err.error.mensaje");
        console.log(err.error.mensaje);

        //err.error : la palabra "error" es un atributo necesario a utilizar para obtener la información del error recibido por el backend.
        Swal.fire('Error al editar', err.error.mensaje, 'error');
        //throwError : Operador necesario para poder lanzar el error y de tipo Observable, ya que la función "getCliente" es de tipo Observable        
        return throwError(() => err);
        
      })
    );
  }


  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEnPoint}/${id} `)
    .pipe(

      catchError( err => {
        console.log(err.error.mensaje);
        Swal.fire(err.error.mensaje, err.error.error, 'error');
        return throwError(() => err)
      })

    );
  }

  
}
