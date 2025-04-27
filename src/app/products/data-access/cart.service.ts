import { Injectable, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';

interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
        return [...items];
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, change: number) {
    this.cartItems.update(items => {
      const item = items.find(i => i.product.id === productId);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          return items.filter(i => i.product.id !== productId);
        }
      }
      return [...items];
    });
  }

  getCartItems() {
    return this.cartItems;
  }

  getTotalItems() {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getProductQuantity(productId: number): number {
    const item = this.cartItems().find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }
}
