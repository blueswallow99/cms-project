import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCustomersQuery } from '../queries/get-all-customers.query';
import { ICustomerRepository, Customer, CUSTOMER_REPOSITORY } from '@cms-project/customer-domain';
import { Inject } from '@nestjs/common';
import { CustomerRepository } from '@cms-project/infrastructure-db';

@QueryHandler(GetAllCustomersQuery)
export class GetAllCustomersHandler implements IQueryHandler<GetAllCustomersQuery> {
  constructor(@Inject(CUSTOMER_REPOSITORY)
  private customerRepository: CustomerRepository,) {}

  async execute(_: GetAllCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}