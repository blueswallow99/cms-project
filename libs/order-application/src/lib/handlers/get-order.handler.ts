import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from '../queries/get-order.query';
import { IOrderRepository, ORDER_REPOSITORY } from '@cms-project/order-domain';
import { Inject, NotFoundException } from '@nestjs/common';
import { OrderDto } from '../dtos/order.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderRepository } from '@cms-project/infrastructure-db';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, OrderDto> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: OrderRepository,
    private readonly orderMapper: OrderMapper
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderDto> {
    const { orderId } = query;

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.orderMapper.toDto(order);
  }
}
