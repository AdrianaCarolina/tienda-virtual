import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CartService } from '../../pages/cart/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  private modalService = inject(ModalService);
  private cartService = inject(CartService);
  private router = inject(Router);

  readonly isVisible = this.modalService.visible;
  readonly config = this.modalService.config;
  readonly cartItemCount = this.cartService.itemCount;

  ngOnInit() {
    debugger;
    console.log('🎬 ReusableModal ngOnInit ejecutado'); // ← DEBUG
    console.log('🔍 Initial isVisible:', this.isVisible()); // ← DEBUG
    console.log('🔍 Initial config:', this.config()); // ← DEBUG
  }

  closeModal(): void {
    this.modalService.hide();
  }

  continueShopping(): void {
    this.modalService.hide();
  }

  goToCart(): void {
    this.modalService.hide();
    this.router.navigate(['/cart']);
  }

  getModalClass(): string {
    const config = this.config();
    if (!config) return '';

    return `modal-${config.type}`;
  }

  getIcon(): string {
    const config = this.config();
    if (!config) return '';
    switch (config.type) {
      case 'success':
        return 'bi bi-check-circle';
      case 'error':
        return 'bi bi-exclamation-circle-fill';
      default:
        return 'bi bi-info-circle-fill';
    }
  }
}
