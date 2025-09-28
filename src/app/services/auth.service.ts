import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUser: any = null;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map((users) => {
        console.log('Login response:', users); // Add this line
        if (users.length) {
          this.currentUser = users[0];
          localStorage.setItem('user', JSON.stringify(this.currentUser));
          return this.currentUser;
        }
        return null;
      })
    );
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getUser() {
    if (!this.currentUser) {
      const user = localStorage.getItem('user');
      if (user) this.currentUser = JSON.parse(user);
    }
    return this.currentUser;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser = user;
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }

  public getCurrentUser() {
    return this.currentUser;
  }
}
