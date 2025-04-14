import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../commands/create-order.command';
import { IOrderRepository, Order, OrderItem } from '@cms-project/order-domain';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(command: CreateOrderCommand): Promise<string> {
    const { customerId, items } = command;
    
    const orderItems = items.map(item => 
      new OrderItem(item.productId, item.name, item.price, item.quantity)
    );
    
    const orderId = uuidv4();
    const order = Order.create(orderId, customerId, orderItems);
    
    await this.orderRepository.save(order);
    
    return orderId;
  }
}