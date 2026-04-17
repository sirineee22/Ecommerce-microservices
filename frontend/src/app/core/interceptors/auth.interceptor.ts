import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { KeycloakService } from '../services/keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);

  if (!keycloak.isAuthenticated()) {
    return next(req);
  }

  return from(keycloak.getValidToken()).pipe(
    switchMap((token) => {
      if (token) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
