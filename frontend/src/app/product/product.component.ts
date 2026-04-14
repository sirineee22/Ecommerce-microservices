import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '../shared/models/product';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { ProductService } from '../core/services/product.service';
import { CartProduct } from '../shared/models/cart-product';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';   // ← ajouter RouterLink
import { OrderService } from '../core/services/order.service';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, AsyncPipe, RouterLink],        // ← ajouter RouterLink ici
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  id = input<string>('');
  productService = inject(ProductService);
  orderService = inject(OrderService);
  router = inject(Router);
  product$!: Observable<Product | undefined>;

  orderSuccess = '';
  orderError = '';
  orderLoading = false;

  ngOnInit(): void {
    this.product$ = this.productService.getById(this.id());
  }

  addToCart(product: Product) {
    const cartProducts: CartProduct[] =
      JSON.parse(localStorage.getItem('cart-products') as string) || [];

    const matched = cartProducts.find(({ product: p }) => p.id === product.id);

    if (matched) {
      matched.quantity++;
    } else {
      cartProducts.push({ product, quantity: 1 });
    }
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
    this.router.navigate(['/cart']);
  }

  buyNow(product: Product) {
    this.orderLoading = true;
    this.orderSuccess = '';
    this.orderError = '';

    const order = {
      userId: 1,
      productId: Number(product.id),
      quantity: 1,
      unitPrice: product.price
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        this.orderSuccess = `✅ Order #${res.id} placed! Total: ${res.totalPrice} TND`;
        this.orderLoading = false;
      },
      error: () => {
        this.orderError = '❌ Failed to place order. Please try again.';
        this.orderLoading = false;
      }
    });
  }
}