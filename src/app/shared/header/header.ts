import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../pages/cart/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  readonly currentUser = this.authService.getCurrentUser();
  readonly cartItemCount = this.cartService.itemCount;

  isAdmin = computed(() => this.authService.isAdmin());

  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const user = this.currentUser;
    if (!user) return 'User';

    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0] + ' ' + names[1]).toUpperCase();
    }
    return user.name[0]?.toUpperCase() || 'User';
  }
}
