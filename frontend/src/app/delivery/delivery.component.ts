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

  /** When set, the left form updates this delivery instead of creating a new one. */
  editingDeliveryId: number | null = null;

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
    if (this.editingDeliveryId != null) {
      this.deliveryService.update(this.editingDeliveryId, this.form).subscribe({
        next: () => {
          this.cancelEdit();
          this.loadDeliveries();
        },
        error: (err) => {
          this.error = err?.error?.error || 'Failed to update delivery.';
        },
      });
      return;
    }
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

  startEdit(d: Delivery): void {
    this.error = null;
    this.editingDeliveryId = d.id;
    this.form = {
      orderId: d.orderId,
      customerId: d.customerId,
      address: d.address,
      city: d.city,
      postalCode: d.postalCode,
      country: d.country,
      carrier: d.carrier ?? '',
      trackingNumber: d.trackingNumber ?? '',
      estimatedDeliveryDate: d.estimatedDeliveryDate
        ? d.estimatedDeliveryDate.slice(0, 10)
        : '',
    };
  }

  cancelEdit(): void {
    this.editingDeliveryId = null;
    this.resetForm();
  }

  /** Same rules as the backend DeliveryService status transitions. */
  allowedNextStatuses(current: DeliveryStatus): DeliveryStatus[] {
    switch (current) {
      case 'PENDING':
        return ['ASSIGNED', 'CANCELLED'];
      case 'ASSIGNED':
        return ['IN_TRANSIT', 'CANCELLED'];
      case 'IN_TRANSIT':
        return ['DELIVERED'];
      default:
        return [];
    }
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
    this.editingDeliveryId = null;
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
