import { AggregateRoot } from '@nestjs/cqrs';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Order extends AggregateRoot {
  private readonly id: string;
  private customerId: string;
  private items: OrderItem[];
  private totalAmount: number;
  private status: OrderStatus;
  private paymentId: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(id: string) {
    super();
    this.id = id;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getPaymentId(): string {
    return this.paymentId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  // Methods
  updateStatus(status: OrderStatus) {
    this.status = status;
    this.updatedAt = new Date();
  }

  assignPayment(paymentId: string) {
    this.paymentId = paymentId;
    this.updatedAt = new Date();
  }

  // Factory method
  static create(id: string, customerId: string, items: OrderItem[]): Order {
    const order = new Order(id);
    order.customerId = customerId;
    order.items = items;
    order.totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    order.status = OrderStatus.PENDING;
    order.createdAt = new Date();
    order.updatedAt = new Date();
    return order;
  }

  // Reconstitution method
  static reconstitute(
    id: string,
    customerId: string,
    items: OrderItem[],
    status: OrderStatus,
    paymentId: string,
    createdAt: Date,
    updatedAt: Date
  ): Order {
    const order = new Order(id);
    order.customerId = customerId;
    order.items = items;
    order.totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    order.status = status;
    order.paymentId = paymentId;
    order.createdAt = createdAt;
    order.updatedAt = updatedAt;
    return order;
  }
}

export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: number
  ) {}

  getProductId(): string {
    return this.productId;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getQuantity(): number {
    return this.quantity;
  }
}
