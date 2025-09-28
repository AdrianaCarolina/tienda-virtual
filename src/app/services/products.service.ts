import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  private generateId(min = 1000, max = 999999): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  create(product: Product): Observable<Product> {
    const payload: Product = {
      ...product,
      categoryId: Number(product.categoryId),
    };

    if (!payload.id) {
      payload.id = this.generateId();
    }

    return this.http.post<Product>(this.base, payload).pipe(map((res) => res));
  }

  update(product: Product): Observable<Product> {
    if (!product.id) throw new Error('Product id required for update');
    const payload = { ...product, categoryId: Number(product.categoryId) };
    return this.http.put<Product>(`${this.base}/${product.id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
