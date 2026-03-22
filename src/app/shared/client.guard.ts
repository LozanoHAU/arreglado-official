import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const clientGuard: CanActivateFn = () => {

  inject(AuthService).logout();
  return true;
};
