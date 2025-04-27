import { Component, inject } from '@angular/core';
import { CartService } from '../../data-access/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DialogModule, BadgeModule, ButtonModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  private cartService = inject(CartService);
  showCart = false;

  cartItems = this.cartService.getCartItems();

  get cartItemCount() {
    return this.cartItems().length;
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
