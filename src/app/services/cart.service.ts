import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

/*export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'app_cart_v1';
  private _items$ = new BehaviorSubject<CartItem[]>(this.load() || []);
  readonly items$ = this._items$.asObservable();
  readonly count$ = this.items$.pipe();

  constructor() {
    this._items$.subscribe((items) => {
      localStorage.setItem(this.key, JSON.stringify(items));
    });
  }

  private load(): CartItem[] | null {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : null;
  }

  add(product: Product, quantity = 1) {
    const items = [...this._items$.value];
    const idx = items.findIndex((i) => i.product.id === product.id);
    if (idx >= 0) {
      items[idx].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this._items$.next(items);
  }

  remove(productId: number) {
    const items = this._items$.value.filter((i) => i.product.id !== productId);
    this._items$.next(items);
  }

  clear() {
    this._items$.next([]);
  }

  getCount(): number {
    return this._items$.value.reduce((s, i) => s + i.quantity, 0);
  }
}*/
