import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderRequest {
  userId: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.orderApiUrl;

  constructor(private http: HttpClient) {}

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, order);
  }

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiUrl);
  }
}