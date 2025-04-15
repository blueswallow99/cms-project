import { Module } from '@nestjs/common';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { UpdateOrderStatusHandler } from './handlers/update-order-status.handler';
import { ProcessPaymentHandler } from './handlers/process-payment.handler';
import { DeleteOrderHandler } from './handlers/delete-order.handler';
import { GetOrderHandler } from './handlers/get-order.handler';
import { GetCustomerOrdersHandler } from './handlers/get-customer-orders.handler';
import { OrderMapper } from './mappers/order.mapper';
import { UpdateOrderStatusCommand } from './commands/update-order-status.command';
import { ProcessPaymentCommand } from './commands/process-payment.command';
import { DeleteOrderCommand } from './commands/delete-order.command';
import { CreateOrderHandler } from './handlers/create-order.handler';
import { ORDER_REPOSITORY } from '@cms-project/order-domain';
import { OrderItemEntity, OrderRepository } from '@cms-project/infrastructure-db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentApplicationModule } from '@cms-project/payment-application';
import { OrderEntity } from '@cms-project/infrastructure-db';

const CommandHandlers = [
  UpdateOrderStatusHandler,
  ProcessPaymentHandler,
  DeleteOrderHandler,
  GetOrderHandler,
  GetCustomerOrdersHandler,
  CreateOrderHandler,
];


@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
  PaymentApplicationModule,],
  providers: [
    ...CommandHandlers,
    OrderMapper,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
  ],
  exports: [CqrsModule, OrderMapper],
})
export class OrderApplicationModule {}