import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartProduct } from '../shared/models/cart-product';
import { OrderService } from '../core/services/order.service';
import { KeycloakService } from '../core/services/keycloak.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private orderService = inject(OrderService);
  private keycloak = inject(KeycloakService);
  private router = inject(Router);

  cartProducts: CartProduct[] = [];
  total = 0;
  isLoading = false;
  orderSuccess = false;
  orderError = '';

  // Form fields
  firstName = '';
  lastName = '';
  email = '';
  address = '';
  city = '';

  ngOnInit(): void {
    const stored = localStorage.getItem('cart-products');
    this.cartProducts = stored ? JSON.parse(stored) : [];
    this.total = this.cartProducts.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    if (this.cartProducts.length === 0) {
      this.router.navigate(['/cart']);
    }

    // Pre-fill email from Keycloak if logged in
    if (this.keycloak.isAuthenticated()) {
      this.email = this.keycloak.getUsername();
    }
  }

  placeOrder(): void {
    if (!this.firstName || !this.lastName || !this.address || !this.city) {
      this.orderError = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.orderError = '';

    // Create one order per cart item
    const userId = 1; // default user id since auth is optional
    const orderRequests = this.cartProducts.map((item) =>
      this.orderService.createOrder({
        userId,
        productId: Number(item.product.id),
        quantity: item.quantity,
        unitPrice: item.product.price,
      })
    );

    forkJoin(orderRequests).subscribe({
      next: () => {
        // Clear cart
        localStorage.removeItem('cart-products');
        this.orderSuccess = true;
        this.isLoading = false;
        // Redirect to success page after 2s
        setTimeout(() => this.router.navigate(['/PaymentSuccess']), 2000);
      },
      error: (err) => {
        console.error('Order failed', err);
        this.orderError = 'Order failed. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
