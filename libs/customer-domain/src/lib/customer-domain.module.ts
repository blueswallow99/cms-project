import { Module } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './interfaces/customer.repository.interface';

@Module({
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useValue: {}, //it's implemented in infrastructure-db
    },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomerDomainModule {}
