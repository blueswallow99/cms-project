import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../queries/get-customer.query';
import { ICustomerRepository, Customer } from '@cms-project/customer-domain';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const { id } = query;
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return customer;
  }
}