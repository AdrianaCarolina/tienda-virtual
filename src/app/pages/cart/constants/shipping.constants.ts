export interface ShippingConfig {
  freeShippingThreshold: number;
  standardRate: number;
}

export const SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: 10,
  standardRate: 10,
};
