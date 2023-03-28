import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    console.log('AuthGuard', route.data);

    if (this.authService.isAuthenticated()) {
      // verificamos que el token no haay expirado
      if (this.isTokenExpirado()) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }

  // Método para validar que el token no haya expirado
  isTokenExpirado(): boolean {
    let token = this.authService.token;
    let payload = this.authService.obtenerPayload(token);
    // Obtenemos la fecha actual en segundos
    let now = new Date().getTime() / 1000;
    // verificamos que el token no haay expirado
    if (payload.exp < now) {
      return true;
    }
    return false;
  }
}
