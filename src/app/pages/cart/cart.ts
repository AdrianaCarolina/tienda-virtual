import { Component, inject, signal } from '@angular/core';
import { CartService } from './services/cart.service';
import { Router } from '@angular/router';
import { Checkout } from '../checkout/checkout';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [Checkout],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);
  private router = inject(Router);

  readonly cartItems = this.cartService.items;
  readonly cartSummary = this.cartService.cartSummary;
  readonly itemCount = this.cartService.itemCount;

  showCheckoutForm = signal(false);

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
      this.showCheckoutForm.set(true);
    }
  }

  onCheckoutSuccess() {
    this.showCheckoutForm.set(false);
    this.clearCart();
    this.router.navigate(['/orders']);
  }

  onCheckoutCancel() {
    this.showCheckoutForm.set(false);
  }

  //Todo: puedo crear un pipe para la moneda formatPrice
}
