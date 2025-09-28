import { Injectable, signal } from '@angular/core';
import { ModalConfig } from '../models/modal.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalConfig = signal<ModalConfig | null>(null);
  private isVisible = signal(false);

  readonly config = this.modalConfig.asReadonly();
  readonly visible = this.isVisible.asReadonly();

  showSuccess(title: string, message: string, options?: Partial<ModalConfig>): void {
    this.show({
      type: 'success',
      title,
      message,
      ...options,
    });
  }

  showError(title: string, message: string, options?: Partial<ModalConfig>): void {
    this.show({
      type: 'error',
      title,
      message,
      ...options,
    });
  }

  showProductAdded(productName: string, data?: any): void {
    this.show({
      type: 'success',
      title: '¡Producto Agregado!',
      message: `${productName} se agregó correctamente al carrito`,
      showButtonsCart: true,
      data,
    });
  }

  private show(config: ModalConfig): void {
    this.modalConfig.set(config);
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }
}
