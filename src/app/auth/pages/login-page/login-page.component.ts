import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthServiceService } from '../../services/auth-service.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent {

  private readonly router = inject(Router);

  constructor( private authService: AuthServiceService ) {}

  onLogin(): void {

    this.authService.login( 'euge@gmail.com', '123456' )
      .subscribe( user =>{
        this.router.navigate(['/'])
      });
  }
}
