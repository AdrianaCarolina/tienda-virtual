interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: any;
}

interface Order {
  id: number;
  userId: number;
  date: string;
  status: string;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  details?: OrderDetail[];
}
