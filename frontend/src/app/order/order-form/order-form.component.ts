import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { OrderService, OrderRequest } from '../../core/services/order.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent {
  order: OrderRequest = {
    userId: 1,
    productId: 0,
    quantity: 1
  };

  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private orderService: OrderService, private router: Router) {}

  submitOrder() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.orderService.createOrder(this.order).subscribe({
      next: (res) => {
        this.successMessage = `✅ Order #${res.id} placed! Total: $${res.totalPrice}`;
        this.loading = false;
      },
      error: (err) => {
        console.error('Order error:', err);
        this.errorMessage = '❌ Failed to place order. Please try again.';
        this.loading = false;
      }
    });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }
}