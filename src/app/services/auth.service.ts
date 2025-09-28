import { inject, Injectable, signal } from '@angular/core';
import { User, DBUser } from '../models/user.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/users';

  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  login(username?: string, password?: string): void {
    // Si ya hay usuario guardado y no se pasan credenciales, no hacer nada
    if (this._currentUser() && !username && !password) return;

    this.http.get<DBUser[]>(this.apiUrl).subscribe({
      next: (users) => {
        let dbUser: DBUser | undefined;

        if (username && password) {
          // Buscar usuario específico
          dbUser = users.find((u) => u.username === username && u.password === password);
        } else {
          // Auto-login con primer usuario si no se pasan credenciales
          dbUser = users[0];
        }

        if (dbUser) {
          const user: User = {
            id: dbUser.id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as 'client' | 'admin',
          };

          this._currentUser.set(user);
          localStorage.setItem('UserLogged', JSON.stringify(user));
          console.log(`Login exitoso: ${user.name} (${user.role})`);
        } else {
          console.error('Usuario o contraseña incorrectos');
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
      },
    });
  }

  getLoggedInUser(): User | null {
    return this._currentUser();
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('UserLogged');
  }

  canActivate(): boolean {
    const user = this._currentUser();
    if (!user) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === 'admin';
  }

  isClient(): boolean {
    return this._currentUser()?.role === 'client';
  }

  //para persistencia que no se pierda el usuario logeado
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('UserLogged');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        this._currentUser.set(user);
      } catch (error) {
        localStorage.removeItem('UserLogged');
      }
    }
  }

  constructor() {
    this.loadUserFromStorage();
  }
}
