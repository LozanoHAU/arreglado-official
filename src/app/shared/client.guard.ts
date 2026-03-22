import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const clientGuard: CanActivateFn = () => {
  // Always log out the admin when visiting client-side routes
  inject(AuthService).logout();
  return true;
};
