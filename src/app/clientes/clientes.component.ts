import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes!: Cliente[];
  
  // Inyección de dependencias.
  constructor(private  clienteService: ClienteService) { }

  ngOnInit(): void {

    this.clienteService.getClientes().subscribe(
      (res) => this.clientes = res
    );
    
  }

}
