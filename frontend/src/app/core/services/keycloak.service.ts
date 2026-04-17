import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      });
      return authenticated;
    } catch (error) {
      console.error('Keycloak init failed', error);
      return false;
    }
  }

  login(): void {
    this.keycloak.login();
  }

  register(): void {
    this.keycloak.register();
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async getValidToken(): Promise<string | undefined> {
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token;
    } catch {
      this.login();
      return undefined;
    }
  }
}
