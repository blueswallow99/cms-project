import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteOrderCommand } from '../commands/delete-order.command';
import { IOrderRepository,ORDER_REPOSITORY,OrderStatus } from '@cms-project/order-domain';
import { NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { OrderRepository} from '@cms-project/infrastructure-db'

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler implements ICommandHandler<DeleteOrderCommand, void> {
  constructor(
    @Inject(ORDER_REPOSITORY)
  private orderRepository: OrderRepository,
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