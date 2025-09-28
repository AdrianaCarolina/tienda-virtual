import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  orders: Order[] = [];
  loading = true;
  userId: number = 1; // Simulación de usuario logueado

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrdersWithDetails();
  }

  // 🔥 LÓGICA MEJORADA: Carga todo de una vez
  loadOrdersWithDetails() {
    const orders$ = this.http.get<Order[]>(`http://localhost:3000/orders?userId=${this.userId}`);
    const orderDetails$ = this.http.get<OrderDetail[]>('http://localhost:3000/orderDetails');
    const products$ = this.http.get<any[]>('http://localhost:3000/products');

    // Carga paralela de todos los datos
    forkJoin({
      orders: orders$,
      orderDetails: orderDetails$,
      products: products$,
    }).subscribe({
      next: ({ orders, orderDetails, products }) => {
        // Mapea cada pedido con sus detalles y productos
        this.orders = orders.map((order) => ({
          ...order,
          details: this.getOrderDetails(order.id, orderDetails, products),
        }));

        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando pedidos:', error);
        this.loading = false;
      },
    });
  }

  // 🔥 MÉTODO MEJORADO DE KATERINE
  private getOrderDetails(
    orderId: number,
    orderDetails: OrderDetail[],
    products: any[]
  ): OrderDetail[] {
    return orderDetails
      .filter((od) => od.orderId === orderId)
      .map((od) => {
        const product = products.find((p) => p.id === od.productId);
        return {
          ...od,
          product: product,
        };
      });
  }

  // Métodos útiles para el template
  getTotalItems(order: Order): number {
    return order.details?.reduce((total, detail) => total + detail.quantity, 0) || 0;
  }

  getStatusText(status: string): string {
    return status === 'completed' ? 'Completado' : 'Pendiente';
  }

  getStatusIcon(status: string): string {
    return status === 'completed' ? 'fa-check-circle' : 'fa-clock';
  }

  getStatusClass(status: string): string {
    return status === 'completed' ? 'bg-success' : 'bg-warning';
  }
}
