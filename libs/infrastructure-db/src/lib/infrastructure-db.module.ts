import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '@cms-project/customer-domain';
import { CustomerRepository } from './repositories/customer.repository';
import { ORDER_REPOSITORY } from '@cms-project/order-domain';
import { OrderRepository } from './repositories/order.repository';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, OrderEntity, OrderItemEntity])],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY, ORDER_REPOSITORY],
})
export class InfrastructureDbModule {}
