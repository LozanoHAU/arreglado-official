import { Component, signal, inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = signal(false);
  error    = signal('');
  loading  = signal(false);

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  submit(): void {
    this.error.set('');
    if (!this.username.trim() || !this.password) {
      this.error.set('Please enter your username and password.');
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      const ok = this.auth.login(this.username.trim(), this.password);
      this.loading.set(false);
      if (ok) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.error.set('Incorrect username or password. Please try again.');
        this.password = '';
      }
    }, 600);
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this.submit();
  }
}
