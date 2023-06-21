import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'src/app/auth/interfaces/user.interface';
import { AuthServiceService } from 'src/app/auth/services/auth-service.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {

  private readonly router = inject(Router);

  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: './list' },
    { label: 'Añadir', icon: 'add', url: './new-hero' },
    { label: 'Buscar', icon: 'search', url: './search' }
  ];

  constructor( private authService: AuthServiceService ) {}

  get user(): User | undefined {
    return this.authService.currentUser;
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigate(['auth/login'])
  }
}
