import { LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { FormComponent } from './clientes/form.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas/facturas.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { LoginComponent } from './usuarios/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //Importamos el módulo de peticiociones http de angular  para poder utilizarlo en la clase "ClienteService"
    HttpClientModule,
    //Importamos el módulo de formularios de angular para el uso de formularios y poder usarlo en el "FormComponent"
    FormsModule,

    BrowserAnimationsModule,
    // Estos 4 módulos son para poder usar las diferentes etiquetas y atributos en el Template del "Autocomplete"
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    // Mödulos de Angular material par  el calendario
    MatDatepickerModule,
    //MatNativeDateModule, // Este ya no será usado, será reemplazado por MatMomentDateModule
    // Módulo instalado de moment js
    MatMomentDateModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-PE' },
    // De esta forma proveemos al interceptor "TokenInterceptor"
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // De esta forma proveemos al interceptor "AuthInterceptor"
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
