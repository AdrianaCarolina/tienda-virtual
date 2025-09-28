import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order.html',
  styleUrl: './admin-order.css',
})
export class AdminOrder {
  orders: Order[] = [];
  users: User[] = [];
  orderDetails: OrderDetail[] = [];
  products: any[] = [];

  // Estado UI
  loading = true;
  selectedOrder: Order | null = null;
  selectedOrderDetails: OrderDetail[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAllData();
  }

  // 🔥 CARGA TODOS LOS DATOS
  loadAllData() {
    this.loading = true;

    const orders$ = this.http.get<Order[]>('http://localhost:3000/orders');
    const users$ = this.http.get<User[]>('http://localhost:3000/users');
    const orderDetails$ = this.http.get<OrderDetail[]>('http://localhost:3000/orderDetails');
    const products$ = this.http.get<any[]>('http://localhost:3000/products');

    forkJoin({
      orders: orders$,
      users: users$,
      orderDetails: orderDetails$,
      products: products$,
    }).subscribe({
      next: ({ orders, users, orderDetails, products }) => {
        this.orders = orders.sort((a, b) => b.id - a.id); // Más recientes primero
        this.users = users;
        this.orderDetails = orderDetails;
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.loading = false;
      },
    });
  }

  // 👤 OBTENER NOMBRE DE USUARIO
  getUserName(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.name : `Usuario ${userId}`;
  }

  // 🎨 MÉTODOS PARA ESTILOS
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'fa-check-circle';
      case 'pending':
        return 'fa-clock';
      case 'cancelled':
        return 'fa-times-circle';
      default:
        return 'fa-question-circle';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  // ⚡ TOGGLE STATUS
  toggleOrderStatus(order: Order) {
    const newStatus = order.status === 'pending' ? 'completed' : 'pending';
    this.updateOrderStatus(order, newStatus);
  }

  updateOrderStatus(order: Order, newStatus: string) {
    const updatedOrder = { ...order, status: newStatus };

    this.http.put(`http://localhost:3000/orders/${order.id}`, updatedOrder).subscribe({
      next: () => {
        // Actualizar en la lista local
        const index = this.orders.findIndex((o) => o.id === order.id);
        if (index !== -1) {
          this.orders[index].status = newStatus;
        }

        alert(`Pedido #${order.id} marcado como ${this.getStatusText(newStatus)}`);
      },
      error: (error) => {
        console.error('Error actualizando pedido:', error);
        alert('Error al actualizar el pedido');
      },
    });
  }

  // 👁️ VER DETALLES DEL PEDIDO
  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.selectedOrderDetails = this.getOrderDetails(order.id);

    // Mostrar modal (Bootstrap)
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  getOrderDetails(orderId: number): OrderDetail[] {
    return this.orderDetails
      .filter((od) => od.orderId === orderId)
      .map((od) => {
        const product = this.products.find((p) => p.id === od.productId);
        return { ...od, product };
      });
  }

  // 🔄 REFRESCAR DATOS
  refreshOrders() {
    this.loadAllData();
  }
}
