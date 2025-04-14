import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateOrderStatusCommand } from '../commands/update-order-status.command';
import { IOrderRepository } from '@cms-project/order-domain';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateOrderStatusCommand)
export class UpdateOrderStatusHandler implements ICommandHandler<UpdateOrderStatusCommand, void> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: UpdateOrderStatusCommand): Promise<void> {
    const { orderId, status } = command;
    
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    
    const orderAggregate = this.eventPublisher.mergeObjectContext(order);
    orderAggregate.updateStatus(status);
    
    await this.orderRepository.update(orderAggregate);
    
    orderAggregate.commit();
  }
}