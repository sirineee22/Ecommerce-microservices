import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Delivery,
  DeliveryRequest,
  DeliveryStatus,
} from '../../shared/models/delivery';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8085/api/deliveries';

  getAll(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.baseUrl);
  }

  create(payload: DeliveryRequest): Observable<Delivery> {
    return this.http.post<Delivery>(this.baseUrl, payload);
  }

  update(id: number, payload: DeliveryRequest): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.baseUrl}/${id}`, payload);
  }

  updateStatus(id: number, status: DeliveryStatus): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
