import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    //Importamos el módulo de formularios de angular para el uso de la directiva [(ngModel)] en el template
    FormsModule,
    // Estos 4 módulos son para poder usar las diferentes etiquetas y atributos en el Template del "Autocomplete"
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule, // Permitirá usar el "FormComponent", el cual es usado para el auto complete
    // Mödulos de Angular material par  el calendario
    MatDatepickerModule,
    //MatNativeDateModule, // Este ya no será usado, será reemplazado por MatMomentDateModule
    // Módulo instalado de moment js
    MatMomentDateModule,
  ],
})
export class MaterialModule {}
