import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteOrderCommand } from '../commands/delete-order.command';
import { IOrderRepository,OrderStatus } from '@cms-project/order-domain';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler implements ICommandHandler<DeleteOrderCommand, void> {
  constructor(
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    const { orderId } = command;
    
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    
    // Can only delete orders in certain statuses
    if (![OrderStatus.PENDING, OrderStatus.CANCELLED].includes(order.getStatus())) {
      throw new BadRequestException(`Cannot delete order with status ${order.getStatus()}`);
    }
    
    await this.orderRepository.delete(orderId);
  }
}