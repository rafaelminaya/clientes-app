import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modal: boolean = false;
  //atributo que almacena el estado de que la imagen ha sido modificada
  private _notificarUpload = new EventEmitter<any>();

  constructor() {}
  //Método get del atributo "_notificarUpload"
  get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }

  //Método para abrir el modal
  abrirModal(): void {
    this.modal = true;
  }
  //Método para cerar el modal
  cerrarModal(): void {
    this.modal = false;
  }
}
