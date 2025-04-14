import { OrderItem } from '@cms-project/order-domain';

export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: OrderItem[],
  ) {}
}