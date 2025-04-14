import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './interfaces/order.repository.interface';

@Module({
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useValue: {},
    },
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrderDomainModule {}
