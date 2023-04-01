import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeES from '@angular/common/locales/es-PE';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { DirectivaComponent } from './directiva/directiva.component';
import { SharedModule } from './shared/shared.module';
//Configuramos globalmente el i18n de forma global para toda la aplicación.
registerLocaleData(localeES);

@NgModule({
  declarations: [AppComponent, DirectivaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //Importamos el módulo de peticiociones http de angular  para poder utilizarlo en la clase "ClienteService"
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
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
