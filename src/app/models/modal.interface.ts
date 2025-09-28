export type ModalType = 'success' | 'error' | 'warning' | 'info';

export interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  showButtonsCart?: boolean;
  data?: any;
}
