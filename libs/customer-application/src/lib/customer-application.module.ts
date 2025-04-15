import { Module } from '@nestjs/common';
import { CreateCustomerCommand } from './commands/create-customer.command';
import { CreateCustomerHandler } from './handlers/create-customer.handler';
import { DeleteCustomerCommand } from './commands/delete-customer.command';
import { DeleteCustomerHandler } from './handlers/delete-customer.handler';
import { GetAllCustomersHandler } from './handlers/get-all-customers.handler';
import { GetCustomerHandler } from './handlers/get-customer.handler';
import { UpdateCustomerCommand } from './commands/update-customer.command';
import { UpdateCustomerHandler } from './handlers/update-customer.handler';
import { CustomerEntity, CustomerRepository } from '@cms-project/infrastructure-db';
import { CqrsModule } from '@nestjs/cqrs';
import { CUSTOMER_REPOSITORY } from '@cms-project/customer-domain';
import { TypeOrmModule } from '@nestjs/typeorm';

const CommandHandlers = [
  CreateCustomerHandler,
  DeleteCustomerHandler,
  GetAllCustomersHandler,
  GetCustomerHandler,
  UpdateCustomerHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CustomerEntity]),],
  providers: [
    ...CommandHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
  ],
  exports: [],
})
export class CustomerApplicationModule {}
