import { Component, OnInit } from '@angular/core';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { CurrencyPipe } from '@angular/common';
import { CartProduct } from '../shared/models/cart-product';
import { OrderService } from '../core/services/order.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CartProductComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  total: number = 0;
  orderLoading = false;
  orderSuccess = '';
  orderError = '';

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.updateCart();
  }

  updateCart() {
    const storagedProducts: CartProduct[] =
      JSON.parse(localStorage.getItem('cart-products') as string) || [];
    this.cartProducts = storagedProducts;
    if (this.cartProducts.length > 0) {
      this.total = this.cartProducts.reduce(
        (acc, val) => acc + val.product.price * val.quantity, 0
      );
    }
  }

  proceedToCheckout() {
    if (this.cartProducts.length === 0) return;

    this.orderLoading = true;
    this.orderError = '';
    this.orderSuccess = '';

    // Crée un order pour chaque produit du panier
    const orderRequests = this.cartProducts.map(cartProduct =>
      this.orderService.createOrder({
        userId: 1,   // à remplacer par l'userId connecté
        productId: Number(cartProduct.product.id),
        quantity: cartProduct.quantity,
        unitPrice: cartProduct.product.price
      })
    );

    forkJoin(orderRequests).subscribe({
      next: (orders) => {
        this.orderSuccess = `✅ ${orders.length} order(s) placed successfully!`;
        this.orderLoading = false;
        // Vider le panier
        localStorage.removeItem('cart-products');
        this.cartProducts = [];
        this.total = 0;
        // Rediriger vers orders après 2 secondes
        setTimeout(() => this.router.navigate(['/orders']), 2000);
      },
      error: () => {
        this.orderError = '❌ Failed to place orders. Please try again.';
        this.orderLoading = false;
      }
    });
  }
}