import { Component, inject } from '@angular/core';
import { CartService } from './services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);
  private router = inject(Router);

  readonly cartItems = this.cartService.items;
  readonly cartSummary = this.cartService.cartSummary;
  readonly itemCount = this.cartService.itemCount;

  addQuantity(itemId: number): void {
    this.cartService.increaseQuantity(itemId);
  }

  downQuantity(itemId: number): void {
    this.cartService.decreaseQuantity(itemId);
  }

  deleteItem(itemId: number): void {
    this.cartService.removeItem(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  continueShopping(): void {
    this.router.navigate(['/catalog']);
  }

  proceedToCheckout(): void {
    if (this.itemCount() > 0) {
      this.router.navigate(['/checkout']);
    }
  }

  //Todo: puedo crear un pipe para la moneda formatPrice
}
