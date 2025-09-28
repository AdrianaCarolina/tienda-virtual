import { Product } from './product.model';

export interface CartItem {
  idCartItem: number;
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subTotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}
