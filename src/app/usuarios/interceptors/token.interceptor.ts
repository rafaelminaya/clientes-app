import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

// Este interceptor interceptará todas las peticiones, siempre y cuando haya un token, agregando el token en la cabecera
// Es una simple clase que implementa la interfaz "HttpInterceptor"
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // obtenemos el token
    let token = this.authService.token;
    // Si hay token lo añadimos en la cabecera
    if (token != null) {
      // clonamos el request para devolverlo con las cabeceras del token
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });

      console.log('TokenInterceptor => Bearer ' + token);

      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
