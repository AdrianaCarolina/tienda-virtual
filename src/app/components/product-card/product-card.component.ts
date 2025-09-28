import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../pages/cart/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() categoryName?: string;
  @Output() add = new EventEmitter<Product>();

  private cartService = inject(CartService);

  onAdd() {
    this.cartService.addToCart(this.product);
  }
}
