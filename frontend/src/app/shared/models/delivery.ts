export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Delivery {
  id: number;
  orderId: number;
  customerId: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryStatus: DeliveryStatus;
  carrier?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryRequest {
  orderId: number;
  customerId: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}
