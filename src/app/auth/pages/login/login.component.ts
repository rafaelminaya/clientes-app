import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  // PROPIEDADES
  titulo: string = 'Por favor inicia sesión!';
  usuario: Usuario;
  // CONSTRUCTOR
  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  // MÉTODOS
  ngOnInit(): void {
    // validmos de que si está autenticado redireccione al listado de clientes
    if (this.authService.isAuthenticated()) {
      Swal.fire(
        'Login',
        `Hola ${this.authService.usuario.username} ya estás autenticado!`,
        'info'
      );
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);

    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', 'Username o password vacias!', 'error');
    }

    this.authService.login(this.usuario).subscribe({
      next: (response) => {
        console.log('response', response);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardartoken(response.access_token);

        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes']);

        Swal.fire(
          'Login',
          `Hola ${usuario.username}, has inciado sesión con éxito!`,
          'success'
        );
      },
      error: (err) => {
        if (err.status == 400) {
          Swal.fire('Error Login', 'Username o clave incorrecta!', 'error');
        }
      },
    });
  }
}
