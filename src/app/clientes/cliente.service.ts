import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // Observable: Tipo de dato o clase que representa nuestro flujo reactivo.
  // of : método de construcción para crear/convertir/parsear a un tipo Observable
  // Observable está basado en el "patrón de diseño observador", es decir, 
  // tenemos un "sujeto" que es "observable", este caso el "Cliente" y el "observador" que está atento escuchando un posible cambio en el "sujeto".
  // Estos observadores se "suscriben" al sujeto que sería el "observable" y cuando cambia su estado se notifican a los observadores y se lanza algún tipo de proceso/evento.
  getClientes() : Observable<Cliente[]> {
    return of(CLIENTES);
  }

  constructor() { }
}
