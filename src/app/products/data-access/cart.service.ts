import { Injectable, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<Product[]>([]);

  addToCart(product: Product) {
    this.cartItems.update(items => [...items, product]);
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  getCartItems() {
    return this.cartItems;
  }

  getCartItemCount() {
    return this.cartItems().length;
  }
}
