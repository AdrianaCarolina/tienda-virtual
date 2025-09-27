import { inject, Injectable, signal } from '@angular/core';
import { MockUser } from '../models/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  // ✅ USUARIOS FAKE PARA TESTING
  private mockUsers: MockUser[] = [
    { id: '1', name: 'Juan Pérez', email: 'juan@test.com', role: 'client' },
    { id: '2', name: 'Ana García', email: 'ana@test.com', role: 'admin' },
    { id: '3', name: 'Carlos López', email: 'carlos@test.com', role: 'client' },
  ];

  private _currentUser = signal<MockUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  login() {
    //Todo: se tiene que implementar el compañero
    //Simulacion
    const user = this.mockUsers[1]; // en teoria aca llamaria al metodo de la peticion y si esta bien que se guarde el usurario

    if (user) {
      this._currentUser.set(user);
      localStorage.setItem('UserLogged', JSON.stringify(user));
    }
  }

  getLoggedInUser(): MockUser | null {
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
        const user: MockUser = JSON.parse(storedUser);
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
