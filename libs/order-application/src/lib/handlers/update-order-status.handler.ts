import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateOrderStatusCommand } from '../commands/update-order-status.command';
import { IOrderRepository, ORDER_REPOSITORY } from '@cms-project/order-domain';
import { Inject, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '@cms-project/infrastructure-db';

@CommandHandler(UpdateOrderStatusCommand)
export class UpdateOrderStatusHandler
  implements ICommandHandler<UpdateOrderStatusCommand, void>
{
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: OrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: UpdateOrderStatusCommand): Promise<void> {
    const { orderId, status } = command;
    console.log(orderId)
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
