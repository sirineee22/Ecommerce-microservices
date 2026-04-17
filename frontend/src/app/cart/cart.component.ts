import { Component, OnInit } from '@angular/core';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { CurrencyPipe } from '@angular/common';
import { CartProduct } from '../shared/models/cart-product';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CartProductComponent, CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  total: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCart();
  }

  updateCart() {
    const storagedProducts: CartProduct[] =
      JSON.parse(localStorage.getItem('cart-products') as string) || [];
    this.cartProducts = storagedProducts;
    if (this.cartProducts.length > 0) {
      this.total = this.cartProducts.reduce(
        (acc, val) => acc + val.product.price * val.quantity,
        0
      );
    } else {
      this.total = 0;
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
