import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { catchError, Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

// Este interceptor interceptará todas las peticiones, para manejar códigos de respuestas 401 y 403
// Es una simple clase que implementa la interfaz "HttpInterceptor"
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        // Validación de 401 (acceso no autorizado) o 403 (acceso prohibido)
        if (err.status == 401) {
          // Si el token ha expirado cerramos la sesion
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }

        if (err.status == 403) {
          Swal.fire(
            'Acceso denegado',
            `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`,
            'warning'
          );
          this.router.navigate(['/clientes']);
        }

        return throwError(() => err);
      })
    );
  }
}
