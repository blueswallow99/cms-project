export enum OrderStatusDto {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class OrderItemDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export class OrderDto {
  id: string;
  customerId: string;
  items: OrderItemDto[];
  status: OrderStatusDto;
  totalAmount: number;
  paymentTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
