import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem, CartSummary } from '../../../models/cart.interface';
import { SHIPPING_CONFIG } from '../constants/shipping.constants';
import { Product } from '../../../models/product.model';
import { ModalService } from '../../../services/modal.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  private modalService = inject(ModalService);

  readonly items = this.cartItems.asReadonly(); //TODO: no entiendo porque

  // - computed(): Se recalcula automáticamente cuando cartItems cambia
  // - reduce(): Suma todas las cantidades
  // - Ejemplo: 2 iPhone + 3 Samsung = itemCount: 5
  readonly itemCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  // - Suma el precio total de todos los productos
  // - item.product.price * item.quantity = subtotal por producto
  // - Ejemplo: (iPhone $800 × 2) + (Samsung $500 × 1) = $2100
  readonly subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  // - Si subtotal >= 100 → envío = $0 (gratis)
  // - Si subtotal < 100 → envío = $15
  // - Se recalcula automáticamente cuando cambia el subtotal
  readonly shipping = computed(() => {
    const subtotal = this.subtotal();
    return subtotal >= SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.standardRate;
  });

  // - Suma final: subtotal + envío + impuestos
  // - Ejemplo: $2100 + $0 + $336 = $2436
  readonly total = computed(() => this.subtotal() + this.shipping());

  // - Agrupa todos los cálculos en un objeto
  // - Los componentes usan: cartService.cartSummary()
  // - Se actualiza automáticamente cuando cambia cualquier valor
  readonly cartSummary = computed<CartSummary>(() => ({
    subTotal: this.subtotal(),
    shipping: this.shipping(),
    total: this.total(),
    itemCount: this.itemCount(),
  }));

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems().find((item) => item.product.id === product.id);
    if (existingItem) {
      this.updateQuantity(existingItem.idCartItem, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        idCartItem: this.generateId(),
        product,
        quantity,
      };

      this.cartItems.update((items) => [...items, newItem]);
    }
    this.saveCartToStorage();
    this.modalService.showProductAdded(product.name, { product, quantity });
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.cartItems.update((items) =>
      items.map((item) => (item.idCartItem === itemId ? { ...item, quantity: newQuantity } : item))
    );
    this.saveCartToStorage();
  }

  removeItem(itemId: number): void {
    this.cartItems.update((items) => items.filter((item) => item.idCartItem !== itemId));
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  increaseQuantity(itemId: number): void {
    const item = this.cartItems().find((item) => item.idCartItem === itemId);
    if (item) {
      this.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: number): void {
    const item = this.cartItems().find((item) => item.idCartItem === itemId);
    if (item && item.quantity > 1) {
      this.updateQuantity(itemId, item.quantity - 1);
    }
  }

  private generateId(): number {
    return Date.now() + Math.random();
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('shopping-cart', JSON.stringify(this.cartItems()));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('shopping-cart');
      if (saved) {
        try {
          const items = JSON.parse(saved);
          this.cartItems.set(items);
        } catch (error) {
          console.log('Error loading cart', error);
        }
      }
    }
  }
}
