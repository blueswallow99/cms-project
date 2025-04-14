import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateOrderStatusHandler } from './handlers/update-order-status.handler';
import { ProcessPaymentHandler } from './handlers/process-payment.handler';
import { DeleteOrderHandler } from './handlers/delete-order.handler';
import { GetOrderHandler } from './handlers/get-order.handler';
import { GetCustomerOrdersHandler } from './handlers/get-customer-orders.handler';
import { OrderMapper } from './mappers/order.mapper';
import { UpdateOrderStatusCommand } from './commands/update-order-status.command';
import { ProcessPaymentCommand } from './commands/process-payment.command';
import { DeleteOrderCommand } from './commands/delete-order.command';

// const CommandHandlers = [
//   UpdateOrderStatusCommand,
//   ProcessPaymentCommand,
//   DeleteOrderCommand,
// ];

// const QueryHandlers = [
//   GetOrderHandler,
//   GetCustomerOrdersHandler,
// ];

@Module({
  imports: [CqrsModule],
  providers: [
    // ...CommandHandlers,
    // ...QueryHandlers,
    OrderMapper,
  ],
  exports: [CqrsModule, OrderMapper],
})
export class OrderApplicationModule {}