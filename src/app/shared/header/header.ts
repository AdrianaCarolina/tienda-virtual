import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../pages/cart/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly cartItemCount = this.cartService.itemCount;

  isAdmin = computed(() => this.authService.isAdmin());

  logout(): void {
    this.authService.logout();
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'User';

    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0] + ' ' + names[1]).toUpperCase();
    }
    return user.name[0]?.toUpperCase() || 'User';
  }
}
