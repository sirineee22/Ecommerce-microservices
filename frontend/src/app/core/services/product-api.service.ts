import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Product } from '../../shared/models/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  urlImg?: string;
  reviews?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<BackendProduct[]>(this.apiUrl)
      .pipe(
        map((backendProducts) =>
          backendProducts.map((p) => this.mapBackendProductToProduct(p))
        ),
        catchError(this.handleError)
      );
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.http.get<BackendProduct>(`${this.apiUrl}/${id}`).pipe(
      map((p) => {
        if (p) {
          return this.mapBackendProductToProduct(p);
        }
        return undefined;
      }),
      catchError(this.handleError)
    );
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http
      .post<BackendProduct>(this.apiUrl, this.mapProductToBackendProduct(product))
      .pipe(
        map((p) => this.mapBackendProductToProduct(p)),
        catchError(this.handleError)
      );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<BackendProduct>(`${this.apiUrl}/${id}`, this.mapProductToBackendProduct(product))
      .pipe(
        map((p) => this.mapBackendProductToProduct(p)),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private mapProductToBackendProduct(p: Partial<Product>): Partial<BackendProduct> {
    return {
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: 100,
      urlImg: p.urlImg,
      reviews: p.reviews,
    };
  }

  private mapBackendProductToProduct(p: BackendProduct): Product {
    return {
      id: p.id.toString(),
      name: p.name,
      description: p.description,
      urlImg: p.urlImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
      reviews: p.reviews || 0,
      price: p.price,
      previousPrice: null,
    };
  }
}
