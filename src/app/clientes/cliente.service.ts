import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEnPoint: string = 'http://localhost:8080/api/clientes';
  
  //HttpHeaders : Clase que para añadir una cabecera a la petición que la necesite
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  /* 
  - Observable: Tipo de dato o clase que representa nuestro flujo reactivo.
  - of : método de construcción para crear/convertir/parsear a un tipo Observable.
  - Observable está basado en el "patrón de diseño observador", es decir, tenemos un "sujeto" que es "observable", 
   este caso el "Cliente" y el "observador" que está atento escuchando un posible cambio en el "sujeto".
  - Estos observadores se "suscriben" al sujeto que sería el "observable" y cuando cambia su estado se notifican a los observadores y se lanza algún tipo de proceso/evento.
  */
  getClientes() : Observable<Cliente[]> {

    /*
    - this.http.get<Cliente[]> : Ya tenemos a "this.http.get" como el tipo "Observable" a retornar, 
    pero de tipo genérico "any", así que le añdimos "<Cliente[]>" para parsearlo al tipo de dato exacto a retonar.
    - Un tipo "observable" siempre retornará dentro del cuerpo de la respuesta de su promesa un tipo "json", por defecto de tipo "any"
    */

    //return this.http.get<Cliente[]>(this.urlEnPoint);

    /*
    - Otra alternativa sería usando el operador "map" para convertir el tipo "json" a "Cliente[]"
    - pipe :  permite agregar más operadores
    */
    return this.http.get(this.urlEnPoint).pipe(
      map( (response) => response as Cliente[])
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEnPoint}/${cliente.id} `, cliente, {headers: this.httpHeaders})
  }
  
  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEnPoint, cliente, {headers: this.httpHeaders});
  }

  getCliente(id: number): Observable<Cliente> {    
    return this.http.get<Cliente>(`${this.urlEnPoint}/${id} `);
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEnPoint}/${id} `);
  }

  
}
