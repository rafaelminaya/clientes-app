import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanLoad {
  // CONSTRUCTOR
  constructor(private authService: AuthService, private router: Router) {}

  // MÉTODOS
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Recibiremos información por medio de los parámetros del guard
    let role = route.data['role'] as string;
    console.log('RoleGuard', role);

    // Primero verificamos que estemos autenticados
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // verificamos que tengamos el rol correcto para la ruta (ROLE_ADMIN o ROLE_USER)
    if (this.authService.hasRole(role)) {
      return true;
    }

    Swal.fire(
      'Acceso denegado',
      `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`,
      'warning'
    );

    this.router.navigate(['/clientes']);

    return false;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Recibiremos información por medio de los parámetros del guard
    let role = route.data['role'] as string;
    console.log('RoleGuard', role);

    // Primero verificamos que estemos autenticados
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // verificamos que tengamos el rol correcto para la ruta (ROLE_ADMIN o ROLE_USER)
    if (this.authService.hasRole(role)) {
      return true;
    }

    Swal.fire(
      'Acceso denegado',
      `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`,
      'warning'
    );

    this.router.navigate(['/clientes']);

    return false;
  }
}
