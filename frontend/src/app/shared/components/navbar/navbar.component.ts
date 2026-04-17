import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { KeycloakService } from '../../../core/services/keycloak.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  keycloak = inject(KeycloakService);

  get isLoggedIn(): boolean {
    return this.keycloak.isAuthenticated();
  }

  get username(): string {
    return this.keycloak.getUsername();
  }

  login(): void {
    this.keycloak.login();
  }

  register(): void {
    this.keycloak.register();
  }

  logout(): void {
    this.keycloak.logout();
  }
}
