import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Usuario } from '../usuarios/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
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
