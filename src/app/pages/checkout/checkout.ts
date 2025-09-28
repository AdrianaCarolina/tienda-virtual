import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckoutData } from '../../models/checkout.interface';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  @Input() cartTotal: number = 0;
  @Input() cartItems: any[] = [];
  @Output() checkoutSuccess = new EventEmitter<void>();
  @Output() checkoutCancel = new EventEmitter<void>();

  checkoutData: CheckoutData = {
    name: '',
    address: '',
    paymentMethod: '',
    cardNumber: '',
  };

  constructor(private http: HttpClient) {}

  //LÓGICA MEJORADA DE KATERINE

  checkout() {
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    if (!this.isCheckoutValid()) {
      alert('Por favor, completa todos los datos de pago.');
      return;
    }

    // Crear el pedido principal (igual que Katerine)
    const userId = 1; // O el usuario logueado
    const order = {
      userId,
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      total: this.cartTotal,
      shippingAddress: this.checkoutData.address,
      paymentMethod: this.checkoutData.paymentMethod,
    };

    // 1. Crear el pedido
    this.http.post<any>('http://localhost:3001/orders', order).subscribe({
      next: (newOrder) => {
        // 2. Crear los detalles del pedido (como Katerine)
        this.createOrderDetails(newOrder.id);
      },
      error: (error) => {
        console.error('Error creando orden:', error);
        alert('Error al procesar el pedido');
      },
    });
  }

  // 🔥 MÉTODO DE KATERINE PARA CREAR DETALLES
  private createOrderDetails(orderId: number) {
    const details = this.cartItems.map((item) => ({
      orderId: orderId,
      productId: item.product?.id ?? item.id ?? item.productId,
      quantity: item.quantity,
      price: item.product?.price ?? item.price,
    }));

    let created = 0;
    details.forEach((detail) => {
      this.http.post('http://localhost:3001/orderDetails', detail).subscribe({
        next: () => {
          created++;
          if (created === details.length) {
            // Todos los detalles creados exitosamente
            alert('Compra realizada exitosamente.');
            this.resetForm();
            this.checkoutSuccess.emit();
          }
        },
        error: (error) => {
          console.error('Error creando detalle:', error);
        },
      });
    });
  }

  isCheckoutValid(): boolean {
    return !!(
      this.checkoutData.name &&
      this.checkoutData.address &&
      this.checkoutData.paymentMethod &&
      (this.checkoutData.paymentMethod !== 'Tarjeta de crédito' || this.checkoutData.cardNumber)
    );
  }

  cancelCheckout() {
    this.resetForm();
    this.checkoutCancel.emit();
  }

  private resetForm() {
    this.checkoutData = {
      name: '',
      address: '',
      paymentMethod: '',
      cardNumber: '',
    };
  }
}
