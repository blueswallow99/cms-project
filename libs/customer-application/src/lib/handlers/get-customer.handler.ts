import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../queries/get-customer.query';
import { ICustomerRepository, Customer, CUSTOMER_REPOSITORY } from '@cms-project/customer-domain';
import { Inject } from '@nestjs/common';
import { CustomerRepository } from '@cms-project/infrastructure-db';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(@Inject(CUSTOMER_REPOSITORY)
  private customerRepository: CustomerRepository,) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const { id } = query;
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return customer;
  }
}