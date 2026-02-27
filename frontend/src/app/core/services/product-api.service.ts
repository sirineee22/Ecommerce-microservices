import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../../shared/models/product';
import { HttpClient } from '@angular/common/http';

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/** Taux USD → TND (FakeStore API retourne des prix en USD) */
const USD_TO_TND = 3.12;

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/products';

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiProduct[]>(this.apiUrl)
      .pipe(
        map((apiProducts) =>
          apiProducts.map((apiProduct) =>
            this.mapApiProductToProduct(apiProduct)
          )
        )
      );
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.http.get<ApiProduct>(`${this.apiUrl}/${id}`).pipe(
      map((apiProduct) => {
        if (apiProduct) {
          return this.mapApiProductToProduct(apiProduct);
        }
        return undefined;
      })
    );
  }

  private mapApiProductToProduct(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct.id.toString(),
      name: apiProduct.title,
      description: apiProduct.description,
      urlImg: apiProduct.image,
      reviews: apiProduct.rating.count,
      price: Math.round(apiProduct.price * USD_TO_TND * 100) / 100,
      previousPrice: null, // api
    };
  }
}
