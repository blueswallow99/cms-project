import { OrderStatus } from '@cms-project/order-domain';

export class UpdateOrderStatusCommand {
  constructor(
    public readonly orderId: string,
    public readonly status: OrderStatus
  ) {}
}