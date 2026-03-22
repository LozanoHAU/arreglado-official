import { Injectable, signal } from '@angular/core';

const CREDENTIALS = { username: 'kapitan', password: 'pandacaqui' };
const SESSION_KEY = 'ar_admin_session';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _isLoggedIn = signal(
    sessionStorage.getItem(SESSION_KEY) === '1'
  );

  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  login(username: string, password: string): boolean {
    if (username.trim() === CREDENTIALS.username && password === CREDENTIALS.password) {
      sessionStorage.setItem(SESSION_KEY, '1');
      this._isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this._isLoggedIn.set(false);
  }
}
