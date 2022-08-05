import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit, OnChanges {
  //@Input() : Decorador para indicar que se recibirá un atributo de una clase padre, en este caso del componente de la vista del componente "ClientesComponent".
  @Input() paginador: any;
  paginas: number[] = [];

  //Atributos desde y hasta para manejar el piso y el techo del rango de la paginación
  desde: number;
  hasta: number;

  constructor() {}

  ngOnInit(): void {
    //Calculamos el rango solo para la primera página, los rangos par las sgtes. páginas serán recalculados en el "ngOnChanges"
    this.initPaginator();
  }

  /* - Usamos el método "ngOnChanges" ya que permite puede reaccionar a los cambios del atributo "paginador" obtenido  por el padre.
     - changes: SimpleChanges : Obtiene los cambios del atributo a indicar.
     Por medio del atributo "changes" podremos obtener los cambios del atributo "@Input() paginador: any" */
  ngOnChanges(changes: SimpleChanges): void {
    //changes['paginador'] : Manejamos de esta forma el atributo "paginador" ya que "changes" asgina los valor como parte de un arreglo, debido al tipo de dato "SimpleChanges"
    let paginadorACtualizado = changes['paginador'];

    //Verificamos si "paginadorACtualizado" tiene una valor/estado anterior
    //para llamar recien llamar a la función "initPaginator" que hace toda la paginación.
    if (paginadorACtualizado.previousValue) {
      this.initPaginator();
    }
  }

  //Esta es la función que que hará la paginación
  //Esta función obtiene los rangos que se puede utilizar tanto en el "ngOnInit()" y en el"ngOnChanges()"
  private initPaginator(): void {
    /* - El "this.desde" sería el mínimo entre dos valores, y el "this.hasta" sería el máximo tambien entre dos valores
       - "1" : Representa el mínimo valor que puede tener la página "desde"
       - this.paginador.number - 4 : Representa la página actual restado con 4
       - this.paginador.totalPages - 5 :Representa el taotl de páginas restado con 5
    */
    this.desde = Math.min(
      Math.max(1, this.paginador.number - 4),
      this.paginador.totalPages - 5
    );

    this.hasta = Math.max(
      Math.min(this.paginador.totalPages, this.paginador.number + 4),
      6
    );

    //Calculamos el desde y el hasta para cuando el total de páginas sea mayor a "5"

    if (this.paginador.totalPages > 5) {
      //this.hasta - this.desde + 1 : Cantidad de elementos que tendrá nuestro arreglo
      this.paginas = new Array(this.hasta - this.desde + 1)
        .fill(0)
        .map((valor, indice) => indice + this.desde);
    } else {
      /* - fill(): Función para llenar un arreglo con datos, en este caso estamos llenando todos los elementos con ceros "0".
         - map() : Función para manipular los datos de un arreglo, en este caso aumentando el indice inicial del arreglo en 1. 
         Esto para que el arreglo inicie en "1" y no en "0".
    */
      this.paginas = new Array(this.paginador.totalPages)
        .fill(0)
        .map((valor, indice) => indice + 1);
    }
  }
}
