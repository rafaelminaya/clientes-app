import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  // GETTERS
  get usuario() {
    return this.authService.usuario;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  // CONSTRUCTOR
  constructor(private authService: AuthService, private router: Router) {}

  // MÉTODOS
  ngOnInit(): void {}

  logout() {
    Swal.fire(
      'Logout',
      `Hola ${this.usuario.username} has cerrado sesión con éxito!`,
      'success'
    );

    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
