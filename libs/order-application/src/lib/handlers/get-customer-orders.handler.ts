import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetCustomerOrdersQuery } from '../queries/get-customer-orders.query';
import { IOrderRepository, ORDER_REPOSITORY } from '@cms-project/order-domain';
import { OrderDto } from '../dtos/order.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderRepository } from '@cms-project/infrastructure-db';
import { Inject } from '@nestjs/common';

@QueryHandler(GetCustomerOrdersQuery)
export class GetCustomerOrdersHandler
  implements IQueryHandler<GetCustomerOrdersQuery, OrderDto[]>
{
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: OrderRepository,
    private readonly orderMapper: OrderMapper
  ) {}

  async execute(query: GetCustomerOrdersQuery): Promise<OrderDto[]> {
    const { customerId, page, pageSize } = query;

    const orders = await this.orderRepository.findByCustomerId(customerId);

    const paginatedOrders = orders.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    return paginatedOrders.map((order) => this.orderMapper.toDto(order));
  }
}
