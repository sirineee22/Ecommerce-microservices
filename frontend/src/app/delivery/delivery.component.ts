import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../core/services/delivery.service';
import {
  Delivery,
  DeliveryRequest,
  DeliveryStatus,
} from '../shared/models/delivery';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.component.html',
})
export class DeliveryComponent implements OnInit {
  private deliveryService = inject(DeliveryService);

  deliveries: Delivery[] = [];
  loading = false;
  error: string | null = null;

  readonly statuses: DeliveryStatus[] = [
    'PENDING',
    'ASSIGNED',
    'IN_TRANSIT',
    'DELIVERED',
    'CANCELLED',
  ];

  form: DeliveryRequest = {
    orderId: 0,
    customerId: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    carrier: '',
    trackingNumber: '',
    estimatedDeliveryDate: '',
  };

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.loading = true;
    this.error = null;
    this.deliveryService.getAll().subscribe({
      next: (data) => {
        this.deliveries = data;
        this.loading = false;
      },
      error: () => {
        this.error =
          'Failed to load deliveries. Start delivery-service on port 8085: mvn spring-boot:run (profile h2 if needed).';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    this.error = null;
    this.deliveryService.create(this.form).subscribe({
      next: () => {
        this.resetForm();
        this.loadDeliveries();
      },
      error: (err) => {
        this.error = err?.error?.error || 'Failed to create delivery.';
      },
    });
  }

  onStatusChange(delivery: Delivery, status: DeliveryStatus): void {
    this.deliveryService.updateStatus(delivery.id, status).subscribe({
      next: () => this.loadDeliveries(),
      error: (err) => {
        this.error = err?.error?.error || 'Status change failed.';
      },
    });
  }

  onDelete(delivery: Delivery): void {
    if (!confirm(`Delete delivery #${delivery.id}?`)) {
      return;
    }
    this.deliveryService.delete(delivery.id).subscribe({
      next: () => this.loadDeliveries(),
      error: () => {
        this.error = 'Delete failed.';
      },
    });
  }

  private resetForm(): void {
    this.form = {
      orderId: 0,
      customerId: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      carrier: '',
      trackingNumber: '',
      estimatedDeliveryDate: '',
    };
  }
}
